import { PageInfo } from "./common";
import { Vulnerability } from "./vulnerability";
import {License} from "@app/models/license";
import {ScanAssetsTreeConnection, ScanComponentConnection, ScanLicenseAssetConnection} from "@app/models/scan-asset";

export class ScanRequest {
    login: string;
    repository: string;
    branch: string;
    entityId: string;
    repoType: string;
    projectId: string;
    status?:string;
}

export class Task {
    taskToken?: string = '';
    status?: string = '';
    statusMessage?: string = '';
    pctComplete?: number;
    resourceId?: string = '';
    subtasks?: Task[] = [];
}


export class GitHubUser {
    id?: string = '';
    avatarUrl?: string = '';
    email?: string = '';
    name?: string = '';
    login?: string = '';
    token?: string = '';
    //organizations: Organization[];
    //repositories: Repository[];
    //primaryLanguage: Language;
}


// Model for gitlab user
export class GitLabUser {
    id?: string = '';
    avatarUrl?: string = '';
    email?: string = '';
    name?: string = '';
    username?: string = '';
    token?: string = '';
}


// Model for bitbucket user
export class BitbucketUser {
    id?: string = '';
    avatarUrl?: string = '';
    email?: string = '';
    name?: string = '';
    username?: string = '';
    token?: string = '';
}


export class Organization {
    avatarUrl?: string = '';
    name?: string = '';
    repositories: Repository[];
}

export class Repository {
    repositoryName?: string = '';
    repositoryOwner?: string = '';
    private?: boolean;
    defaultBranch?: Branch;
    branches?: Branch[];
    scanBranch?: string = '';
}

export class Language {
    name?: string = '';
    color?: string = '';
}

export class Branch {
    name?: string = '';
}

export class UserSelection {
    repository: string;
    branch: string;
}

export class Scan {
    scanId: string;
    branch: string;
    vulnerabilities: Vulnerability[];
    scanRepository: Repository;
    scanMetrics: any;
    scanAssets: any;
    licenses: ScanLicense[];
}

export class GithubAccount {
    accessToken: string;
    scopes: string[];
}

export class RepositoryAccounts {
    githubAccount: GithubAccount;
}

export class ScanConnection {
    edges: ScanEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}

export class ScanEdge {
    node: Scan;
    cursor: string;
}

export class ScanLicense {
    orgId: string;
    scanId: string;
    licenseId: string;
    licenseDiscovery: string;
    spdxId: string;
    name: string;
    style: string;
    type: string;
    publicationYear: number;
    isOsiApproved: boolean;
    isFsfLibre: boolean;
    category: string;
    licenseOrigin: string;
    license: License;
    assetCount: number;
    scanComponents: ScanComponentConnection;
    scanAssetsTree: ScanAssetsTreeConnection;
    scanLicenseAssets: ScanLicenseAssetConnection;
}

export class JiraTicket {
    id: string;
    key: string;
    self: string;
}

export class SnippetMatchResult {
    matchTime: number;
    scanTime: number;
    snippetSize: number;
    snippetMatches: SnippetMatch[];
};
export class SnippetMatch {
    matchAssetId: string;
    repositoryName: string;
    repositoryOwner: string;
    assetName: string;
    matchPercent: number;
    earliestRelease: AssetRelease;
    latestRelease: AssetRelease;
    earliestReleaseLicenses: RepositoryReleaseLicense[];
    latestReleaseLicenses: RepositoryReleaseLicense[];
    assetLicenses: AssetLicense[];
};

export class AssetRelease {
    releaseDate: Date;
    releaseName: string;
};
export class AssetLicense {
    licenseId: string;
    name: string;
};
export class RepositoryReleaseLicense {
    licenseId: string;
    licenseName: string;
};

// GRAPHQL QUERIES
export type TaskQuery = {
    task_submitScanRequest: Task;
    task_update: Task;
};

export type GitHubUserQuery = {
    gitHubUser: GitHubUser;
};

// GitLabUserQuery
export type GitLabUserQuery = {
    gitLabUser: GitLabUser;
};

// BitbucketUserQuery
export type BitbucketUserQuery = {
    bitbucketUser: BitbucketUser;
};

export type ScanQuery = {
    scan: Scan;
};

export type SnippetQuery = {
    snippetMatchResult: SnippetMatchResult;
};

// check if already scanned
export type CheckAlreadyScannedQuery = {
    checkAlreadyScannedProject: Date
};

export type ScanLicenseQuery = {
    scanLicense: ScanLicense;
};

export type JiraTicketQuery = {
    licenseJiraTicket: JiraTicket;
};

