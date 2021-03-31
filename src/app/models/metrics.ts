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
    projectCount: number;
    measureDate: any;
}

export class EntityMetricsGroup {
    period: any;
    projectCount: number;
    entityMetrics: EntityMetrics[];
}

export class entityMetricsSummaries {
    vulnerabilityMetrics: VulnerabilityMetrics;
    licenseMetrics: LicenseMetrics;
    supplyChainMetrics: SupplyChainMetrics;
    assetMetrics: AssetMetrics;
}

export class EntityMetricsSummaryGroup {
    entityMetricsSummaries: EntityMetricsSummary[];
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
    period: any;
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
    CURRENT = "CURRENT",
    WEEK = "WEEK",
    MONTH = "MONTH",
    QUARTER = "QUARTER",
    YEAR = "YEAR"
}