import { JiraCredentials } from "@app/models";

export class TreeViewNodeModel {
    id: string;
    name: string;
    isExpanded: boolean;
    children?: Array<TreeViewNodeModel>;
    tagData?: EntityModel;
    isChildEntity: boolean;
    isProjects: boolean;
    classes: Array<string>;
    isOrg: boolean = false;
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

export class OrganizationUpdateRequestInput {
    readonly orgId: string;
    readonly name: string;

    constructor(orgId: string, name: string) {
        this.orgId = orgId;
        this.name = name;
    }
    static from(org) {
        return new OrganizationUpdateRequestInput(org.orgId, org.name);
    }
}


export class EntitySettingsRequestInput {
    readonly entityId: string;
    readonly alertEmailAdressess: string[];
    readonly alertSlackUrls: string[];
    readonly jiraCredentials: JiraCredentials;

    constructor(entityId: string, alertEmailAdressess: string[], alertSlackUrls: string[], jiraCredentials: JiraCredentials) {
        this.entityId = entityId;
        this.alertEmailAdressess = alertEmailAdressess;
        this.alertSlackUrls = alertSlackUrls;
        this.jiraCredentials = jiraCredentials;
    }

    static forEmails (entityId: string, alertEmailAdressess: string[]) {
        return new EntitySettingsRequestInput(entityId, alertEmailAdressess, undefined, undefined);
    }

    static forSlackUrl (entityId: string, alertSlackUrls: string[]) {
        return new EntitySettingsRequestInput(entityId, undefined, alertSlackUrls, undefined);
    }

    static forJira (entityId: string, jiraCredentials: JiraCredentials) {
        return new EntitySettingsRequestInput(entityId, undefined, undefined, jiraCredentials);
    }

}
