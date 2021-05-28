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
    componentId;
    copyrights: Copyright[];
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
