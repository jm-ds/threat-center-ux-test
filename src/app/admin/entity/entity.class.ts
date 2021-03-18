export class TreeViewNodeModel {
    id: string;
    name: string;
    isExpanded: boolean;
    children?: Array<TreeViewNodeModel>;
    tagData?: EntityModel;
    isChildEntity: boolean;
    isProjects: boolean;
    classes: Array<string>;
    isOrg:boolean = false;
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
    entityType?: string = "";
    isChildEntity?: boolean;
    isProjects?: boolean;
    constructor(init?: Partial<EntityModel>) {
        Object.assign(this, init);
    }
}

export class ChildModel {
    edges: Array<any>;
}


export class EntityRequestInput {
    readonly entityName: string;
    readonly entityType: string;
    readonly parentEntityId: string;

    constructor(entityName: string, entityType: string, parentEntityId: string) {
        this.entityName = entityName;
        this.entityType = entityType;
        this.parentEntityId = parentEntityId;
    }

    static from(entity) {
        return new EntityRequestInput(entity.entityName, entity.entityType, entity.parentEntityId);
    }
}


export class EntityUpdateRequestInput {
    readonly entityId: string;
    readonly entityName: string;
    readonly entityType: string;


    constructor(entityId: string, entityName: string, entityType: string) {
        this.entityId = entityId;
        this.entityName = entityName;
        this.entityType = entityType;
    }
    static from(entity) {
        return new EntityUpdateRequestInput(entity.entityId, entity.entityName, entity.entityType);
    }
}