
export class UserPreferenceModel {
    moduleName?: string;
    panelActiveId?: string;
    selectedDonutChart?: string;
    selectedLinechartTab?: string;
    lastTabSelectedName?: any;
    itemPerPageDetails?: Array<{ componentName: string, value: string }>;
    lastSelectedTabLists: Array<string>;
    lastSelectedScanId?: string;
    assetPreferences?: Array<{ projectId: string, currentStory: any, currentAssetDetails: any }>;
}


