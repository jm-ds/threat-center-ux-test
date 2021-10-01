import {Repository, ScanEdge} from "./scan";
import {PageInfo} from "@app/models/common";

export class ScanAsset {
    name: string;
    size: number;
    fileSize: number;
    scanAssetId: string;
    originAssetId: string;
    workspacePath: string;
    status: string;
    assetType: string;
    content: string;
    matchRepository: Repository;
    matches: ScanAssetMatch[];
    embeddedAssets: any;
}

export class ScanAssetMatch {
    assetMatchId: string;
    percentMatch: number;
}

export type ScanAssetQuery = {
    scanAsset: ScanAsset;
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

export class ScanAssetsTreeConnection {
    edges: ScanAssetsTreeEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}

export class ScanAssetsTreeEdge {
    node: ScanAssetTree;
    cursor: string;
}

export class ScanAssetTree extends ScanAsset{
    orgId: string;
    scanId: string;
    parentScanAssetId: string;
    projectId: string;
    assetType: string;
    embeddedAssetPercent: number;
}
