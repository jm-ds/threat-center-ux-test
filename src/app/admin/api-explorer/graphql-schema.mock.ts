export const MOCK_SCHEMA = `# This directive allows results to be deferred during execution
directive @defer on FIELD

# Built-in scalar for map-like structures
scalar Map_String_ObjectScalar

#
type Entity {
  avgAnalysisTime: Float!
  avgAssetCount: Int!
  avgCopyrightCount: Int!
  avgFileCount: Int!
  avgIncludedAssetCount: Int!
  avgLicenseCount: Short!
  avgMatchCount: Int!
  avgPercentageOfInclusions: Float!
  avgScanTime: Float!
  avgUploadTime: Float!
  avgViralLicenseCount: Short!
  childEntities(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): EntityConnection
  children: [Entity]
  created: Date
  entityComponents(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): EntityComponentConnection
  entityId: UUID
  entityMetrics: EntityMetrics
  entityMetricsGroup: EntityMetricsGroup
  entityMetricsSummary: EntityMetrics
  entityMetricsSummaryGroup: EntityMetricsSummaryGroup
  entityProjectMetrics: EntityMetrics
  entitySettings: EntitySetting
  entityTotalMetrics: EntityMetrics
  entityType: EntityType
  licenseFamilies: [String]
  licenseRiskScore: Short!
  name: String
  orgId: UUID
  parentEntityId: UUID
  parents: [Entity]
  projects(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ProjectConnection
  removed: Boolean
  totalAssetCount: Int!
  totalAssetsFileSize: Long!
  totalAssetsSize: Long!
  totalCopyrightCount: Int!
  totalFileCount: Int!
  totalIncludedAssetCount: Int!
  totalInclusionsSize: Long!
  totalLicenseCount: Short!
  totalMatchCount: Int!
  totalScanTime: Float!
  totalViralLicenseCount: Short!
}

#
type AssetRelease {
  assetId: ByteBuffer
  assetMasterId: ByteBuffer
  licenses(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): LicenseConnection
  releaseDate: Date
  releaseLicenses(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): RepositoryReleaseLicenseConnection
  releaseName: String

  # String representation of ByteBuffer repository
  repositoryId: String
}

#
enum GroupOperator {
  AND
  OR
}

#
type Owner {
  name: String
}

# Query root
type Query {
  autofixVersions(componentId: UUID): PatchedInfo_String
  task_update(taskToken: String): ProjectScanTask
  apiKey(
    # API ID
    keyId: UUID

    # User name
    username: String
  ): ApiKey
  project(projectId: UUID): Project
  completed_scan_tasks(entityId: UUID): [ProjectScanTask]
  permissions: [PermissionObject]
  bitbucketUser: BBUser
  getUserByInvite(inviteHash: String): User
  getInviteMailData(inviteHash: String): InviteMailData
  inviteOrg(inviteHash: String): OrganizationData
  vulnerability(vulnerabilityId: UUID): Vulnerability
  users(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): UserConnection
  simmCompare(sourceContent: String, matchContent: String): [SimmMatch]
  license(licenseId: String): License
  licenseJiraTicket(scanId: UUID, licenseId: String, orgId: UUID): JiraTicket
  orgApiKey(
    # API ID
    keyId: UUID
  ): ApiKey
  gitHubUser: GithubUser
  topLevelEntitiesByOrg(orgId: UUID): [Entity]
  checkAlreadyScannedProject(
    repoType: String
    entityId: UUID
    repository: String
    login: String
    branch: String
  ): Date
  runPoliciesForScan(scanId: UUID): [Policy]
  role(roleId: String): Role
  orgApiKeys(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ApiKeyConnection
  scanComponent(componentId: UUID, scanId: UUID): ScanComponent
  running_scan_tasks(entityId: UUID): [ProjectScanTask]
  roles: [Role]
  policies(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # If true, then selects only active policies
    onlyActive: Boolean

    # Entity ID
    entityId: UUID

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Project ID
    projectId: UUID

    # Returns the first n elements from the list
    first: Int
  ): PolicyConnection
  scan(scanId: UUID): Scan
  componentsReport(
    isInternal: Boolean
    name: String
    isFixAvailable: Boolean
    discoveredIn: String
    type: String
    version: String
    hasVulnerabilities: Boolean
    discoveryType: String
    group: String
  ): [EntityProjectDTO]
  gitLabUser: GLUser
  gitHubBranches: [Ref]
  running_scan_tasks_count(entityId: UUID): Long
  policy(
    # Policy ID
    policyId: UUID

    # Active flag
    active: Boolean

    # Entity ID
    entityId: UUID

    # Project ID
    projectId: UUID
  ): Policy
  task_submitScanRequest(
    repoType: String
    entityId: UUID
    repository: String
    login: String
    projectId: String
    branch: String
  ): ProjectScanTask
  getIgnoredFiles(entityId: UUID, projectId: UUID): [IgnoredFiles]
  orgSettings: EntitySetting
  entityMetricsPeriod(
    period: MetricsPeriod
    entityId: UUID
    orgId: UUID
  ): EntityMetricsGroup
  snippetMatchResult(
    languageType: String
    snippetText: String
  ): SnippetMatchResult
  vulnerabilitiesStateReport: [EntityProjectDTO]
  component(componentId: UUID): Component
  entities(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): EntityConnection
  getInvite(inviteHash: String): Invite
  user(username: String): User
  entity(entityId: UUID): Entity
  scanAsset(scanAssetId: String, scanId: UUID): ScanAsset
  scanLicense(
    scanId: UUID
    licenseId: String
    licenseDiscovery: String
    licenseOrigin: String
  ): ScanLicense
}

# An edge in a connection
type EntityEdge {
  # The item at the end of the edge
  node: Entity

  # cursor marks a unique position or index into the connection
  cursor: String!
}

# An edge in a connection
type ScanAssetMatchEdge {
  # The item at the end of the edge
  node: ScanAssetMatch

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
input VulnerabilityJiraRequestInput {
  content: String
  projectId: UUID
  vulnId: String
  orgId: UUID
  vulnerabilityId: UUID
  scanId: UUID
}

#
type EmbeddedAsset {
  assetSize: Long!
  attributionStatus: AttributionStatus
  componentId: UUID
  created: Date
  dateCreated: Date
  embeddedAssetPercent: Float!
  entityId: UUID
  entityName: String
  id: String
  localPath: String
  matchCount: Int
  matchType: MatchType
  name: String
  orgId: UUID
  orgName: String
  parentScanAssetId: String
  percentEmbedded: Float!
  projectId: UUID
  projectName: String
  scanAssetId: String
  scanDate: Date
  scanId: UUID
  scanRepoId: UUID
  status: ScanAssetStatus
  subProjectId: UUID
  subProjectName: String
  workspacePath: String
}

#
input EntityRequestInput {
  parentEntityId: UUID
  entityType: String
  entityId: UUID
  entityName: String
}

#
type TaskOperation {
  completePercent: Float!
  description: String
  done: Boolean!
  durationMs: Long!
  end: LocalDateTime
  processedItems: Int!
  start: LocalDateTime
  status: TaskOperationStatus
  totalItems: Int!
  type: TaskOperationType
}

#
type ScanMetrics {
  assetMetrics: DimensionalAssetMetrics
  componentMetrics: DimensionalComponentMetrics
  licenseMetrics: DimensionalLicenseMetrics
  orgId: UUID
  scanId: UUID
  supplyChainMetrics: DimensionalSupplyChainMetrics
  vulnerabilityMetrics: DimensionalVulnerabilityMetrics
}

# Built-in scalar representing a local date
scalar LocalDate

#
type ScanAssetFeature {
  doesntUsed: String
}

# A connection to a list of items.
type ScanLicenseConnection {
  # a list of edges
  edges: [ScanLicenseEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
enum ScanAssetType {
  DIR
  FILE
}

#
type DimensionalAssetMetrics {
  assetCompositionMetrics: Map_AssetComposition_IntegerScalar
}

#
enum TaskOperationStatus {
  DONE
  FAILED
  IN_PROGRESS
  WAITING
}

# Built-in scalar for map-like structures
scalar Map_LicenseCategory_IntegerScalar

#
enum Permission {
  ALERTS_SETTINGS
  ALERTS_VIEW
  AUTHENTICATED
  COMPONENT_CREATE
  COMPONENT_EDIT
  COMPONENT_REMOVE
  COMPONENT_VIEW
  EMBEDDED_CREATE
  EMBEDDED_EDIT
  EMBEDDED_REMOVE
  EMBEDDED_VIEW
  ENTITY_ADMIN
  ENTITY_CREATE
  ENTITY_EDIT
  ENTITY_POLICY_MANAGE
  ENTITY_REMOVE
  ENTITY_VIEW
  FEATURE_PREVIEW
  GHOST_LOGIN
  INTEGRATION_CREATE
  INTEGRATION_EDIT
  INTEGRATION_REMOVE
  INTEGRATION_VIEW
  LICENSE_CREATE
  LICENSE_EDIT
  LICENSE_REMOVE
  LICENSE_VIEW
  METRICS_CREATE
  METRICS_EDIT
  METRICS_REMOVE
  METRICS_VIEW
  NON_AUTHENTICATED
  ORG_ADD
  ORG_ADMIN
  ORG_APITOKEN_CREATE
  ORG_POLICY_MANAGE
  ORG_REMOVE
  ORG_VIEW
  POLICY_CREATE
  POLICY_EDIT
  POLICY_OVERRIDE
  POLICY_REMOVE
  POLICY_STATECHANGE
  POLICY_VIEW
  PROJECT_CREATE
  PROJECT_EDIT
  PROJECT_POLICY_MANAGE
  PROJECT_REMOVE
  PROJECT_SETTINGS
  PROJECT_SET_PRIVATE
  PROJECT_VIEW
  PROJECT_VIEW_PRIVATE
  QUICKSTART_SCAN
  QUICKSTART_VIEW
  REPORT_CREATE
  REPORT_EDIT
  REPORT_REMOVE
  REPORT_VIEW
  ROLE_CREATE
  ROLE_EDIT
  ROLE_REMOVE
  ROLE_VIEW
  SCAN_ASSET_EDIT
  SCAN_ASSET_REMOVE
  SCAN_ASSET_VIEW
  SCAN_CREATE
  SCAN_EDIT
  SCAN_REMOVE
  SCAN_VIEW
  USER_APITOKEN_CREATE
  USER_CREATE
  USER_EDIT
  USER_INVITE
  USER_REMOVE
  USER_VIEW
  VULNERABILITY_CREATE
  VULNERABILITY_EDIT
  VULNERABILITY_REMOVE
  VULNERABILITY_VIEW
}

#
input UserRequestInput {
  lname: String
  defaultEntityId: String
  permissions: [Permission]
  fname: String
  username: String
  entities: [String]
  email: String
  roles: [String]
}

#
type ScanResult {
  assetCount: Int!
  bomCount: Int!
  copyleftLicenses: Int!
  copyleftLimitedLicenses: Int!
  copyleftPartialLicenses: Int!
  copyleftStrongLicenses: Int!
  copyleftWeakLicenses: Int!
  criticalVulnerabilities: Int!
  customLicenses: Int!
  dualLicenses: Int!
  embeddedAssets: Int!
  errorMessage: String
  highVulnerabilities: Int!
  infoVulnerabilities: Int!
  lowVulnerabilities: Int!
  matchesFound: Int!
  mediumVulnerabilities: Int!
  openSourceAssets: Int!
  permissiveLicenses: Int!
  policyViolations: [Policy]
  projectCount: Int!
  projectName: String
  proprietaryFreeLicenses: Int!
  proprietaryLicenses: Int!
  scanFailed: Boolean!
  siblingProjectCount: Int!
  status: String
  uniqueAssets: Int!
}

#
type RepositoryReleaseLicense {
  licenseCount: Int!
  licenseId: String
  licenseName: String
  releaseName: String
  repositoryId: ByteBuffer
  type: RepositoryLicenseType
}

# Built-in scalar for map-like structures
scalar Map_Component_ScanComponentDataScalar

#
enum RepositoryType {
  BINARY_REPOSITORY
  FILE_SYSTEM
  SOURCE_REPOSITORY
  WEBSITE
}

#
enum LicenseTrustLevel {
  LEVEL_1
  LEVEL_2
}

# A connection to a list of items.
type ScanComponentConnection {
  # a list of edges
  edges: [ScanComponentEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

# A connection to a list of items.
type UserConnection {
  # a list of edges
  edges: [UserEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type Project {
  active: Boolean
  childProjects(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ProjectConnection
  created: Date
  entity: Entity
  entityId: UUID
  latestScan: Scan
  name: String
  noManifest: Boolean
  orgId: UUID
  parentProjectId: UUID
  projectId: UUID
  projectMetrics: ProjectMetrics
  projectMetricsGroup: ProjectMetricsGroup
  projectMetricsSummary: ProjectMetricsSummary
  scans(
    # Returns the last n elements from the list
    last: Int

    # Returns the filterBranchName
    filterBranchName: String

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ScanConnection
  tags: [String]
}

#
type ProjectMetricsGroup {
  period: MetricsPeriod
  projectMetrics: [ProjectMetrics]
}

#
input JiraCredentialsInput {
  projectId: String
  issueTypeId: String
  apiToken: String
  projectUrl: String
  email: String
}

#
type BBUser {
  avatarUrl: String
  bitBucketRepositories: [BitBucketRepository]
  email: String
  id: String
  name: String
  organization: String
  state: String
  username: String
  webUrl: String
}

#
type SnippetMatchResult {
  matchTime: Long!
  scanTime: Long!
  snippetMatches: [SnippetMatch]
  snippetSize: Int!
}

#
type RepositoryAccounts {
  bitbucketAccount: BitbucketAccount
  githubAccount: GithubAccount
  gitlabAccount: GitlabAccount
}

#
type Cwe {
  cweId: Int!
  name: String
}

#
enum ConditionOperator {
  EQ
  GE
  GT
  IN
  LE
  LIKE
  LT
}

# An edge in a connection
type LicenseEdge {
  # The item at the end of the edge
  node: License

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type DimensionalComponentMetrics {
  licenseCategoryMetrics: Map_LicenseCategory_IntegerScalar
  licenseFamilyMetrics: Map_String_IntegerScalar
  licenseNameMetrics: Map_String_IntegerScalar
  vulnerabilityMetrics: Map_VulnerabilitySeverity_IntegerScalar
}

#
enum ErrorType {
  DataFetchingException
  ExecutionAborted
  InvalidSyntax
  OperationNotSupported
  ValidationError
}

#
enum ConditionScope {
  COMPONENT
  PROJECT
}

#
type IgnoredFiles {
  level: Level
  objectId: UUID
  pattern: String
  type: Type
}

#
input PolicyRequestInput {
  policy: PolicyInput
}

# A connection to a list of items.
type LicenseConnection {
  # a list of edges
  edges: [LicenseEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type GraphQLError {
  errorType: ErrorType
  extensions: Map_String_ObjectScalar
  locations: [SourceLocation]
  message: String
  path: [ObjectScalar]
}

#
type LicenseNameAttribute {
  attribute: String
  index: Int!
}

# Built-in scalar for dynamic values
scalar ObjectScalar

#
input InviteMailDataRequestInput {
  inviteMailData: InviteMailDataInput
}

# An edge in a connection
type VulnerabilityEdge {
  # The item at the end of the edge
  node: Vulnerability

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type PolicyConditionGroup {
  autoAdjustThreshold: Boolean
  conditions: [PolicyCondition]
  groupOperator: GroupOperator
  groups: [PolicyConditionGroup]
  needUpdatePolicy: Boolean!
  scope: ConditionScope
  threshold: Int
  thresholdId: UUID
}

#
type JiraTicket {
  id: String
  key: String
  self: String
}

#
type ComponentResolvedLicense {
  licenseId: String
  name: String
}

#
type SnippetMatch {
  assetLicenses: [AssetLicense]
  assetName: String
  earliestRelease: AssetRelease
  earliestReleaseLicenses: [RepositoryReleaseLicense]
  latestRelease: AssetRelease
  latestReleaseLicenses: [RepositoryReleaseLicense]
  licenses: [ScanAssetMatchLicense]
  matchAssetId: String
  matchPercent: Float!
  repositoryName: String
  repositoryOwner: String
}

#
input RoleRequestInput {
  roleId: String
  permissions: [Permission]
  description: String
}

#
type ScanOpenSourceProject {
  assetRepositoryId: ByteBuffer
  name: String
  orgId: UUID
  owner: String
  projectId: UUID
  purlType: String
  repoWebsite: String
  scanId: UUID
}

# Built-in scalar for map-like structures
scalar Map_TaskOperationType_TaskOperationScalar

#
type Repository {
  archived: Boolean!
  createdAt: Date
  defaultBranchRef: Ref
  description: String
  fork: Boolean!
  id: String
  name: String
  owner: Owner
  primaryLanguage: Language
  private: Boolean!
  refs: RefConnection
  resourcePath: String
  sshUrl: String
  url: String
}

#
type Ref {
  id: String
  name: String
  target: GitObject
}

#
enum MatchType {
  EMBEDDED_OPEN_SOURCE
  OPEN_COMPONENT
  OPEN_SOURCE
  PROPRIETARY
  STATIC_REFERENCE
  UNIQUE_PROPRIETARY
}

# A connection to a list of items.
type EntityVulnerabilityConnection {
  # a list of edges
  edges: [EntityVulnerabilityEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type LicenseAttribute {
  description: String
  name: LicenseAttributeName
  type: LicenseAttributeType
}

# A connection to a list of items.
type ScanComponentLicenseConnection {
  # a list of edges
  edges: [ScanComponentLicenseEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type ScanLicense {
  category: LicenseCategory
  components(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    #
    scanId: UUID

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ComponentConnection
  isFsfLibre: Boolean!
  isOsiApproved: Boolean!
  key: String
  license: License
  licenseDiscovery: RepositoryLicenseType
  licenseId: String
  licenseOrigin: LicenseOrigin
  name: String
  nameInLowerCase: String
  orgId: UUID
  publicationYear: Int
  scanAssetsTree(
    # Returns user input filter text
    filter: String

    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int

    # Return parent scan asset
    parentScanAssetId: String
  ): ScanAssetConnection
  scanComponents(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ScanComponentConnection
  scanId: UUID
  scanLicenseAssets(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ScanLicenseAssetConnection
  scanOpenSourceProject: ScanOpenSourceProject
  spdxId: String
  spdxIdInLowerCase: String
  style: String
  trustLevel: LicenseTrustLevel
  type: String
}

# Built-in scalar for map-like structures
scalar Map_AssetComposition_IntegerScalar

# An edge in a connection
type EntityVulnerabilityEdge {
  # The item at the end of the edge
  node: EntityVulnerability

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type ScanComponent {
  component: Component
  componentDiscoveryMethod: ComponentDiscoveryMethod
  componentId: UUID
  componentLocation: ComponentLocation
  componentType: ComponentType
  copyrights: [Copyright]
  group: String
  hasVulnerability: Boolean
  isInternal: Boolean
  lastInheritedRiskScore: Int
  license: String
  licenses: ScanComponentLicenseConnection
  metrics: ComponentMetrics
  name: String
  orgId: UUID
  purl: String
  releaseDate: Date
  resolvedLicense: ComponentResolvedLicense
  scanId: UUID
  version: String
  vulnerabilities(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): VulnerabilityConnection
}

# An edge in a connection
type ScanAssetEdge {
  # The item at the end of the edge
  node: ScanAsset

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type ScanRepository {
  created: Date
  languages: [RepositoryLanguage]
  orgId: UUID
  primaryLanguage: String
  repositoryEndpointType: RepositoryEndpointType
  repositoryId: UUID
  repositoryName: String
  repositoryOwner: String
  repositoryType: RepositoryType
}

#
type InfectionMetrics {
  entityId: UUID
  infectionId: UUID
  orgId: UUID
  projectCount: Int!
  type: InfectionType
}

#
type GitLabProject {
  archived: Boolean!
  createdAt: Date
  description: String
  fullPath: String
  httpUrlToRepo: String
  id: String
  name: String
  path: String
  repository: GitLabRepository
  sshUrlToRepo: String
  webUrl: String
}

#
input PolicyActionInput {
  policyId: UUID
  actionName: ActionName
  orgId: UUID
  actionType: ActionType
}

#
type RepositoryLanguage {
  assetRepositoryId: ByteBuffer
  color: String
  name: String
  primary: Boolean!
}

#
type SourceAssetAttribution {
  attributedBy: String
  attributedComment: String
  attributedDate: Date
  attributionStatus: AttributionStatus
  name: String
  orgId: UUID
  projectId: UUID
  workspacePath: String
}

#
type GithubAccount {
  accessToken: String
  scopes: [String]
}

#
type AssetMatchRepository {
  repositoryCode: RepositoryCode
  repositoryEndpointType: RepositoryEndpointType
  repositoryId: String
  repositoryName: String
  repositoryOwner: String
}

# Built-in Short as Int
scalar Short

#
type GitObject {
  oid: String
}

# A connection to a list of items.
type ScanAssetConnection {
  # a list of edges
  edges: [ScanAssetEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
input LicenseJiraRequestInput {
  orgId: UUID
  scanId: UUID
  content: String
  projectId: UUID
  licenseId: String
}

# An edge in a connection
type RepositoryReleaseLicenseEdge {
  # The item at the end of the edge
  node: RepositoryReleaseLicense

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type SubscriptionResult_Long {
  errors: [GraphQLError]
  value: Long
}

#
type ScanAsset {
  assetRepositoryUrl: StringHolder
  assetSize: Long!
  attributionStatus: AttributionStatus
  component: Component
  componentId: UUID
  created: Date
  embeddedAssets(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ScanAssetMatchConnection
  languageType: LanguageType
  localPath: String
  matchCount: Int
  matchType: MatchType
  name: String
  orgId: UUID

  # String representation of ByteBuffer originAssetId
  originAssetId: String

  # String representation of ByteBuffer parentScanAssetId
  parentScanAssetId: String
  percentEmbedded: Float!
  projectId: UUID
  scanAssetFeatures: [ScanAssetFeature]

  # String representation of ByteBuffer scanAssetId
  scanAssetId: String
  scanAssetType: ScanAssetType
  scanId: UUID
  size: Long!
  sourceAssetAttribution: SourceAssetAttribution
  status: ScanAssetStatus
  workspacePath: String
}

# A connection to a list of items.
type AssetReleaseConnection {
  # a list of edges
  edges: [AssetReleaseEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type LicenseMetricsSummary {
  copyleft: Int
  copyleftLimited: Int
  copyleftPartial: Int
  copyleftStrong: Int
  copyleftWeak: Int
  custom: Int
  dual: Int
  permissive: Int
  proprietary: Int
  proprietaryFree: Int
}

#
enum RepositoryLicenseType {
  DECLARED
  DISCOVERED
}

# Built-in scalar for map-like structures
scalar Map_String_IntegerScalar

#
type Role {
  description: String
  fixed: Boolean
  orgId: UUID
  permissions: [Permission]
  removed: Boolean
  roleId: String
  rolePermissions: [PermissionObject]
}

#
type StringHolder {
  data: String
}

# Long type
scalar Long

# A connection to a list of items.
type PolicyConnection {
  # a list of edges
  edges: [PolicyEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type Scan {
  branch: String
  commit: String
  components(
    # Returns user input filter text
    filter: String

    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ScanComponentConnection
  created: Date
  entity: Entity
  entityId: UUID
  errorMsg: String
  licenses(
    # Returns user input filter text
    filter: String

    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ScanLicenseConnection
  log: String
  orgId: UUID
  organization: ThreatrixOrganization
  project: Project
  projectId: UUID
  repositoryId: UUID
  scanAssets: [ScanAsset]
  scanAssetsTree(
    # Returns user input filter text
    filter: String

    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int

    # Return parent scan asset
    parentScanAssetId: String
  ): ScanAssetConnection
  scanComponentData: Map_Component_ScanComponentDataScalar
  scanId: UUID
  scanMetrics: ScanMetrics
  scanMetricsSummary: ScanMetricsSummary
  scanOpenSourceProject: ScanOpenSourceProject
  scanRepoId: UUID
  scanRepository: ScanRepository
  status: String
  tag: String
  version: String
  versionHash: String
  vulnerabilities(
    # Returns user input filter text
    filter: String

    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ScanVulnerabilityConnection
}

#
type EntityProjectDTO {
  components: [Component]
  comps: [ReportComponentDTO]
  embeddedAssets: [EmbeddedAsset]
  entityId: UUID
  entityName: String
  licenses: [License]
  projectId: UUID
  projectName: String
  vulnerabilities: [Vulnerability]
}

#
type OrganizationConnection {
  edges: [OrganizationEdge]
  nodes: [Organization]
  pageInfo: PageInfo
  totalCount: Int!
}

# Built-in scalar representing a local date-time
scalar LocalDateTime

# A connection to a list of items.
type EntityComponentConnection {
  # a list of edges
  edges: [EntityComponentEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

# An edge in a connection
type ScanLicenseEdge {
  # The item at the end of the edge
  node: ScanLicense

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type DimensionalVulnerabilityMetrics {
  severityMetrics: Map_VulnerabilitySeverity_IntegerScalar
}

#
type Language {
  color: String
  id: String
  name: String
}

#
input InvitedUserRequestInput {
  username: String
  orgId: UUID
  lname: String
  email: String
  password: String
  fname: String
  position: String
  phone: String
}

#
type Component {
  classifier: String
  componentId: UUID
  copyrightList: [Copyright]
  copyrights: [Copyright]
  cpe: String
  description: String
  extension: String
  filename: String
  group: String
  internal: Boolean
  isInternal: Boolean
  lastInheritedRiskScore: Int
  license: String
  licenses(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): LicenseConnection
  md5: String
  metrics: ComponentMetrics
  name: String
  purl: String
  repositoryMeta: ComponentRepositoryMeta
  resolvedLicense: ComponentResolvedLicense
  sha1: String
  sha256: String
  sha512: String
  usedBy: Int
  version: String
  vulnerabilities(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): VulnerabilityConnection
}

#
input PolicyInput {
  projectId: UUID
  conditions: PolicyConditionGroupInput
  createDate: Date
  conditionTree: PolicyConditionGroupInput
  description: String
  name: String
  overridePolicyId: UUID
  stateChangedBy: String
  orgId: UUID
  overridePolicyTitle: String
  title: String
  dateLastStateChange: Date
  conditionType: ConditionType
  applyToChilds: Boolean
  policyId: UUID
  entityId: UUID
  active: Boolean
  createdBy: String
  actions: [PolicyActionInput]
}

# An edge in a connection
type EntityComponentEdge {
  # The item at the end of the edge
  node: EntityComponent

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type JiraCredentials {
  apiToken: String
  email: String
  issueTypeId: String
  projectId: String
  projectUrl: String
}

#
enum ComponentType {
  ASSET
  LIBRARY
}

# A connection to a list of items.
type ApiKeyConnection {
  # a list of edges
  edges: [ApiKeyEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type GitLabRepository {
  exists: Boolean!
  rootRef: String
}

#
input IgnoredFilesRequestInput {
  type: Type
  level: Level
  objectId: UUID
  pattern: String
}

#
enum MetricsPeriod {
  CURRENT
  DAY
  MONTH
  QUARTER
  WEEK
  YEAR
}

#
type ByteBuffer {
  char: Char!
  direct: Boolean!
  double: Float!
  float: Float!
  get: Byte!
  int: Int!
  long: Long!
  readOnly: Boolean!
  short: Short!
}

# A connection to a list of items.
type VulnerabilityConnection {
  # a list of edges
  edges: [VulnerabilityEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

# An edge in a connection
type ScanVulnerabilityEdge {
  # The item at the end of the edge
  node: ScanVulnerability

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
enum RepositoryEndpointType {
  AZURE
  BITBUCKET
  GITHUB
  GITLAB
  SOURCEFORGE
  STACKOVERLOW
  UNKNOWN
}

#
type GitlabAccount {
  doesntUsed: String
}

#
enum ComponentLocation {
  DEPENDENCY_FILE
  DRIVE
  STATIC_REF
}

# Information about pagination in a connection.
type PageInfo {
  # When paginating forwards, are there more items?
  hasNextPage: Boolean!

  # When paginating backwards, are there more items?
  hasPreviousPage: Boolean!

  # When paginating backwards, the cursor to continue.
  startCursor: String

  # When paginating forwards, the cursor to continue.
  endCursor: String
}

#
type PatchedInfo_String {
  cveId: String
  latestPatchedVersion: String
  name: String
  namespace: String
  nextPatchedVersion: String
  vulnerableVersion: String
}

#
type ReportComponentDTO {
  classifier: String
  componentDiscoveryMethod: ComponentDiscoveryMethod
  componentId: UUID
  componentLocation: ComponentLocation
  componentType: ComponentType
  copyrights: [Copyright]
  dateCreated: Date
  description: String
  entityId: UUID
  entityName: String
  fixedVersions: String
  group: String
  hasVulnerability: Boolean
  id: String
  isInternal: Boolean
  license: String
  licenses(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ScanComponentLicenseConnection
  name: String
  orgId: UUID
  orgName: String
  projectId: UUID
  projectName: String
  purl: String
  resolvedLicense: ComponentResolvedLicense
  scanDate: Date
  scanId: UUID
  scanRepoId: UUID
  subProjectId: UUID
  subProjectName: String
  version: String
  versionFixed: String
  versionRecent: String
  vulnerabilities: [Vulnerability]
  vulnerabilitiesStr: String
  vulns(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): VulnerabilityConnection
}

#
type EntityMetricsSummaryGroup {
  entityMetricsSummaries: [EntityMetricsSummary]
  period: MetricsPeriod
}

#
enum LicenseAttributeName {
  ADD_WARRANTY
  COMMERCIAL_USE
  CONTACT_AUTHOR
  DAMAGE_COMPENSATION
  DISTRIBUTE
  DISTRIBUTION_THROUGH_NETWORK_USE
  INCLUDE_A_COPY_OF_NOTICE
  INCLUDE_CREDIT_NOTICE_IN_ADVERTISEMENTS
  INCLUDE_DISCLAIMER_OF_WARRANTY
  INCLUDE_LICENSE_TEXT_IN_CODE
  INCLUDE_LICENSE_TEXT_IN_DOCUMENTATION
  INCLUDE_LIST_OF_CONDITIONS
  INDEMNIFY_CLAUSE
  INSTALL_INSTRUCTIONS
  LIABILITY
  LICENSE_CHANGE
  MODIFICATIONS
  MODIFY
  NAME_MODIFICATION
  NOTICE_OF_USAGE
  PATENT_CLAUSE
  PATENT_GRANT
  PATENT_RIGHTS
  PATENT_USE
  PAYMENT_OBLIGATION
  PRIVATE_USE
  PROVIDE_CREDIT
  REDISTRIBUTION
  SAME_LICENSE
  SOURCE_CODE_REDISTRIBUTION
  STATE_CHANGES
  STATICALLY_LINK
  SUBLICENSE
  SUBLICENSING
  TRADEMARK_USE
  WARRANTY_STATEMENT
}

#
type DimensionalLicenseMetrics {
  licenseCategoryMetrics: Map_LicenseCategory_IntegerScalar
  licenseFamilyMetrics: Map_String_IntegerScalar
  licenseNameMetrics: Map_String_IntegerScalar
}

#
type RefEdge {
  cursor: String
  node: Ref
}

#
input ApiKeyRequestInput {
  apiKey: String
  username: String
  description: String
  keyId: String
  title: String
  expiredDate: Date
}

#
type License {
  altId: String
  attributes: [LicenseAttribute]
  body: String
  category: LicenseCategory
  cleanName: String
  compatible: [String]
  components(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    #
    scanId: UUID

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ComponentConnection
  description: String
  exception: Boolean!
  familyName: String
  familyNameRegex: String
  features: [ByteBuffer]
  incompatible: [String]
  isDeprecated: Boolean!
  isFsfLibre: Boolean!
  isOsiApproved: Boolean!
  keywords: [String]
  licenseFamily: String
  licenseId: String
  licenseVersionGroup: String
  name: String
  nameAttributes: [LicenseNameAttribute]
  notes: String
  orLaterLicense: Boolean!
  publicationYear: Int
  replacementLicenseId: String
  shortName: String
  spdxAliases: [String]
  spdxId: String
  stdLicenseHeader: String
  stdLicenseHeaderTemplate: String
  stdLicenseTemplate: String
  style: String
  twoNameRegex: String
  type: String
  uniqueName: String
  useUniqueName: Boolean
  version: String
  versionRegex: String
}

#
type OrganizationEdge {
  cursor: String
  node: Organization
}

# An edge in a connection
type ProjectEdge {
  # The item at the end of the edge
  node: Project

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
enum LicenseAttributeType {
  CONDITION
  LIMITATION
  PERMISSION
}

# An edge in a connection
type VulnerabilityProjectEdge {
  # The item at the end of the edge
  node: VulnerabilityProject

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type BitBucketRepository {
  branches: [String]
  createdOn: Date
  description: String
  fullName: String
  language: String
  mainBranch: String
  name: String
  owner: String
  private: Boolean!
  sshUrl: String
  url: String
}

# A connection to a list of items.
type ScanVulnerabilityConnection {
  # a list of edges
  edges: [ScanVulnerabilityEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

# Subscription root
type Subscription {
  subscribeRunningScanTaskCount(entityId: UUID): SubscriptionResult_Long
}

#
type PolicyAction {
  actionName: ActionName
  actionType: ActionType
  orgId: UUID
  policyId: UUID
}

#
type SupplyChainMetricsSummary {
  quality: Int
  risk: Int
}

# An edge in a connection
type ScanComponentLicenseEdge {
  # The item at the end of the edge
  node: ScanComponentLicense

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type ScanAssetMatchGroup {
  assetMasterMatchId: String
  assetMatchId: String
  assetSize: Long!
  earliestReleaseDate: Date
  earliestReleaseVersion: String
  latestReleaseDate: Date
  latestReleaseVersion: String
  name: String
  orgId: UUID
  originAssetId: String
  percentMatch: Float!
  scanAssetId: String
  scanId: UUID
}

#
type OrganizationData {
  name: String
}

#
type EntityMetricsSummary {
  assetMetrics: AssetMetricsSummary
  entityId: UUID
  licenseMetrics: LicenseMetricsSummary
  measureDate: LocalDate
  orgId: UUID
  supplyChainMetrics: SupplyChainMetricsSummary
  vulnerabilityMetrics: VulnerabilityMetricsSummary
}

# A connection to a list of items.
type ProjectConnection {
  # a list of edges
  edges: [ProjectEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
enum ScanAssetStatus {
  ACCEPTED
  IGNORED_SIZE_EMPTY
  IGNORED_SIZE_LARGE
  IGNORED_SIZE_SMALL
  IGNORED_TYPE_DIRECTORY
  IGNORED_TYPE_UNSUPPORTED
}

#
type GLUser {
  avatarUrl: String
  email: String
  gitLabProjects: [GitLabProject]
  id: String
  name: String
  organization: String
  state: String
  username: String
  webUrl: String
}

#
enum ActionName {
  ATTRIBUTION
  DASHBOARD
  EMAIL
  GITHUB
  JIRA
  LAST_VERSION
  NEXT_VERSION
  NO
  PROD
  SLACK
}

# A connection to a list of items.
type ComponentConnection {
  # a list of edges
  edges: [ComponentEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type SimmMatch {
  leftEnd: Int!
  leftStart: Int!
  rightEnd: Int!
  rightStart: Int!
}

# Built-in Byte as Int
scalar Byte

#
input AttributeAssetRequestInput {
  licenseIds: [String]
  scanAssetId: String
  scanId: UUID
  attributeComment: String
}

#
enum Level {
  ENTITY
  ORGANIZATION
  PROJECT
}

# A connection to a list of items.
type VulnerabilityProjectConnection {
  # a list of edges
  edges: [VulnerabilityProjectEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type EntityComponent {
  componentId: UUID
  entityComponentLicenses(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): LicenseConnection
  entityComponentVulnerabilities(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): EntityVulnerabilityConnection
  entityId: UUID
  entityVulnerabilities: [EntityVulnerability]
  group: String
  inflectionCount: Int!
  licenses: [License]
  name: String
  orgId: UUID
  version: String
}

# A connection to a list of items.
type ScanLicenseAssetConnection {
  # a list of edges
  edges: [ScanLicenseAssetEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type ScanVulnerability {
  components(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ComponentConnection
  cvssV2BaseScore: BigDecimal
  cvssV3BaseScore: BigDecimal
  cwe: Cwe
  cweAsText: String
  orgId: UUID
  patchedVersions: String
  published: Date
  recommendation: String
  scanId: UUID
  severity: VulnerabilitySeverity
  source: String
  vulnId: String
  vulnerabilityId: UUID
  vulnerableVersions: String
}

#
type SourceLocation {
  column: Int!
  line: Int!
  sourceName: String
}

# A connection to a list of items.
type EntityConnection {
  # a list of edges
  edges: [EntityEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type ApiKey {
  apiKey: String
  createdDate: Date
  description: String
  expiredDate: Date
  keyId: UUID
  orgId: UUID
  title: String
  username: String
}

#
type Organization {
  avatarUrl: String
  id: String
  name: String
  repositories: RepositoryConnection
}

# A connection to a list of items.
type ScanAssetMatchConnection {
  # a list of edges
  edges: [ScanAssetMatchEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

# An edge in a connection
type ScanEdge {
  # The item at the end of the edge
  node: Scan

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
type ProjectMetricsSummary {
  assetMetrics: AssetMetricsSummary
  licenseMetrics: LicenseMetricsSummary
  measureDate: LocalDate
  measureDateTime: Date
  orgId: UUID
  projectId: UUID
  supplyChainMetrics: SupplyChainMetricsSummary
  vulnerabilityMetrics: VulnerabilityMetricsSummary
}

#
type EntityMetrics {
  assetMetrics: DimensionalAssetMetrics
  componentMetrics: DimensionalComponentMetrics
  entityId: UUID
  licenseMetrics: DimensionalLicenseMetrics
  measureDate: LocalDate
  orgId: UUID
  supplyChainMetrics: DimensionalSupplyChainMetrics
  type: EntityMetricsType
  vulnerabilityMetrics: DimensionalVulnerabilityMetrics
}

#
type DimensionalSupplyChainMetrics {
  supplyChainMetrics: Map_SupplyChainMetric_IntegerScalar
}

#
enum ConditionName {
  COMPONENT_AGE
  COMPONENT_ARTIFACT_ID
  COMPONENT_GROUP_ID
  COMPONENT_NAME
  COMPONENT_VERSION
  CVSS2
  CVSS3
  EMBEDDED_ASSET
  LICENSE_ATTRIBUTE
  LICENSE_CATEGORY
  LICENSE_FAMILY
  LICENSE_FOUND_IN
  LICENSE_NAME
  PROJECT_TAG
  RELEASE_STAGE
  SCOPE
  SEVERITY
  SUPPLY_QUALITY
  SUPPLY_RISK
  THRESHOLD
}

# An edge in a connection
type ScanAssetMatchGroupEdge {
  # The item at the end of the edge
  node: ScanAssetMatchGroup

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
input OrgNameRequestInput {
  orgId: UUID
  name: String
}

#
type ScanAssetMatchLicense {
  assetMatchId: String
  earliestReleaseDate: Date
  earliestReleaseVersion: String
  latestReleaseDate: Date
  latestReleaseVersion: String
  licenseCategory: LicenseCategory
  licenseContext: LicenseContext
  licenseId: String
  licenseName: String
  needIncludeInCode: Boolean
  orgId: UUID
  scanAssetId: String
  scanId: UUID
}

# Built-in Char as Character
scalar Char

#
type AssetLicense {
  assetId: ByteBuffer
  licenseId: String
  name: String
}

#
type GithubUser {
  avatarUrl: String
  company: String
  email: String
  id: String
  isSiteAdmin: Boolean
  location: String
  login: String
  name: String
  organizations: OrganizationConnection
  repositories: RepositoryConnection
  url: String
}

#
type VulnerabilityMetricsSummary {
  critical: Int
  high: Int
  info: Int
  low: Int
  medium: Int
}

#
type AssetMetricsSummary {
  embedded: Int
  openSource: Int
  unique: Int
}

#
type PermissionObject {
  description: String
  name: String
  title: String
}

#
enum TaskStatus {
  COMPLETE
  COMPLETE_WITH_ERRORS
  ERROR
  QUEUED
  RUNNING
}

#
type RefConnection {
  edges: [RefEdge]
  nodes: [Ref]
  pageInfo: PageInfo
  totalCount: Int!
}

#
enum Type {
  FILES
  FOLDERS
  PATHS
}

# An edge in a connection
type ComponentEdge {
  # The item at the end of the edge
  node: Component

  # cursor marks a unique position or index into the connection
  cursor: String!
}

# An edge in a connection
type ScanLicenseAssetEdge {
  # The item at the end of the edge
  node: ScanLicenseAsset

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
enum VulnerabilitySeverity {
  CRITICAL
  HIGH
  INFO
  LOW
  MEDIUM
  UNASSIGNED
}

#
enum ConditionDataType {
  DBL
  DCM
  INT
  STR
  SVR
}

#
enum LicenseOrigin {
  ASSET
  COMPONENT
  REPOSITORY
  REPOSITORY_LICENSE
  REPOSITORY_META
}

#
type Policy {
  actions: [PolicyAction]
  active: Boolean
  applyToChilds: Boolean
  conditionTree: PolicyConditionGroup
  conditionType: ConditionType
  conditions: PolicyConditionGroup
  createDate: Date
  createdBy: String
  dateLastStateChange: Date
  description: String
  entity: Entity
  entityId: UUID
  name: String
  orgId: UUID
  overridePolicyId: UUID
  overridePolicyTitle: String
  policyId: UUID
  project: Project
  projectId: UUID
  stateChangedBy: String
  title: String
}

#
type ProjectMetrics {
  assetMetrics: DimensionalAssetMetrics
  componentMetrics: DimensionalComponentMetrics
  licenseMetrics: DimensionalLicenseMetrics
  measureDate: LocalDate
  orgId: UUID
  projectId: UUID
  supplyChainMetrics: DimensionalSupplyChainMetrics
  vulnerabilityMetrics: DimensionalVulnerabilityMetrics
}

#
type ThreatrixOrganization {
  created: Date
  name: String
  orgId: UUID
  tenantId: String
}

#
enum ActionType {
  ALERT
  ATTRIBUTION
  ISSUE
  RELEASE
  UPGRADE_VERSION
}

# An edge in a connection
type ScanComponentEdge {
  # The item at the end of the edge
  node: ScanComponent

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
enum EntityMetricsType {
  ENTITY
  PROJECT
}

#
type Copyright {
  endYear: Int!
  owners: [String]
  startYear: Int!
  text: String
  toPresent: Boolean!
}

# A connection to a list of items.
type ScanAssetMatchGroupConnection {
  # a list of edges
  edges: [ScanAssetMatchGroupEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

# UUID String
scalar UUID

#
type RepositoryEdge {
  cursor: String
  node: Repository
}

# Built-in scalar for map-like structures
scalar Map_SupplyChainMetric_IntegerScalar

#
input EntitySettingsRequestInput {
  jiraCredentials: JiraCredentialsInput
  alertSlackUrls: [String]
  entityId: UUID
  alertEmailAdressess: [String]
}

#
type EntitySetting {
  alertEmailAdressess: [String]
  alertSlackUrls: [String]
  entityId: UUID
  jiraCredentials: JiraCredentials
  orgId: UUID
}

#
type ProjectScanTask {
  durationMs: Long!
  entityId: UUID
  operationList: [TaskOperation]
  operationTypes: [TaskOperationType]
  operations: Map_TaskOperationType_TaskOperationScalar
  orgId: UUID
  pctComplete: Int!
  resourceId: UUID
  result: ScanResult
  status: TaskStatus
  statusMessage: String
  subtasks: [Task_ScanResult_UUID]
  taskToken: String
  versionHash: String
}

#
type EntityVulnerability {
  cvssV2BaseScore: BigDecimal
  cvssV3BaseScore: BigDecimal
  cwe: Cwe
  entityId: UUID
  inflectionCount: Int!
  orgId: UUID
  patchedVersions: String
  published: Date
  recommendation: String
  severity: String
  source: String
  vulnId: String
  vulnerabilityId: UUID
  vulnerabilityInfection: InfectionMetrics
  vulnerableVersions: String
}

#
type GrantedAuthority {
  authority: String
}

#
type Task_ScanResult_UUID {
  durationMs: Long!
  entityId: UUID
  operationList: [TaskOperation]
  operationTypes: [TaskOperationType]
  operations: Map_TaskOperationType_TaskOperationScalar
  orgId: UUID
  pctComplete: Int!
  resourceId: UUID
  result: ScanResult
  status: TaskStatus
  statusMessage: String
  subtasks: [Task_ScanResult_UUID]
  taskToken: String
  versionHash: String
}

# A connection to a list of items.
type RepositoryReleaseLicenseConnection {
  # a list of edges
  edges: [RepositoryReleaseLicenseEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

#
type Vulnerability {
  affectedProjects(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): VulnerabilityProjectConnection
  components(
    #
    vulnerabilityId: UUID

    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    #
    scanId: UUID

    # Returns the elements in the list that come after the specified cursor
    after: String

    #
    orgId: UUID

    # Returns the first n elements from the list
    first: Int
  ): ComponentConnection
  created: Date
  credits: String
  cvssV2BaseScore: BigDecimal
  cvssV2ExploitabilitySubScore: BigDecimal
  cvssV2ImpactSubScore: BigDecimal
  cvssV2Vector: String
  cvssV3BaseScore: BigDecimal
  cvssV3ExploitabilitySubScore: BigDecimal
  cvssV3ImpactSubScore: BigDecimal
  cvssV3Vector: String
  cwe: Cwe
  description: String
  patchedVersions: String
  published: Date
  recommendation: String
  references: String
  severity: VulnerabilitySeverity
  source: String
  subtitle: String
  title: String
  updated: Date
  vulnId: String
  vulnJiraTicket(vulnerabilityId: UUID, scanId: UUID, orgId: UUID): JiraTicket
  vulnerabilityId: UUID
  vulnerableVersions: String
}

#
enum RepositoryCode {
  BITBUCKET
  GITHUB
  GITLAB
  LUAROCKS
  MAVEN_CENTRAL
  NPM
  NUGET
  PASTEBIN
  PYPI
  STACKOVERFLOW
}

#
enum EntityType {
  BUSINESS_UNIT
  DASHBOARD
  DIVISION
  TEAM
}

# An edge in a connection
type UserEdge {
  # The item at the end of the edge
  node: User

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
enum ConditionType {
  CODE_QUALITY
  COMPONENT
  LEGAL
  PROJECT_TAG
  RELEASE_STAGE
  SCOPE
  SECURITY
  SUPPLY_CHAIN
  THRESHOLD
}

# Mutation root
type Mutation {
  createInvite(orgId: UUID): Invite
  attributeAsset(attributeAssetRequest: AttributeAssetRequestInput): Boolean!
  updateRole(role: RoleRequestInput): Role
  updateOrgName(orgNameRequest: OrgNameRequestInput): ThreatrixOrganization
  generateOrgApiKey(apiKeyRequest: ApiKeyRequestInput): ApiKey
  createRole(role: RoleRequestInput): Role
  setEntityJiraCredentials(
    entitySetting: EntitySettingsRequestInput
  ): EntitySetting
  removeRolesFromUser(roles: [String], username: String): User
  updateApiKey(apiKeyRequest: ApiKeyRequestInput): ApiKey
  updateIgnoredFiles(
    ignoredFilesRequest: IgnoredFilesRequestInput
  ): IgnoredFiles
  addRolesToUser(roles: [String], username: String): User
  updateOrgApiKey(apiKeyRequest: ApiKeyRequestInput): ApiKey
  createVulnerabilityJiraTicket(
    jiraRequest: VulnerabilityJiraRequestInput
  ): JiraTicket
  setOrgEmails(entitySetting: EntitySettingsRequestInput): EntitySetting
  removePermissionsFromRole(role: RoleRequestInput): Role
  enablePolicy(policyRequest: PolicyRequestInput): Policy
  setOrgSlackUrls(entitySetting: EntitySettingsRequestInput): EntitySetting
  removeRole(role: RoleRequestInput): Role
  setOrgJiraCredentials(
    entitySetting: EntitySettingsRequestInput
  ): EntitySetting
  createScanAssetMatchJiraTicket(
    jiraRequest: ScanAssetMatchJiraRequestInput
  ): JiraTicket
  removeApiKey(apiKeyRequest: ApiKeyRequestInput): ApiKey
  setProjectTags(projectId: UUID, tags: String): Project
  setRolesToUser(roles: [String], username: String): User
  updateUser(user: UserRequestInput): User
  setEntityEmails(entitySetting: EntitySettingsRequestInput): EntitySetting
  createLicenseJiraTicket(jiraRequest: LicenseJiraRequestInput): JiraTicket
  addPermissionsToRole(role: RoleRequestInput): Role
  saveIgnoredFiles(ignoredFilesRequest: IgnoredFilesRequestInput): IgnoredFiles
  removePolicy(policyRequest: PolicyRequestInput): Policy
  createPolicy(policyRequest: PolicyRequestInput): Policy
  createEntity(entity: EntityRequestInput): Entity
  removeEntity(entityId: UUID): Entity
  updateEntity(entity: EntityRequestInput): Entity
  removeIgnoredFiles(
    ignoredFilesRequest: IgnoredFilesRequestInput
  ): IgnoredFiles
  removeOrgApiKey(apiKeyRequest: ApiKeyRequestInput): ApiKey
  updateInvitedUser(inviteHash: String, user: InvitedUserRequestInput): Boolean!
  generateApiKey(apiKeyRequest: ApiKeyRequestInput): ApiKey
  createUser(user: UserRequestInput): User
  sendInviteMail(inviteMailDataRequest: InviteMailDataRequestInput): Boolean
  setEntitySlackUrls(entitySetting: EntitySettingsRequestInput): EntitySetting
}

#
type BitbucketAccount {
  doesntUsed: String
}

#
type RepositoryConnection {
  edges: [RepositoryEdge]
  nodes: [Repository]
  pageInfo: PageInfo
  totalCount: Int!
}

#
enum LicenseCategory {
  COPYLEFT
  COPYLEFT_LIMITED
  COPYLEFT_PARTIAL
  COPYLEFT_STRONG
  COPYLEFT_WEAK
  PERMISSIVE
  PROPRIETARY
  PROPRIETARY_FREE
  PUBLIC_DOMAIN
  UNDEFINED
}

#
type User {
  accessToken: String
  accountName: String
  accountNonExpired: Boolean!
  accountNonLocked: Boolean!
  apiKeys(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ApiKeyConnection
  approved: Boolean
  authorities: [GrantedAuthority]
  avatarUrl: String
  coverLetter: String
  created: Date
  credentialsNonExpired: Boolean!
  defaultEntityId: UUID
  email: String
  enabled: Boolean!
  entities: [Entity]
  fname: String
  invitedByUsername: String
  lname: String
  orgId: UUID
  organization: ThreatrixOrganization
  password: String
  permissions: [Permission]
  phone: String
  position: String
  repositoryAccounts: RepositoryAccounts
  repositoryAccountsJson: String
  roles: [Role]
  userEntities(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): EntityConnection
  userPermissions: [PermissionObject]
  userRoles: [Role]
  username: String
}

#
input InviteMailDataInput {
  inviteUrl: String
  to: String
  inviteHash: String
  subject: String
  body: String
  htmlBody: String
}

#
input PolicyConditionGroupInput {
  threshold: Int
  groups: [PolicyConditionGroupInput]
  scope: ConditionScope
  thresholdId: UUID
  autoAdjustThreshold: Boolean
  groupOperator: GroupOperator
  conditions: [PolicyConditionInput]
}

#
type PolicyCondition {
  autoAdjustThreshold: Boolean
  conditionDataType: ConditionDataType
  conditionName: ConditionName
  conditionType: ConditionType
  decimalValue: BigDecimal
  doubleValue: Float
  intValue: Int
  logicalOperator: GroupOperator
  operator: ConditionOperator
  severityValue: VulnerabilitySeverity
  strValue: String
  threshold: Int
  thresholdId: UUID
}

#
enum LanguageType {
  ABAP
  ACTIONSCRIPT
  ADA
  AGDA
  AGS_SCRIPT
  ALLOY
  AMPL
  ANTLR
  APEX
  APL
  APPLESCRIPT
  ARC
  ARDUINO
  ASP
  ASPECTJ
  ASSEMBLY
  ATS
  AUGEAS
  AUTOHOTKEY
  AUTOIT
  AWK
  BATCHFILE
  BEFUNGE
  BISON
  BITBAKE
  BLITZBASIC
  BLITZMAX
  BLUESPEC
  BOO
  BRAINFUCK
  BRIGHTSCRIPT
  BRO
  C
  C2HS_HASKELL
  CAP_N_PROTO
  CARTOCSS
  CEYLON
  CHAPEL
  CHARITY
  CHUCK
  CIRRU
  CLARION
  CLEAN
  CLICK
  CLIPS
  CLOJURE
  COBOL
  COFFEESCRIPT
  COLDFUSION
  COLDFUSION_CFC
  COMMON_LISP
  COMPONENT_PASCAL
  COOL
  COQ
  CPP
  CRYSTAL
  CSHARP
  CSOUND
  CSOUND_DOCUMENT
  CSOUND_SCORE
  CUDA
  CYCRIPT
  CYTHON
  D
  DART
  DIGITAL_COMMAND_LANGUAGE
  DM
  DOGESCRIPT
  DTRACE
  DYLAN
  E
  EC
  ECL
  ECLIPSE
  EIFFEL
  ELIXIR
  ELM
  EMACS_LISP
  EMBERSCRIPT
  EQ
  ERLANG
  FACTOR
  FANCY
  FANTOM
  FILEBENCH_WML
  FILTERSCRIPT
  FLUX
  FORTH
  FORTRAN
  FREEMARKER
  FREGE
  FSHARP
  GAME_MAKER_LANGUAGE
  GAMS
  GAP
  GCC_MACHINE_DESCRIPTION
  GDB
  GDSCRIPT
  GENIE
  GENSHI
  GHERKIN
  GLSL
  GLYPH
  GNUPLOT
  GO
  GOLO
  GOSU
  GRACE
  GRAMMATICAL_FRAMEWORK
  GROOVY
  GROOVY_SERVER_PAGES
  HACK
  HARBOUR
  HASKELL
  HAXE
  HCL
  HLSL
  HTML
  HY
  HYPHY
  IDL
  IDRIS
  IGOR_PRO
  INFORM_7
  INNO_SETUP
  IO
  IOKE
  ISABELLE
  J
  JASMIN
  JAVA
  JAVASCRIPT
  JAVA_SERVER_PAGES
  JFLEX
  JISON
  JISON_LEX
  JSONIQ
  JSX
  JULIA
  KICAD
  KOTLIN
  KRL
  LABVIEW
  LASSO
  LEAN
  LEX
  LFE
  LILYPOND
  LIMBO
  LITERATE_AGDA
  LITERATE_COFFEESCRIPT
  LITERATE_HASKELL
  LIVESCRIPT
  LLVM
  LOGOS
  LOGTALK
  LOLCODE
  LOOKML
  LOOMSCRIPT
  LSL
  LUA
  M
  M4
  M4SUGAR
  MAKEFILE
  MAKO
  MARKDOWN
  MATHEMATICA
  MATLAB
  MAX
  MAXSCRIPT
  MERCURY
  METAL
  MINID
  MIRAH
  MODELICA
  MODULA_2
  MODULE_MANAGEMENT_SYSTEM
  MONKEY
  MOOCODE
  MOONSCRIPT
  MQL4
  MQL5
  MUF
  MUPAD
  MYGHTY
  NCL
  NEMERLE
  NESC
  NETLINX
  NETLINX_ERB
  NETLOGO
  NEWLISP
  NIM
  NIT
  NIX
  NSIS
  NU
  NUMPY
  OBJECTIVE_C
  OBJECTIVE_CPP
  OBJECTIVE_J
  OCAML
  OMGROFL
  ONE_C_ENTERPRISE
  OOC
  OPA
  OPAL
  OPENCL
  OPENEDGE_ABL
  OPENSCAD
  OX
  OXYGENE
  OZ
  P4
  PAN
  PAPYRUS
  PARROT
  PARROT_ASSEMBLY
  PARROT_INTERNAL_REPRESENTATION
  PASCAL
  PAWN
  PERL
  PERL6
  PHP
  PICOLISP
  PIGLATIN
  PIKE
  PLPGSQL
  PLSQL
  POGOSCRIPT
  PONY
  POV_RAY_SDL
  POWERBUILDER
  POWERSHELL
  PROCESSING
  PROLOG
  PROPELLER_SPIN
  PUREBASIC
  PURESCRIPT
  PURE_DATA
  PYTHON
  QMAKE
  QML
  R
  RACKET
  RAGEL
  RASCAL
  REALBASIC
  REASON
  REBOL
  RED
  REDCODE
  RENDERSCRIPT
  REN_PY
  REXX
  ROUGE
  RUBY
  RUST
  SAGE
  SALTSTACK
  SAS
  SCALA
  SCHEME
  SCILAB
  SELF
  SHELL
  SHELLSESSION
  SHEN
  SLASH
  SMALI
  SMALLTALK
  SMARTY
  SMT
  SOURCEPAWN
  SQF
  SQLPL
  SQUIRREL
  STAN
  STANDARD_ML
  STATA
  SUPERCOLLIDER
  SWIFT
  SYSTEMVERILOG
  TCL
  TERRA
  THRIFT
  TI_PROGRAM
  TLA
  TURING
  TXL
  TYPESCRIPT
  UNIFIED_PARALLEL_C
  UNKNOWN
  UNO
  UNREALSCRIPT
  URWEB
  VALA
  VCL
  VERILOG
  VHDL
  VIM_SCRIPT
  VISUAL_BASIC
  VOLT
  WEBIDL
  WISP
  X10
  XBASE
  XC
  XOJO
  XPAGES
  XPROC
  XQUERY
  XS
  XSLT
  XTEND
  YACC
  ZEPHIR
  ZIMPL
}

# Built-in scalar for map-like structures
scalar Map_VulnerabilitySeverity_IntegerScalar

#
type ScanComponentLicense {
  category: LicenseCategory
  componentId: UUID
  isFsfLibre: Boolean!
  isOsiApproved: Boolean!
  licenseDiscovery: RepositoryLicenseType
  licenseId: String
  licenseOrigin: LicenseOrigin
  name: String
  orgId: UUID
  publicationYear: Int
  scanId: UUID
  spdxId: String
  style: String
  trustLevel: LicenseTrustLevel
  type: String
}

#
type ScanLicenseAsset {
  licenseId: String
  needIncludeInCode: Boolean
  orgId: UUID

  # String representation of ByteBuffer scanAssetId
  scanAssetId: String
  scanId: UUID
}

#
enum InfectionType {
  COMPONENT
  LICENSE
  VULNERABILITY
}

#
type ScanAssetMatch {
  assetMasterMatchId: String
  assetMatchId: String
  assetRepositoryUrl: StringHolder
  assetSize: Long!
  earliestReleaseDate: Date
  earliestReleaseVersion: String
  latestReleaseDate: Date
  latestReleaseVersion: String
  matchGroups(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): ScanAssetMatchGroupConnection
  matchLicenses: [ScanAssetMatchLicense]
  matchRepository: AssetMatchRepository
  matchRepositoryJson: String
  name: String
  orgId: UUID
  originAssetId: String
  percentMatch: Float!
  releases(
    # Returns the last n elements from the list
    last: Int

    # Returns the elements in the list that come before the specified cursor
    before: String

    # Returns the elements in the list that come after the specified cursor
    after: String

    # Returns the first n elements from the list
    first: Int
  ): AssetReleaseConnection
  scanAssetMatchGroups: [ScanAssetMatchGroup]
  scanAssetMatchJiraTicket: JiraTicket
  scanId: UUID
}

#
enum LicenseContext {
  ASSET
  PATH
  REPOSITORY_ASSIGNED
  REPOSITORY_DISCOVERED
  REPOSITORY_RELEASE
}

#
type ComponentMetrics {
  critical: Int!
  findingsAudited: Int!
  findingsTotal: Int!
  findingsUnaudited: Int!
  firstOccurrence: Date
  high: Int!
  inheritedRiskScore: Int!
  lastOccurrence: Date
  low: Int!
  medium: Int!
  suppressed: Int!
  unassigned: Int!
  vulnerabilities: Int!
}

#
type ComponentRepositoryMeta {
  lastCheck: Date
  latestVersion: String
  name: String
  namespace: String
  published: Date
  repositoryType: String
}

#
type EntityMetricsGroup {
  entityMetrics: [EntityMetrics]
  period: MetricsPeriod
  projectCount: Int
}

#
type ScanMetricsSummary {
  assetMetrics: AssetMetricsSummary
  licenseMetrics: LicenseMetricsSummary
  orgId: UUID
  scanId: UUID
  supplyChainMetrics: SupplyChainMetricsSummary
  vulnerabilityMetrics: VulnerabilityMetricsSummary
}

# A connection to a list of items.
type ScanConnection {
  # a list of edges
  edges: [ScanEdge]

  # details about this specific page
  pageInfo: PageInfo!

  # Total count of items in the connection
  totalCount: Long!
}

# An edge in a connection
type PolicyEdge {
  # The item at the end of the edge
  node: Policy

  # cursor marks a unique position or index into the connection
  cursor: String!
}

# An edge in a connection
type ApiKeyEdge {
  # The item at the end of the edge
  node: ApiKey

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
input PolicyConditionInput {
  intValue: Int
  conditionType: ConditionType
  doubleValue: Float
  severityValue: VulnerabilitySeverity
  autoAdjustThreshold: Boolean
  thresholdId: UUID
  decimalValue: BigDecimal
  conditionName: ConditionName
  conditionDataType: ConditionDataType
  strValue: String
  threshold: Int
  operator: ConditionOperator
  logicalOperator: GroupOperator
}

# Built-in java.math.BigDecimal
scalar BigDecimal

# Built-in scalar representing an instant in time
scalar Date

# An edge in a connection
type AssetReleaseEdge {
  # The item at the end of the edge
  node: AssetRelease

  # cursor marks a unique position or index into the connection
  cursor: String!
}

#
enum ComponentDiscoveryMethod {
  DECLARED
  DISCOVERED
}

#
input ScanAssetMatchJiraRequestInput {
  scanId: UUID
  projectId: UUID
  orgId: UUID
  content: String
  assetMatchId: String
}

# Unrepresentable type
scalar UNREPRESENTABLE

#
type VulnerabilityProject {
  created: Date
  entityId: UUID
  orgIdId: UUID
  projectId: UUID
  projectName: String
  scanId: UUID
  scanVersion: String
  vulnerabilityId: UUID
}

#
enum AttributionStatus {
  COMPLETE
  PARTIAL
  REQUIRED
  REVIEWED_IGNORED
}

#
enum TaskOperationType {
  ANALYZING_BOM
  CALC_FEATURE_ASSETS
  CALC_FEATURE_MATCH
  CREATING_BOM
  DOWNLOAD_PROJECT
  PERSIST_SCAN
  PROJECT_FILE_STRUCTURE
  RUN_POLICY
  UNZIP_PROJECT
}

#
type InviteMailData {
  body: String
  htmlBody: String
  inviteHash: String
  inviteUrl: String
  subject: String
  to: String
}

#
type Invite {
  expiredDate: Date
  inviteHash: String
  inviteUrl: String
  invitedUsername: String
  orgId: UUID
  username: String
}`;
