import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityService } from '@app/admin/services/entity.service';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { AuthenticationService } from '@app/security/services';
import { ITreeOptions, TreeComponent } from '@circlon/angular-tree-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EntityModel, TreeViewNodeModel } from '../entity.class';
import { ChildEntityManageComponent } from './child-entity/child-manage.component';

@Component({
    selector: 'app-entity-manage',
    templateUrl: './entity-manage.component.html',
    styleUrls: ['./entity-manage.component.scss']
})

export class EntityManageComponent implements OnInit, OnDestroy, AfterViewInit {

    entityTreeNodeList = new Array<TreeViewNodeModel>();
    treeNodeOptions: ITreeOptions;
    userDefaultEntityDetails: EntityModel;
    selectedTreeNode: EntityModel = new EntityModel();
    recursionHelperArray = [];
    @ViewChild('tree', { static: true }) tree: TreeComponent;

    constructor(
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private entityService: EntityService,
        private modalService: NgbModal,
        private coreHelperService: CoreHelperService,
        private toastr: ToastrService,
    ) {
    }
    ngOnInit(): void {
        this.getTreeEntityData();
        this.selectedTreeNode.entityType = '';
        this.treeNodeOptions = {
            levelPadding: 5,
            useVirtualScroll: false,
            animateExpand: true,
            scrollOnActivate: false,
            animateSpeed: 5,
            animateAcceleration: 2.5,
        }
    }
    ngAfterViewInit(): void { }
    ngOnDestroy(): void {
        // throw new Error('Method not implemented.');
    }
    async getTreeEntityData() {
        if (!!this.route.snapshot.data['defaultEntityDetails'] && this.route.snapshot.data['defaultEntityDetails'].data.entity) {
            this.userDefaultEntityDetails = this.route.snapshot.data['defaultEntityDetails'].data.entity;
            await this.actualTreeLogic();
        }
    }

    onTreeLoad(evn) {
        if (!!evn && !!evn.treeModel) {
            evn.treeModel.getFirstRoot().toggleActivated();
        }
    }

    onEvent(ev) {
        if (ev.eventName === 'activate') {
            this.initSelectedEntity(ev.node.data);
        }
    }
    editEntity() {
        this.entityService.updateEntity({ entityId: this.selectedTreeNode.entityId, entityName: this.selectedTreeNode.name, entityType: this.selectedTreeNode.entityType })
            .subscribe((data: any) => {
                if (!!data && !!data.data) {
                    this.toastr.success("Entity updated successfully.");
                }
            });
    }
    addChildEntity() {
        this.manageChildEntity("ADD", { parentEntityId: this.selectedTreeNode.entityId });
    }
    editChildEntity(data) {
        this.manageChildEntity("EDIT", data);
    }
    deleteEntity(data) {
        this.coreHelperService.swalAlertConfrm("Are you sure?", "Once deleted, you will not be able to recover this entity!")
            .then((willDelete) => {
                if (willDelete.value) {
                    //delete...
                    this.entityService.deleteEntity(data.entityId)
                        .subscribe(data => {
                            if (!!data && !!data.data) {
                                this.toastr.success("Entity removed successfully.");
                            }
                        });
                }
            });
    }

    private initSelectedEntity(data) {
        if (!!data.tagData) {
            this.selectedTreeNode = Object.assign(data.tagData);
            this.selectedTreeNode.isChildEntity = data.isChildEntity;
            this.selectedTreeNode.isProjects = data.isProjects;
            if (!!this.selectedTreeNode.childEntities && this.selectedTreeNode.childEntities.edges.length >= 1) {
                this.selectedTreeNode.childEntities.edges.forEach(data => {
                    data.node['isChildEntity'] = (!!data.node && !!data.node.childEntities && data.node.childEntities.edges.length >= 1) ? true : false;
                    data.node['isProjects'] = (!!data.node && !!data.node.projects && data.node.projects.edges.length >= 1) ? true : false;
                });
            }
        } else {
            this.selectedTreeNode = new EntityModel();
        }
    }

    private async actualTreeLogic() {
        this.recursionHelperArray = new Array();
        if (!!this.userDefaultEntityDetails.parentEntityId && this.userDefaultEntityDetails.parentEntityId !== '') {
            // Here User default entity have parent so Tree root node will be default entity...;

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
                    children: this.list_to_tree(this.recursionHelperArray)
                }
            ];

        } else {
            //Here User default entity dose not have any parent so organization will be on root.
            this.coreHelperService.spinnerEdit("VISIBLE");
            //For now implemented below function logic will change it when server will return proper data with child entity
            await this.populateChildernRecusivaly(this.userDefaultEntityDetails.childEntities.edges, null);

            this.coreHelperService.spinnerEdit("INVISIBLE");
            this.entityTreeNodeList = [
                {
                    id: this.authService.currentUser.orgId,
                    name: "ORG_TEST_NAME",
                    isExpanded: true,
                    tagData: null,
                    isChildEntity: true,
                    isProjects: true,
                    children: [
                        {
                            id: this.userDefaultEntityDetails.entityId,
                            name: this.userDefaultEntityDetails.name,
                            isExpanded: true,
                            tagData: this.userDefaultEntityDetails,
                            isChildEntity: (!!this.userDefaultEntityDetails.childEntities && this.userDefaultEntityDetails.childEntities.edges.length >= 1) ? true : false,
                            isProjects: (!!this.userDefaultEntityDetails.projects && this.userDefaultEntityDetails.projects.edges.length >= 1) ? true : false,
                            children: this.list_to_tree(this.recursionHelperArray)
                        }
                    ]
                }
            ];
        }
    }



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

    private manageChildEntity(from: string, data) {
        const modelRef = this.modalService.open(ChildEntityManageComponent, { ariaLabelledBy: 'modal-basic-title' });
        modelRef.componentInstance.entityData = Object.assign({}, data);
        modelRef.result.then((result) => {
            if (!!result && !!result.entityId) {
                //edit
                this.entityService.updateEntity({ entityId: result.entityId, entityName: result.name, entityType: result.entityType })
                    .subscribe((data: any) => {
                        if (!!data && !!data.data) {
                            this.selectedTreeNode.childEntities.edges.forEach(d => {
                                if (!!d.node && d.node.entityId === result.entityId) {
                                    d.node.entityName = result.name;
                                    d.node.entityType = result.entityType;
                                }
                            });
                            this.toastr.success("Entity updated successfully.");
                        }
                    });
            } else {
                //add entity..
                this.entityService.createEntity({ entityName: result.name, entityType: result.entityType, parentEntityId: result.parentEntityId })
                    .subscribe((data: any) => {
                        if (!!data && !!data.data) {
                            this.selectedTreeNode.childEntities.edges.push({ node: data.data.createEntity });
                            this.toastr.success("Entity created successfully.");
                            // and refresh tree view...
                        }
                    });
            }
            //   this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private refreshTreeView() {

    }
}
