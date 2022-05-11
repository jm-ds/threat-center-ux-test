export class FixResult {
    groupId: string;
    artifactId: string;
    oldVersion: string;
    newVersion: string;
    buildFile: string;
    success: boolean;
    errorMessage: string;
}

export class TxComponent {
  componentId: number;
  name: string;
  group: string;
  version: string;
  repositoryMeta?: {
    repositoryType: string;
    latestVersion: string;
    published: string;
    lastCheck: Date;
  };
  copyrightList: Copyright[];
  releaseDate: Date;
}

export class Copyright {
    text: string;
    startYear: number;
    endYear: number;
    owners: string[];
    toPresent: boolean;
}

export interface ComponentQuery {
    component: TxComponent;
}
export interface ScanComponentQuery {
    scanComponent: TxComponent;
}

export interface FixComponentVersionQuery {
  fixComponentVersion: FixResult[];
}
