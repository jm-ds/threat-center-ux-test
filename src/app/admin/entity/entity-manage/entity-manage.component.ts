import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityService } from '@app/admin/services/entity.service';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { AuthenticationService } from '@app/security/services';
import { ITreeOptions, TreeComponent, TreeNode } from '@circlon/angular-tree-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EntityModel, TreeViewNodeModel } from '../entity.class';
import { ChildEntityManageComponent } from './child-entity/child-manage.component';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

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
    @ViewChild('tree', { static: true }) tree: TreeComponent;

    constructor(
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private entityService: EntityService,
        private modalService: NgbModal,
        private coreHelperService: CoreHelperService,
        private toastr: ToastrService
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
        }
    }

    ngAfterViewInit(): void { }
    ngOnDestroy(): void { }

    //helper function for assign tree data
    async getTreeEntityData() {
        if (!!this.route.snapshot.data['defaultEntityDetails'] && this.route.snapshot.data['defaultEntityDetails'].data.entity) {
            this.userDefaultEntityDetails = this.route.snapshot.data['defaultEntityDetails'].data.entity;
            await this.actualTreeLogic();
            setTimeout(() => {
                this.selectFirstRootNode();
            }, 1000);
        }
    }

    //while initialize tree data
    onTreeLoad(evn) {
        if (!!evn && !!evn.treeModel && !!evn.treeModel.getFirstRoot()) {
            evn.treeModel.getFirstRoot().toggleActivated();
        }
    }

    //event of tree.
    onEvent(ev) {
        if (ev.eventName === 'activate') {
            this.initSelectedEntity(ev.node.data);
        }
    }

    //edit entity with server call.
    editEntity() {
        this.entityService.updateEntity({ entityId: this.selectedTreeNode.entityId, entityName: this.selectedTreeNode.name, entityType: this.selectedTreeNode.entityType })
            .subscribe((data: any) => {
                if (!!data && !!data.data) {
                    this.toastr.success("Entity updated successfully.");
                    this.refreshTreeView(this.selectedTreeNode.entityId, "EDIT", this.selectedTreeNode);
                }
            });
    }

    saveOrgName() {
        //Save Organization name
        debugger;
    }

    //add child entity button call
    addChildEntity() {
        if (this.selectedTreeNode && !!this.selectedTreeNode.entityId) {
            this.manageChildEntity("ADD", { parentEntityId: this.selectedTreeNode.entityId });
        } else {
            if (!this.authService.currentUser || !this.authService.currentUser.orgId) {
                Swal.fire('Not Found', 'Organization not found!', 'error');
            } else {
                this.manageChildEntity("ADD", { parentEntityId: null });
            }
        }
    }

    //edit child entity data with server call
    editChildEntity(data) {
        this.manageChildEntity("EDIT", data);
    }

    //delete entity data with server call
    deleteEntity(data) {
        this.coreHelperService.swalAlertConfrm("Are you sure?", "Once deleted, you will not be able to recover this entity!")
            .then((willDelete) => {
                if (willDelete.value) {
                    //delete...
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

    //while select any tree node.
    private initSelectedEntity(data) {
        this.childDataList = new Array<EntityModel>();
        this.organizationInfo = { orgId: null, name: null };
        this.selectedTreeNode = new EntityModel();
        if (!!data.tagData) {
            this.selectedTreeNode = Object.assign({}, data.tagData);
            this.selectedTreeNode.isChildEntity = data.isChildEntity;
            this.selectedTreeNode.isProjects = data.isProjects;
            this.selectedTreeNode.isChildEntity = data.children.length >= 1 ? true : false;
        } else {
            if (data.isOrg) {
                this.organizationInfo = {
                    orgId: data.id,
                    name: ''
                };
            } else {
                this.selectedTreeNode = new EntityModel();
            }

        }
        //Init child table list.
        if (!!data.children && data.children.length >= 1) {
            data.children.forEach(d => {
                const entity = Object.assign({}, d['tagData']);
                entity['isChildEntity'] = d['isChildEntity'];
                entity['isProjects'] = d['isProjects'];
                this.childDataList.push(entity);
            });
        }
    }

    //helper method which will initialize tree data
    private async actualTreeLogic() {
        this.recursionHelperArray = new Array();
        if (!!this.userDefaultEntityDetails.parentEntityId && this.userDefaultEntityDetails.parentEntityId !== '') {
            // Here User default entity have parent so root entity will be default entity;
            this.coreHelperService.spinnerEdit("VISIBLE");

            //For now implemented below function logic will change it when server will return proper data with child entity
            await this.populateChildernRecusivaly(this.userDefaultEntityDetails.childEntities.edges, null);
            this.coreHelperService.spinnerEdit("INVISIBLE");
            this.entityTreeNodeList = [
                {
                    id: this.userDefaultEntityDetails.entityId,
                    name: this.userDefaultEntityDetails.name,
                    isExpanded: true,
                    tagData: this.userDefaultEntityDetails,
                    isChildEntity: (!!this.userDefaultEntityDetails.childEntities && this.userDefaultEntityDetails.childEntities.edges.length >= 1) ? true : false,
                    isProjects: (!!this.userDefaultEntityDetails.projects && this.userDefaultEntityDetails.projects.edges.length >= 1) ? true : false,
                    classes: ['text-bold'],
                    children: this.list_to_tree(this.recursionHelperArray),
                    isOrg: false
                }
            ];
        } else {
            // set organization on root of tree because default entity dose not have parent.
            this.coreHelperService.spinnerEdit("VISIBLE");
            await this.populateChildernRecusivaly(this.userDefaultEntityDetails.childEntities.edges, null);
            this.coreHelperService.spinnerEdit("INVISIBLE");
            this.entityTreeNodeList = [
                {
                    id: this.authService.currentUser.orgId,
                    name: !!this.authService.currentUser.organization ? this.authService.currentUser.organization.name : "Organization",
                    isExpanded: true,
                    tagData: null,
                    isChildEntity: true,
                    isProjects: true,
                    classes: ['text-bold'],
                    children: [
                        {
                            id: this.userDefaultEntityDetails.entityId,
                            name: this.userDefaultEntityDetails.name,
                            isExpanded: true,
                            tagData: this.userDefaultEntityDetails,
                            isChildEntity: (!!this.userDefaultEntityDetails.childEntities && this.userDefaultEntityDetails.childEntities.edges.length >= 1) ? true : false,
                            isProjects: (!!this.userDefaultEntityDetails.projects && this.userDefaultEntityDetails.projects.edges.length >= 1) ? true : false,
                            classes: ['text-bold'],
                            children: this.list_to_tree(this.recursionHelperArray),
                            isOrg: false
                        }
                    ],
                    isOrg: true
                }
            ];
        }
    }

    //Temporory method to getting child data recursivly once server return proper record then we don't need this helper func more.
    private async populateChildernRecusivaly(childData, prId) {
        if (childData.length >= 1) {
            for (let i = 0; i < childData.length; i++) {
                if (!!childData[i].node) {
                    let cData: any = await this.entityService.getTreeEntity(childData[i].node.entityId).toPromise();
                    let d = {};
                    d['id'] = childData[i].node.entityId;
                    d['tagData'] = cData.data.entity;
                    d['parentId'] = prId;
                    d['name'] = childData[i].node.name;
                    d['children'] = null;
                    d['isExpanded'] = false;
                    d['isChildEntity'] = (!!cData.data.entity.childEntities && cData.data.entity.childEntities.edges.length >= 1)
                        ? true : false;
                    d['isProjects'] = (!!cData.data.entity.projects && cData.data.entity.projects.edges.length >= 1)
                        ? true : false;
                    d['classes'] = ['text-bold'];

                    this.recursionHelperArray.push(d);
                    if (!!cData.data && !!cData.data.entity && !!cData.data.entity.childEntities
                        && cData.data.entity.childEntities.edges.length >= 1) {
                        await this.populateChildernRecusivaly(cData.data.entity.childEntities.edges, cData.data.entity.entityId);
                    }
                }
            }
        } else {
            this.recursionHelperArray = new Array();
        }
    }

    //Helper function which will return treeview from flat array according to parentId..
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

    //Helper function for child entity manage(open popup and server calls)
    private manageChildEntity(from: string, data) {
        const modelRef = this.modalService.open(ChildEntityManageComponent, { ariaLabelledBy: 'modal-basic-title' });
        modelRef.componentInstance.entityData = Object.assign({}, data);
        modelRef.result.then((result) => {
            if (!!result && !!result.entityId) {
                //edit
                this.entityService.updateEntity({ entityId: result.entityId, entityName: result.name, entityType: result.entityType })
                    .subscribe((data: any) => {
                        if (!!data && !!data.data) {
                            this.toastr.success("Entity updated successfully.");
                            //updating into table
                            this.childDataList.forEach(d => {
                                if (d.entityId === result.entityId) {
                                    d.name = result.name;
                                    d.entityType = result.entityType
                                }
                            });
                            //Updating tree..
                            this.refreshTreeView(result.entityId, "EDIT", result);
                        }
                    });
            } else {
                //add entity..
                this.entityService.createEntity({ entityName: result.name, entityType: result.entityType, parentEntityId: result.parentEntityId })
                    .subscribe((data: any) => {
                        if (!!data && !!data.data) {
                            //updatig into table...
                            let newData = Object.assign({}, data.data.createEntity);
                            newData['isChildEntity'] = (!!newData.childEntities && newData.childEntities.edges.length >= 1) ? true : false;
                            newData['isProjects'] = (!!newData.projects && newData.projects.edges.length >= 1) ? true : false;
                            this.childDataList.push(newData);
                            this.toastr.success("Entity created successfully.");
                            //Updating tree view...
                            this.refreshTreeView(result.parentEntityId, 'ADD_CHILD', data.data.createEntity);
                        }
                    });
            }
        }, (reason) => {
        });
    }

    //Refreshing tree view locally after any actions taken by user
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
                //statements; 
                break;
            }
        }
        this.tree.treeModel.update();
    }

    //Helper function to serlect first root node od the tree.
    private selectFirstRootNode() {
        const firstRoot = this.tree.treeModel.roots[0];
        firstRoot.setActiveAndVisible(true);
        firstRoot.expand();
    }

    //Helper functions to remove children from tree...
    private removeNode(node: TreeNode) {
        let parentNode = node.realParent
            ? node.realParent
            : node.treeModel.virtualRoot;

        _.remove(parentNode.data.children, function (child) {
            return child === node.data;
        });
    }
}
