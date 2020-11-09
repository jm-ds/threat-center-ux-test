import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/security/services';
import { ITreeOptions, TreeComponent } from '@circlon/angular-tree-component';
import { EntityModel, TreeViewNodeModel } from '../entity.class';

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

    @ViewChild('tree', { static: true }) tree: TreeComponent;

    constructor(
        private authService: AuthenticationService,
        private route: ActivatedRoute) {
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
    getTreeEntityData() {
        if (!!this.route.snapshot.data['defaultEntityDetails'] && this.route.snapshot.data['defaultEntityDetails'].data.entity) {
            this.userDefaultEntityDetails = this.route.snapshot.data['defaultEntityDetails'].data.entity;
            this.actualTreeLogic();
        }
    }

    onTreeLoad(evn) {
        setTimeout(() => {
            if (!!this.tree.treeModel.getFirstRoot().data.tagData)
                this.tree.treeModel.getFirstRoot().toggleActivated();
        }, 1000);
    }

    onEvent(ev) {
        if (ev.eventName === 'activate') {
            this.initSelectedEntity(ev.node.data);
        }
    }
    editEntity() {
    }
    private initSelectedEntity(data) {
        if (!!data.tagData) {
            this.selectedTreeNode = Object.assign(data.tagData);
            this.selectedTreeNode.isChildEntity = data.isChildEntity;
            this.selectedTreeNode.isProjects = data.isProjects;
        } else {
            this.selectedTreeNode = new EntityModel();
        }

    }
    private actualTreeLogic() {
        if (!!this.userDefaultEntityDetails.parentEntityId && this.userDefaultEntityDetails.parentEntityId !== '') {
            // root node will be it self, becase default entity have parent;
            this.entityTreeNodeList = [
                {
                    id: this.userDefaultEntityDetails.entityId,
                    name: this.userDefaultEntityDetails.name,
                    isExpanded: true,
                    tagData: this.userDefaultEntityDetails,
                    isChildEntity: (!!this.userDefaultEntityDetails.childEntities && this.userDefaultEntityDetails.childEntities.edges.length >= 1) ? true : false,
                    isProjects: (!!this.userDefaultEntityDetails.projects && this.userDefaultEntityDetails.projects.edges.length >= 1) ? true : false,
                    children: this.getChildren(this.userDefaultEntityDetails.childEntities.edges)
                }
            ]
        } else {
            // set organization on root of tree because default entity dose not have parent.
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
                            children: this.getChildren(this.userDefaultEntityDetails.childEntities.edges)
                        }
                    ]
                }
            ]
        }
    }
    private getChildren(childData) {

        let data = [];
        if (childData.length >= 1) {
            for (let i = 0; i < childData.length; i++) {
                if (!!childData[i].node) {
                    let treeData = new TreeViewNodeModel();
                    treeData.id = childData[i].node.entityId;
                    treeData.name = childData[i].node.name;
                    treeData.isExpanded = false;
                    treeData.tagData = childData[i].node;
                    treeData.isChildEntity = (!!childData[i].node.childEntities && childData[i].node.childEntities.edges.length >= 1)
                        ? true : false;
                    treeData.isProjects = (!!childData[i].node.projects && childData[i].node.projects.edges.length >= 1)
                        ? true : false,
                        data.push(treeData);
                }
            }
        } else {
            return new Array();
        }
        return data;
    }
}
