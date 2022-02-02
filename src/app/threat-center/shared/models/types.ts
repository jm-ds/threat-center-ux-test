// todo: ref: move this file to /src/app/models
// todo: ref: consider to split this file into several domain specific

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
  parentEntityId: string;
  name:string;
  projects:ProjectConnection;
  entityMetricsGroup:EntityMetricsGroup;
  entityMetricsSummaryGroup:EntityMetricsSummaryGroup;
  entityComponents:any;
  vulnerabilities: Vulnerability[];
  licenses: License[];
  childEntities:Entity[];
}


// COMMON METRICS
export class DimensionalVulnerabilityMetrics {
  severityMetrics: Map<string, number>;
}

export class DimensionalComponentMetrics {
  vulnerabilityMetrics: Map<string, number>;
  licenseNameMetrics: Map<string, number>;
  licenseCategoryMetrics: Map<string, number>;
  licenseFamilyMetrics: Map<string, number>;
}

export class DimensionalLicenseMetrics {
  measureDate: string;
  licenseNameMetrics: Map<string, number>;
  licenseCategoryMetrics: Map<string, number>;
  licenseFamilyMetrics: Map<string, number>;
}

export class DimensionalAssetMetrics {
  assetCompositionMetrics: Map<string, number>;
}

export class DimensionalSupplyChainMetrics {
  supplyChainMetrics: Map<string, number>;
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

export class SupplyChainMetrics {
  risk: number;
  quality: number;
}

export class AssetMetrics {
  embedded: number;
  openSource: number;
  unique: number;
}

export class Metrics {
  vulnerabilityMetrics: DimensionalVulnerabilityMetrics;
  assetMetrics: DimensionalAssetMetrics;
  componentMetrics: DimensionalComponentMetrics;
  licenseMetrics: DimensionalLicenseMetrics;
  supplyChainMetrics: DimensionalSupplyChainMetrics;
}

// ENTITY METRICS
export class EntityMetrics extends Metrics {
  projectCount:number;
  measureDate: any;
}

export class EntityMetricsGroup {
  period:any;
  projectCount:number;
  entityMetrics: EntityMetrics[];
}

export class entityMetricsSummaries {
  vulnerabilityMetrics: VulnerabilityMetrics;
  licenseMetrics: LicenseMetrics;
  supplyChainMetrics: SupplyChainMetrics;
  assetMetrics: AssetMetrics;
}

export class EntityMetricsSummaryGroup {
  entityMetricsSummaries:EntityMetricsSummary[];
}

export class EntityMetricsSummary {
  measureDate: any;
  vulnerabilityMetrics: VulnerabilityMetrics;
  licenseMetrics: LicenseMetrics;
  supplyChainMetrics: SupplyChainMetrics;
  assetMetrics: AssetMetrics;
}

// PROJECT METRICS
export class ProjectMetrics extends Metrics {
  measureDate: any;
}

export class ProjectMetricsGroup {
  period:any;
  projectMetrics: ProjectMetrics[];
}

export class ProjectMetricsSummary {
  measureDate: any;
  vulnerabilityMetrics: VulnerabilityMetrics;
  licenseMetrics: LicenseMetrics;
  supplyChainMetrics: SupplyChainMetrics;
  assetMetrics: AssetMetrics;
}

export class ScanMetricsSummary {
  vulnerabilityMetrics: VulnerabilityMetrics;
  licenseMetrics: LicenseMetrics;
  supplyChainMetrics: SupplyChainMetrics;
  assetMetrics: AssetMetrics;
}



export enum Period {
  CURRENT="CURRENT",
  WEEK="WEEK",
  MONTH="MONTH",
  QUARTER="QUARTER",
  YEAR="YEAR"
}




export class Project {
  projectId:string;
  entityId:string;
  name:string;
  created:any;
  latestScan: Scan;
  scans: ScanConnection;
  childProjects: ProjectConnection;
  errorMsg: string;
  log: string;
}

export class Scan {
  scanId:string;
  branch:string;
  vulnerabilities:Vulnerability[];
  scanRepository:Repository;
  scanMetrics:any;
  scanAssets: any;
}

export class TxComponent {
  componentId;
}

export class FixResult {
  groupId: string;
  artifactId: string;
  oldVersion: string;
  newVersion: string;
  buildFile: string;
  success: boolean;
  errorMessage: string;
}

export class VulnCodePatchedPackage {
  namespace: string;
  name: string;
  pk: string;
  version: string;
  type: string;
  purl: string;
  id: number;
  subpath: string;
  qualifiers: string;
}

export class PatchedInfo {
  namespace: string;
  name: string;
  vulnerableVersion: string;
  cveId: string;
  nextPatchedVersion: VulnCodePatchedPackage;
  latestPatchedVersion: VulnCodePatchedPackage;
}

export class PatchedInfoSimplified {
  namespace: string;
  name: string;
  vulnerableVersion: string;
  cveId: string;
  nextPatchedVersion: string;
  latestPatchedVersion: string;
}
export interface PatchedInfoSimplifiedQuery {
  autofixVersions: PatchedInfoSimplified;
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
  components: any;
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
  components: any;
}

export class LicenseAttribute {
  attributeType:string;
  key:string
}

export class Cwe {
  cweId:string;
  name:string;
}


// ScanAsset -------------------------------------------------------------------------------------------------
export class ScanAsset {
  name:string;
  size:number;
  fileSize:number;
  scanAssetId:string;
  originAssetId:string;
  workspacePath:string;
  status:string;
  scanAssetType:string;
  content:string;
  matchRepository:Repository;
  matches:ScanAssetMatch[];
  embeddedAssets: EmbeddedAssetConnection;
  percentEmbedded:number;
}

export class EmbeddedAssetConnection {
  edges: EmbeddedAssetEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export class EmbeddedAssetEdge {
  node: EmbeddedAsset;
  cursor: string;
  constructor(node: EmbeddedAsset, cursor: string) {
    this.node = node;
    this.cursor = cursor;
  }
}

export class EmbeddedAsset {
  matchLicenses: ScanAssetMatchLicense[];
}

export class ScanAssetMatchLicense {
  licenseId: string;
  licenseName: string;
  licenseCategory: string;
  earliestReleaseDate: Date;
  latestReleaseDate: Date;
  earliestReleaseVersion: string;
  latestReleaseVersion: string;
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
  bitbucketAccount:any;
  gitlabAccount:any;
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
  avatarUrl: string;
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

  constructor(){}
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

export type RunningTaskCountQuery = {
  running_scan_tasks_count:number;
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

export class ScanAssetMatchRequest {
  readonly assetMatchId: string;
  readonly percentMatch: number;
  constructor(assetMatchId: string, percentMatch: number) {
    this.assetMatchId = assetMatchId;
    this.percentMatch = percentMatch;
  }
}

export class AttributeAssetRequestInput {
  readonly scanId: string;
  readonly scanAssetId: string;
  readonly assetMatchRequests: ScanAssetMatchRequest[];
  readonly attributeStatus: string;
  readonly attributeComment: string;
  constructor(scanId: string, scanAssetId: string, assetMatchRequests: ScanAssetMatchRequest[], attributeStatus: string, attributeComment: string) {
    this.scanId = scanId;
    this.scanAssetId = scanAssetId;
    this.assetMatchRequests = assetMatchRequests;
    this.attributeStatus = attributeStatus;
    this.attributeComment = attributeComment;
  }
}

export class CvssV3 {
  cveId: string;
  cvssV3BaseScore: string;
  severity: string;
}

export class VulnerableRelease {
  namespace: string;
  name: string;
  version: string;
  type: string;
  purl: string;
  releaseDate: string;
  vulnerable: boolean;
  cvssV3: CvssV3;
}

export class VulnerableReleaseResponse {
  nextPagingState: string;
  repositoryType: string;
  purlType: string;
  group: string;
  name: string;
  size: number;
  vulnerableReleases: VulnerableRelease[];
}

export interface VulnerableReleaseResponseMap {
  "binaryVulnerableResponse": VulnerableReleaseResponse;
  "sourceVulnerableResponse": VulnerableReleaseResponse;
}

// graphql error location
export type SourceLocation = {
  line: number;
  column: number;
  sourceName: string;
}

// graphql error type
export enum ErrorType {
  InvalidSyntax = "InvalidSyntax",
  ValidationError = "ValidationError",
  DataFetchingException = "DataFetchingException",
  OperationNotSupported = "OperationNotSupported",
  ExecutionAborted = "ExecutionAborted"
}

// graphql error
export type GraphQLError = {
  message: string;
  locations: SourceLocation[];
  errorType: ErrorType[];
  path: string[];
  extensions: object;
}


// generic subscription result
export type SubscriptionResult<T> = {
  value : T;
  errors: GraphQLError[];
}

// running task count result
export type RunningTaskCountSubscription = {
  subscribeRunningScanTaskCount:SubscriptionResult<number>;
}
