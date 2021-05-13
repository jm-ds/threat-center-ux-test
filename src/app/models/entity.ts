import { PageInfo } from "./common";
import { License } from "./license";
import { EntityMetricsGroup, EntityMetricsSummaryGroup } from "./metrics";
import { ProjectConnection } from "./project";
import { Vulnerability } from "./vulnerability";

export class Entity {
    entityId: string;
    parentEntityId: string;
    name: string;
    projects: ProjectConnection;
    entityMetricsGroup: EntityMetricsGroup;
    entityMetricsSummaryGroup: EntityMetricsSummaryGroup;
    entityComponents: any;
    vulnerabilities: Vulnerability[];
    licenses: License[];
    childEntities: Entity[];
    entitySettings: EntitySettings;
}

export class EntityConnection {
    edges: EntityEdge[];
    pageInfo: PageInfo;
    totalCount: number;
    constructor() { }
}

export class EntityEdge {
    node: Entity;
    cursor: string;
    constructor(node: Entity, cursor: string) {
        this.node = node;
        this.cursor = cursor;
    }
}

export type EntityQuery = {
    entity: Entity;
}

export type EntityListQuery = {
    entities: EntityConnection;
}

export class JiraCredentials {
    projectUrl: string;
    projectKey: string;
    email: string;
    apiToken: string;
}

export class EntitySettings {
    orgId: string;
    entityId: string;
    alertEmailAdressess: string[];
    alertSlackUrls: string[];
    jiraCredentials: JiraCredentials;
}

export type EntitySettingsQuery = {
    entitySettings: EntitySettings;
}
