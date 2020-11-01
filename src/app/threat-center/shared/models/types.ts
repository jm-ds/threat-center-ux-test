export class ScanRequest {
  login:string;
  repository:string;
  branch:string;
  entityId:string;
  repoType: string;
  projectId: string;
}

export class Task {
  taskToken?: string ='';
  status?: string ='';
  statusMessage?: string ='';
  pctComplete?: number;
  resourceId?: string ='';
  subtasks?: Task[]=[];
}


export class GitHubUser {
  id?: string ='';
  avatarUrl?: string ='';
  email?: string ='';
  name?: string ='';
  login?: string ='';
  token?: string='';
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
  avatarUrl?: string ='';
  name?: string ='';
  repositories: Repository[];
}

export class Repository {
  repositoryName?: string ='';
  repositoryOwner?: string='';
  private?:boolean;
  defaultBranch?:Branch;
  branches?:Branch[];
  scanBranch?:string='';
}

export class Language {
  name?: string ='';
  color?: string ='';
}

export class Branch {
  name?: string ='';
}

export class UserSelection {
  repository:string;
  branch:string;
}

export class Entity {
  entityId:string;
  name:string;
  projects:ProjectConnection;
  entityMetrics:EntityMetrics;
  entityComponents:any;
}

export class EntityMetrics {
  vulnerabilityMetrics:VulnerabilityMetrics;
  licenseMetrics:LicenseMetrics;
  componentMetrics:ComponentMetrics;
  assetMetrics:AssetMetrics;
}

export class VulnerabilityMetrics {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

export class LicenseMetrics {
  copyleftStrong: number;
  copyleftWeak: number;
  copyleftPartial: number;
  copyleftLimited: number;
  copyleft: number;
  custom: number;
  dual: number;
  permissive: number;
}

export class ComponentMetrics {
  notLatest: number;
  vulnerabilities: number;
  riskyLicenses: number;
}

export class AssetMetrics {
  embedded: number;
  analyzed: number;
  skipped: number;
}

export class Project {
  projectId:string;
  name:string;
  created:any;
  latestScan: Scan;
  scans: ScanConnection;
}

export class Scan {
  scanId:string;
  branch:string;
  vulnerabilities:Vulnerability[];
  scanRepository:Repository;
  scanMetrics:any;
}

export class TxComponent {
  componentId;
}

export class Vulnerability {
  vulnerabilityId:string;
  description:string;
  references:string;
  published:string;
  updated:string;
  cwe:Cwe;
  cvssV2BaseScore:string;
  cvssV2ImpactSubScore:string;
  cvssV2ExploitabilitySubScore:string;
  cvssV2Vector:string;
  cvssV3BaseScore:string;
  cvssV3ImpactSubScore:string;
  cvssV3ExploitabilitySubScore:string;
  cvssV3Vector:string;
  severity:string;
  recommendation:string;
  credits:string;
  vulnerableVersions:string;
  patchedVersions:string;
}

export class License {
  licenseId:string;
  spdxId:string;
  name:string;
  body:string;
  description:string;
  isOsiApproved:boolean;
  isFsfLibre:boolean;
  isDeprecated:boolean;
  attributes:LicenseAttribute[];
}

export class LicenseAttribute {
  attributeType:string;
  key:string
}

export class Cwe {
  cweId:string;
  name:string;
}

export class ScanAsset {
  name:string;
  size:number;
  fileSize:number;
  scanAssetId:string;
  originAssetId:string;
  workspacePath:string;
  status:string;
  content:string;
  matchRepository:Repository;
  matches:ScanAssetMatch[];
}

export class ScanAssetMatch {
  assetMatchId:string;
  percentMatch:number;
}

export class GithubAccount {
  accessToken: string;
  scopes:string[];
}

export class RepositoryAccounts {
  githubAccount:GithubAccount;
}

export class Role {
   roleId:string;
   description:string;
   permissions:string[];
}

export class Authority {
  authority:string;
}

export class User {
  accessToken:string;
  accountNonExpired:boolean;
  accountNonLocked:boolean;
  authorities: Authority[];
  created: string;
  credentialsNonExpired: boolean;
  email:string;
  enabled: boolean;
  fname: string;
  lname: string;
  orgId: string;
  defaultEntityId: string;
  permissions:string[];
  repositoryAccounts: RepositoryAccounts;
  roles:Role[];
}


export class PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
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

export class ScanConnection {
  edges: ScanEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export class ScanEdge {
  node: Scan;
  cursor: string;
}

export class EntityConnection {
  edges: EntityEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export class EntityEdge {
  node: Entity;
  cursor: string;
  constructor (node: Entity, cursor: string) {
    this.node = node;
    this.cursor = cursor;
  }
}


// GRAPHQL QUERIES
export type TaskQuery = {
  task_submitScanRequest:Task;
  task_update:Task;
}

export type GitHubUserQuery = {
  gitHubUser: GitHubUser;
}


// GitLabUserQuery
export type GitLabUserQuery = {
  gitLabUser: GitLabUser;
}


// BitbucketUserQuery
export type BitbucketUserQuery = {
  bitbucketUser: BitbucketUser;
}

export type ProjectQuery = {
  project: Project;
}

export type EntityQuery = {
  entity: Entity;
}

export type EntityListQuery = {
  entities: EntityConnection;
}

export type VulnerabilityQuery = {
  vulnerability:Vulnerability;
}

export type ScanQuery = {
  scan:Scan;
}

export type ComponentQuery = {
  component:TxComponent;
}

export type LicenseQuery = {
  license:License;
}

export type ScanAssetQuery = {
  scanAsset:ScanAsset;
}

export class SimmQuery {
  simmCompare: SimmMatch[];
}
export class SimmMatch {
  leftStart: number;
  leftEnd: number;
  rightStart: number;
  rightEnd: number;
}
