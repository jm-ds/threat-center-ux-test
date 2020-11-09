export class TreeViewNodeModel {
    id: string;
    name: string;
    isExpanded: boolean;
    children?: Array<TreeViewNodeModel>;
    tagData?: EntityModel;
    isChildEntity: boolean;
    isProjects: boolean;
    constructor(init?: Partial<TreeViewNodeModel>) {
        Object.assign(this, init);
    }
}


export class EntityModel {
    entityId: string;
    name: string;
    parentEntityId: string;
    childEntities: ChildModel;
    entityMetrics: any;
    projects: ChildModel;
    entityType?: string;
    isChildEntity?:boolean;
    isProjects?:boolean;
    constructor(init?: Partial<EntityModel>) {
        Object.assign(this, init);
    }
}

export class ChildModel {
    edges: Array<any>;
}