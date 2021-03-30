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
}

export type ComponentQuery = {
    component: TxComponent;
}
