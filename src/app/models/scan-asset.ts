import {Repository} from "./scan";
import {PageInfo} from "@app/models/common";
import {StringHolder} from "@app/threat-center/shared/models/types";

export class ScanAsset {
    orgId: string;
    name: string;
    size: number;
    fileSize: number;
    scanAssetId: string;
    originAssetId: string;
    workspacePath: string;
    status: string;
    scanAssetType: string;
    content: string;
    projectId: string;
    matchRepository: Repository;
    matches: ScanAssetMatch[];
    embeddedAssets: any;
    attributionStatus: string;
    assetRepositoryUrl: StringHolder;
}

export class ScanAssetMatch {
    assetMatchId: string;
    percentMatch: number;
}

export type ScanAssetQuery = {
    scanAsset: ScanAsset;
};

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
    readonly licenseIds: any[];
    readonly attributeComment: string;
    constructor(scanId: string, scanAssetId: string, licenseIds: any[], attributeComment: string) {
        this.scanId = scanId;
        this.scanAssetId = scanAssetId;
        this.licenseIds = licenseIds;
        this.attributeComment = attributeComment;
    }
}

export class ScanAssetsTreeConnection {
    edges: ScanAssetsTreeEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}

export class ScanAssetsTreeEdge {
    node: ScanAsset;
    cursor: string;
}

export class ScanLicenseAssetConnection {
    edges: ScanLicenseAssetEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}

export class ScanLicenseAssetEdge {
    node: ScanLicenseAsset;
    cursor: string;
}

export class ScanLicenseAsset {
    orgId: string;
    scanId: string;
    licenseId: string;
    scanAssetId: string;
}

export class ScanComponentConnection {
    edges: ScanComponentEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}

export class ScanComponentEdge {
    node: ScanComponent;
    cursor: string;
}

export class ScanComponent {
    orgId: string;
    scanId: string;
    componentId: string;
    group: string;
    name: string;
    version: string;
    purl: string;
}
