import { PageInfo } from "./common";
import { Scan, ScanConnection } from "./scan";

export class Project {
    projectId: string;
    entityId: string;
    name: string;
    created: any;
    latestScan: Scan;
    scans: ScanConnection;
    childProjects: ProjectConnection;
    errorMsg: string;
    log: string;
    tags: string[];
}

export class ProjectConnection {
    edges: ProjectEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}

export class ProjectEdge {
    node: Project;
    cursor: string;
}

export type ProjectQuery = {
    project: Project;
}
