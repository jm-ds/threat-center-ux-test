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
  id?: string;
  avatarUrl?: string;
  email?: string;
  name?: string;
  login?: string;
  token?: string;
  organizations: {
    edges: Organization[]
  };
  repositories: {
    edges: Repository[]
  };
  // primaryLanguage: Language;
}

/** Model for GitLab user */
export class GitLabUser {
  id?: string;
  avatarUrl?: string;
  email?: string;
  name?: string;
  username?: string;
  token?: string;
  gitLabProjects: Repository[];
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
  node: {
    avatarUrl?: string;
    name?: string;
    repositories: {
      edges: Repository[]
    };
  };
}

export class Repository {
    repositoryName?: string = '';
    repositoryOwner?: string = '';
    private?: boolean;
    defaultBranch?: Branch;
    branches?: Branch[];
    scanBranch?: string = '';
    repositoryEndpointType?: string = '';
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
    scanAssetsTree: ScanAssetsTreeConnection;
    licenses: ScanLicense[];
    scanOpenSourceProject: ScanOpenSourceProject;
    created: Date;
}

export class ScanOpenSourceProject {
    owner: string;
    name: string;
    repoWebsite: string;
}

export class LicenseAssetAttribution {
  attributionStatus: string;
  attributedDate: Date;
  attributedBy: string;
  attributedComment: string;
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
    scanOpenSourceProject: ScanOpenSourceProject;
    licenseAssetAttribution: LicenseAssetAttribution;
}

export class JiraTicket {
    id: string;
    key: string;
    self: string;
}

export class DeploymentSettings {
  orgId: string;
  deploymentMode: string;
  cloudServerUrl: string;
  cloudThreatrixSchemeIp: string;
  cloudApiKey: string;
}

export class SnippetMatchResult {
    matchTime: number;
    scanTime: number;
    snippetSize: number;
    matchSize: number;
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
}

export class AssetLicense {
  licenseId: string;
  licenseName: string;
  licenseContext: string;
  name: string;
}

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

export interface DeploymentDataQuery {
  deploymentSettings: DeploymentSettings;
}
