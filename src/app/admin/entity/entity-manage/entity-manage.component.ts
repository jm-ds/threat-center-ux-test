import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators';

import { CoreHelperService } from '@app/services/core/core-helper.service';
import { AuthenticationService } from '@app/security/services';
import { ITreeOptions, TreeComponent, TreeNode } from '@circlon/angular-tree-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EntityModel, TreeViewNodeModel } from '../entity.class';
import { ChildEntityManageComponent } from './child-entity/child-manage.component';
import * as _ from 'lodash';
import { User } from '@app/models/user';
import { AlertService } from '@app/services/core/alert.service';
import {EntityEdge} from "@app/models";
import { EntityManagerService } from '@app/services/entity-manage.service';

@Component({
    selector: 'app-entity-manage',
    templateUrl: './entity-manage.component.html',
    styleUrls: ['./entity-manage.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})

export class EntityManageComponent implements OnInit, OnDestroy, AfterViewInit {

    entityTreeNodeList = new Array<TreeViewNodeModel>();
    treeNodeOptions: ITreeOptions;
    userDefaultEntityDetails: EntityModel;
    selectedTreeNode: EntityModel = new EntityModel();
    recursionHelperArray = [];
    childDataList: Array<EntityModel> = new Array<EntityModel>();
    organizationInfo: { orgId: string, name: string };
    isOrgChangeNameLinkAppear: boolean = false;

    @ViewChild('tree', { static: true }) tree: TreeComponent;

    constructor(
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private entityService: EntityManagerService,
        private modalService: NgbModal,
        private coreHelperService: CoreHelperService,
        private toastr: ToastrService,
        private alertService: AlertService
    ) {
    }

    ngOnInit(): void {
        this.getTreeEntityData();
        this.selectedTreeNode.entityType = '';
        this.treeNodeOptions = {
            levelPadding: 4,
            useVirtualScroll: false,
            animateExpand: true,
            scrollOnActivate: false,
            animateSpeed: 5,
            animateAcceleration: 2.5
        };
    }

    ngAfterViewInit(): void { }
    ngOnDestroy(): void { }

    // helper function for assign tree data
    async getTreeEntityData() {
        if (!!this.route.snapshot.data['defaultEntityDetails'] && this.route.snapshot.data['defaultEntityDetails'].data.entity) {
            this.userDefaultEntityDetails = this.route.snapshot.data['defaultEntityDetails'].data.entity;
            await this.actualTreeLogic();
            setTimeout(() => {
                this.selectFirstRootNode();
            }, 1000);
        }
    }

    // while initialize tree data
    onTreeLoad(evn) {
        if (!!evn && !!evn.treeModel && !!evn.treeModel.getFirstRoot()) {
            evn.treeModel.getFirstRoot().toggleActivated();
        }
    }

    // event of tree.
    onEvent(ev) {
        if (ev.eventName === 'activate') {
            this.initSelectedEntity(ev.node.data);
        }
    }

    // edit entity with server call.
    editEntity() {
        this.entityService.updateEntity({ entityId: this.selectedTreeNode.entityId, entityName: this.selectedTreeNode.name, entityType: this.selectedTreeNode.entityType })
            .subscribe((data: any) => {
                if (!!data && !!data.data) {
                    this.toastr.success("Entity updated successfully.");
                    this.refreshTreeView(this.selectedTreeNode.entityId, "EDIT", this.selectedTreeNode);
                }
            });
    }

    // Update Organization Name
    saveOrgName() {
        // Save Organization name
        this.entityService.updateOrganizationName(this.organizationInfo)
            .subscribe((data: any) => {
                if (!!data && !!data.data && !!data.data.updateOrgName) {
                    this.toastr.success("Organization updated successfully.");
                    let user: User = this.authService.currentUser;
                    if (!!user) {
                        if (!!user.organization) {
                            user.organization.name = this.organizationInfo.name;
                            this.authService.setCurrentUser(user);
                        }
                    }
                }

            });
    }

    // add child entity button call
    addChildEntity() {
        if (this.selectedTreeNode && !!this.selectedTreeNode.entityId) {
            this.manageChildEntity("ADD", { parentEntityId: this.selectedTreeNode.entityId });
        } else {
            if (!this.authService.currentUser || !this.authService.currentUser.orgId) {
                this.alertService.alertBox('Organization not found!','Not Found','error');
            } else {
                this.manageChildEntity("ADD", { parentEntityId: null });
            }
        }
    }

    // edit child entity data with server call
    editChildEntity(data) {
        this.manageChildEntity("EDIT", data);
    }

    // delete entity data with server call
    deleteEntity(data) {
        this.alertService.alertConfirm("Are you sure?", "Once deleted, you will not be able to recover this entity!"
        ,'warning',true,true,'#4680ff', '#6c757d','Yes', 'No')
            .then((willDelete) => {
                if (willDelete.value) {
                    // delete...
                    this.entityService.deleteEntity(data.entityId)
                        .subscribe(res => {
                            if (!!res && !!res.data) {
                                this.toastr.success("Entity removed successfully.");
                                this.refreshTreeView(data.entityId, "DELETE", null);
                            }
                        });
                }
            });
    }

    // while select any tree node.
    private initSelectedEntity(data) {
        this.childDataList = new Array<EntityModel>();
        this.organizationInfo = { orgId: null, name: null };
        this.selectedTreeNode = new EntityModel();
        if (!!data.tagData) {
            this.selectedTreeNode = Object.assign({}, data.tagData);
            this.selectedTreeNode.isChildEntity = data.isChildEntity;
            this.selectedTreeNode.isProjects = data.isProjects;
            this.selectedTreeNode.isChildEntity = data.children.length >= 1;
        } else {
            if (data.isOrg) {
                this.organizationInfo = {
                    orgId: data.id,
                    name: data.name
                };
            } else {
                this.selectedTreeNode = new EntityModel();
            }

        }
        // Init child table list.
        if (!!data.children && data.children.length >= 1) {
            data.children.forEach(d => {
                const entity = Object.assign({}, d['tagData']);
                entity['isChildEntity'] = d['isChildEntity'];
                entity['isProjects'] = d['isProjects'];
                this.childDataList.push(entity);
            });
        }
    }

    // helper method which will initialize tree data
    private async actualTreeLogic() {
        this.recursionHelperArray = new Array();

        this.coreHelperService.spinnerEdit("VISIBLE");

        let orgId = this.authService.currentUser.orgId;
        let topLevelEntities: any = await this.getTopLevelEntities(orgId);
        let topLevelEntitiesEdges = [];
        let arr = topLevelEntities.data.topLevelEntitiesByOrg;
        for (let item of arr) {
            let edge = new EntityEdge(item, null);
            topLevelEntitiesEdges.push(edge);
        }

        await this.populateChildernRecusivaly(topLevelEntitiesEdges, null);
        this.coreHelperService.spinnerEdit("INVISIBLE");

        // set organization on root of tree because default entity dose not have parent.
        this.entityTreeNodeList = [
            {
                id: this.authService.currentUser.orgId,
                name: this.getOrganizationInfo(),
                isExpanded: true,
                tagData: null,
                isChildEntity: true,
                isProjects: true,
                classes: ['text-bold'],
                children: this.list_to_tree(this.recursionHelperArray),
                isOrg: true
            }
        ];
    }

    private getOrganizationInfo(): string {
        let orgName = "";
        if (!!this.authService.currentUser.organization) {
            if (this.authService.currentUser.organization.name === this.authService.currentUser.organization.orgId) {
                orgName = "PoC Company";
                this.isOrgChangeNameLinkAppear = true;
            } else {
                this.isOrgChangeNameLinkAppear = false;
                orgName = this.authService.currentUser.organization.name;
            }

        } else {
            orgName = "PoC Company";
            this.isOrgChangeNameLinkAppear = true;
        }
        return orgName;
    }

    // Temporary method to getting child data recursivly once server return proper record then we don't need this helper func more.
    private async populateChildernRecusivaly(childData, prId) {
        if (childData.length >= 1) {
            for (let i = 0; i < childData.length; i++) {
                if (!!childData[i].node) {
                    const cData = await this.entityService
                      .getTreeEntity(childData[i].node.entityId)
                      .pipe(
                        first()
                      )
                      .toPromise();

                    let d = {};
                    d['id'] = childData[i].node.entityId;
                    d['tagData'] = cData.data.entity;
                    d['parentId'] = prId;
                    d['name'] = childData[i].node.name;
                    d['children'] = null;
                    d['isExpanded'] = false;
                    d['isChildEntity'] = (!!cData.data.entity.childEntities && cData.data.entity.childEntities.edges.length >= 1);
                    d['isProjects'] = (!!cData.data.entity.projects && cData.data.entity.projects.edges.length >= 1);
                    d['classes'] = ['text-bold'];

                    this.recursionHelperArray.push(d);
                    if (!!cData.data && !!cData.data.entity && !!cData.data.entity.childEntities
                        && cData.data.entity.childEntities.edges.length >= 1) {
                        await this.populateChildernRecusivaly(cData.data.entity.childEntities.edges, cData.data.entity.entityId);
                    }
                }
            }
        } else {
            this.recursionHelperArray = [];
        }
    }

    // Helper function which will return treeview from flat array according to parentId..
    private list_to_tree(list) {
        var map = {}, node, roots = [], i;
        for (i = 0; i < list.length; i += 1) {
            map[list[i].id] = i; // initialize the map
            list[i].children = []; // initialize the children
        }
        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.parentId !== "0" && !!node.parentId) {
                // if you have dangling branches check that map[node.parentId] exists
                list[map[node.parentId]].children.push(node);
            } else {
                roots.push(node);
            }
        }
        return roots;
    }

    // Helper function for child entity manage(open popup and server calls)
    private manageChildEntity(from: string, data) {
        const modelRef = this.modalService.open(ChildEntityManageComponent, { ariaLabelledBy: 'modal-basic-title' });
        modelRef.componentInstance.entityData = Object.assign({}, data);
        modelRef.result.then((result) => {
            if (!!result && !!result.entityId) {
                // edit
                this.entityService.updateEntity({ entityId: result.entityId, entityName: result.name, entityType: result.entityType })
                    .subscribe((data: any) => {
                        if (!!data && !!data.data) {
                            this.toastr.success("Entity updated successfully.");
                            // updating into table
                            this.childDataList.forEach(d => {
                                if (d.entityId === result.entityId) {
                                    d.name = result.name;
                                    d.entityType = result.entityType
                                }
                            });
                            // Updating tree..
                            this.refreshTreeView(result.entityId, "EDIT", result);
                        }
                    });
            } else {
                // add entity..
                this.entityService.createEntity({ entityName: result.name, entityType: result.entityType, parentEntityId: result.parentEntityId })
                    .subscribe((data: any) => {
                        if (!!data && !!data.data) {
                            // updatig into table...
                            let newData = Object.assign({}, data.data.createEntity);
                            newData['isChildEntity'] = (!!newData.childEntities && newData.childEntities.edges.length >= 1) ? true : false;
                            newData['isProjects'] = (!!newData.projects && newData.projects.edges.length >= 1) ? true : false;
                            this.childDataList.push(newData);
                            this.toastr.success("Entity created successfully.");
                            // Updating tree view...
                            this.refreshTreeView(result.parentEntityId, 'ADD_CHILD', data.data.createEntity);
                        }
                    });
            }
        }, (reason) => {
        });
    }

    // Refreshing tree view locally after any actions taken by user
    private refreshTreeView(entityId, action, eData) {
        switch (action) {
            case 'EDIT': {
                const node = this.tree.treeModel.getNodeById(entityId);
                node.data['tagData'] = eData;
                node.data['name'] = eData.name;
                break;
            }
            case 'DELETE': {
                const nodeToDelete = this.tree.treeModel.getNodeById(entityId);
                this.removeNode(nodeToDelete);
                this.selectFirstRootNode();
                break;
            }
            case 'ADD_CHILD': {
                entityId = !entityId || entityId == '' ? this.authService.currentUser.orgId : entityId;
                const pNode = this.tree.treeModel.getNodeById(entityId);
                pNode.data['children'].push({
                    id: eData.entityId,
                    name: eData.name,
                    tagData: eData,
                    isExpanded: false,
                    children: new Array(),
                    isChildEntity: (!!eData.childEntities && eData.childEntities.edges.length >= 1) ? true : false,
                    isProjects: (!!eData.projects && eData.projects.edges.length >= 1) ? true : false
                });
                pNode.data['isChildEntity'] = true;
                this.selectedTreeNode['isChildEntity'] = true;
                break;
            }
            default: {
                // statements;
                break;
            }
        }
        this.tree.treeModel.update();
    }

    // Helper function to serlect first root node od the tree.
    private selectFirstRootNode() {
        const firstRoot = this.tree.treeModel.roots[0];
        firstRoot.setActiveAndVisible(true);
        firstRoot.expand();
    }

    // Helper functions to remove children from tree...
    private removeNode(node: TreeNode) {
        let parentNode = node.realParent
            ? node.realParent
            : node.treeModel.virtualRoot;

        _.remove(parentNode.data.children, function (child) {
            return child === node.data;
        });
    }

  private async getTopLevelEntities(orgId: string) {
    return await this.entityService
      .getTopLevelEntitiesByOrg(orgId)
      .pipe(
        first()
      )
      .toPromise();
  }
}
