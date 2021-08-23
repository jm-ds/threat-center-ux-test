import { Injectable } from "@angular/core";
import { NextConfig } from "@app/app-config";
import { UserPreferenceModel } from "../core.class";

@Injectable({
    providedIn: 'root'
})

export class UserPreferenceService {
    constructor() { }

    // Set Preference details to session storage
    settingUserPreference(moduleName: string, previousLastTabSelected: string, lastTabSelectedName: string, itemPerPageD: { componentName: string, value: string } = null, panelActiveId = null, selectedDonutChart = null, selectedLinechartTab = null) {
        let preferenceDetails: Array<UserPreferenceModel> = [];
        if (!!sessionStorage.getItem("UserPreference")) {
            preferenceDetails = this.getPreferenceDetailsFromSession();
        }

        if (preferenceDetails.filter(pre => { return pre.moduleName === moduleName }).length >= 1) {
            //Update Data
            preferenceDetails.forEach(prefrence => {
                if (prefrence.moduleName === moduleName) {

                    //current tab settings
                    prefrence.lastTabSelectedName = !!lastTabSelectedName && lastTabSelectedName !== '' ? lastTabSelectedName : prefrence.lastTabSelectedName;

                    //Previous tab settings
                    if (previousLastTabSelected !== null && previousLastTabSelected !== "") {
                        if (!!prefrence.lastSelectedTabLists && prefrence.lastSelectedTabLists.length >= 1) {
                            prefrence.lastSelectedTabLists.push(previousLastTabSelected);
                        } else {
                            prefrence.lastSelectedTabLists = [];
                            prefrence.lastSelectedTabLists.push(previousLastTabSelected);
                        }
                    } else {
                        prefrence.lastSelectedTabLists = previousLastTabSelected == "" ? [] : prefrence.lastSelectedTabLists;
                    }

                    // Item per page setting
                    if (!!itemPerPageD) {
                        if (!!prefrence.itemPerPageDetails && prefrence.itemPerPageDetails.length >= 1) {
                            if (prefrence.itemPerPageDetails.filter(item => { return item.componentName === itemPerPageD.componentName }).length >= 1) {
                                //Update
                                prefrence.itemPerPageDetails.forEach(item => {
                                    if (item.componentName === itemPerPageD.componentName) {
                                        item.value = itemPerPageD.value;
                                    }
                                });
                            } else {
                                //Push Data..
                                prefrence.itemPerPageDetails.push(itemPerPageD);
                            }
                        } else {
                            //Push Data it's new
                            prefrence.itemPerPageDetails.push(itemPerPageD);
                        }
                    }

                    if (panelActiveId !== null) {
                        prefrence.panelActiveId = panelActiveId;
                    }

                    if (selectedDonutChart !== null) {
                        prefrence.selectedDonutChart = selectedDonutChart;
                    }

                    if (selectedLinechartTab !== null) {
                        prefrence.selectedLinechartTab = selectedLinechartTab;
                    }

                }
            });
        } else {
            //pushing Data first time.
            let itemPPage = [];
            let prevousTabList = [];
            if (!!itemPerPageD) {
                itemPPage.push(itemPerPageD);
            }
            if (!!previousLastTabSelected && previousLastTabSelected !== '') {
                prevousTabList.push(previousLastTabSelected);
            }
            preferenceDetails.push({ moduleName: moduleName, itemPerPageDetails: itemPPage, lastTabSelectedName: lastTabSelectedName, lastSelectedTabLists: prevousTabList });
        }
        sessionStorage.setItem("UserPreference", JSON.stringify(preferenceDetails));
    }

    //getting last tab selecetd 
    getLastTabSelectedNameByModule(moduleName: string) {
        if (!!sessionStorage.getItem("UserPreference")) {
            const preferenceDetails = this.getPreferenceDetailsFromSession();
            if (!!preferenceDetails && preferenceDetails.length >= 1) {
                return !!preferenceDetails.find(pre => { return pre.moduleName === moduleName }) ? preferenceDetails.find(pre => { return pre.moduleName === moduleName }).lastTabSelectedName : null;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    //getting panel details for chart
    getPanelDetailByModule(moduleName:string){
        if (!!sessionStorage.getItem("UserPreference")) {
            const preferenceDetails = this.getPreferenceDetailsFromSession();
            if (!!preferenceDetails && preferenceDetails.length >= 1) {
                return !!preferenceDetails.find(pre => { return pre.moduleName === moduleName }) ? preferenceDetails.find(pre => { return pre.moduleName === moduleName }) : null;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    //getting previously seleceted tab details
    getPreviousTabSelectedByModule(moduleName: string, isUpdate: boolean = false) {
        if (sessionStorage.getItem("UserPreference")) {
            const preferenceDetails = this.getPreferenceDetailsFromSession();
            if (!!preferenceDetails && preferenceDetails.length >= 1) {
                const lists = !!preferenceDetails.find(pre => { return pre.moduleName === moduleName }) ?
                    preferenceDetails.find(pre => { return pre.moduleName === moduleName }).lastSelectedTabLists : null;
                if (!!lists && lists.length >= 1) {
                    // return last record and pop it as well
                    const returnVal = lists[lists.length - 1];
                    lists.splice(-1, 1);
                    preferenceDetails.forEach(element => {
                        if (element.moduleName === moduleName) {
                            element['lastSelectedTabLists'] = lists;
                        }
                    });
                    if (isUpdate) {
                        sessionStorage.setItem("UserPreference", JSON.stringify(preferenceDetails));
                    }
                    return returnVal;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    //getting Item per page module by component name...
    getItemPerPageByModuleAndComponentName(moduleName: string, componentName: string) {
        if (!!sessionStorage.getItem("UserPreference")) {
            const preferenceDetails = this.getPreferenceDetailsFromSession();
            if (!!preferenceDetails && preferenceDetails.length >= 1) {
                let moduleItem = preferenceDetails.find(pre => { return pre.moduleName === moduleName });
                if (!!moduleItem && !!moduleItem.itemPerPageDetails && moduleItem.itemPerPageDetails.length >= 1) {
                    return !!moduleItem.itemPerPageDetails.find(item => { return item.componentName === componentName })
                        ? moduleItem.itemPerPageDetails.find(item => { return item.componentName === componentName }).value :
                        NextConfig.config.defaultItemPerPage;
                } else {
                    return NextConfig.config.defaultItemPerPage;
                }
            } else {
                return NextConfig.config.defaultItemPerPage;
            }
        } else {
            return NextConfig.config.defaultItemPerPage;
        }
    }

    private getPreferenceDetailsFromSession() {
        return JSON.parse(sessionStorage.getItem("UserPreference"));
    }
}