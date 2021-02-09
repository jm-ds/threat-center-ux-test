import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/security/services/authentication.service';
import { NextConfig } from '@app/app-config';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { UserPreferenceModel } from '../core.class';

@Injectable({
    providedIn: 'root'
})

export class CoreHelperService {
    private subject = new Subject();
    isBrowserBackclick: boolean = false;
    constructor(private authenticationService: AuthenticationService, private router: Router) { }


    // Core alert message
    swalALertBox(text: string, title: string = "Error!", type: string = "error") {
        return Swal.fire({
            type: "error",
            title: title,
            text: text
        });
    }

    swalAlertConfrm(title: string, text: string) {
        return Swal.fire({
            title: title,
            text: text,
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true
        })
    }

    //get messages according to status
    public getMessageStatusWise(status) {
        let msg = "";
        switch (status) {
            case 500: {
                msg = "The server encountered an unexpected condition which prevented it from fulfilling the request.";
                break;
            }
            case 400: {
                msg = "The request had bad syntax or was inherently impossible to be satisfied.";
                break;
            }
            case 403: {
                msg = "The requested resource is forbidden.";
                break;
            }
            case 404: {
                msg = "The server has not found anything matching the URI given.";
                break;
            }
            case 501: {
                msg = "The server does not support the facility required.";
                break;
            }
            default: {
                //statements; 
                msg = "Something went wrong!";
                break;
            }
        }
        return msg;
    }

    spinnerEdit(isSpeenerVisible) {
        this.subject.next(isSpeenerVisible);
    }

    getSpinner() {
        return this.subject.asObservable();
    }

    //PROJECT(PROJECT DASHBOARD) PAGE BREADCUM START
    settingProjectBreadcum(tag, name, id, isFromComponent: boolean = false) {
        let projectBreadcum: any = {};
        if (!!sessionStorage.getItem("ProjectBreadcum")) {
            // update
            projectBreadcum = JSON.parse(sessionStorage.getItem("ProjectBreadcum"));
        }
        if (tag === 'Project') {
            projectBreadcum['SelectedProject'] = { id: id, name: name };
        } else if (tag === 'Entity') {
            projectBreadcum['SelectedEntity'] = { id: id, name: name };
        } else if (tag === 'Component') {
            projectBreadcum['SelectedComponent'] = { id: id, name: name };
        } else if (tag === 'License') {
            projectBreadcum['SelectedLicense'] = { id: id, name: name };
        }
        projectBreadcum['IsFromComponent'] = isFromComponent;
        sessionStorage.setItem("ProjectBreadcum", JSON.stringify(projectBreadcum));
    }

    getProjectBreadcum() {
        if (!!sessionStorage.getItem("ProjectBreadcum")) {
            return JSON.parse(sessionStorage.getItem("ProjectBreadcum"));
        }
        return null;
    }
    //===========================PROJECT(PROJECT DASHBOARD) PAGE BREADCUM END ==========================

    //USER PREFERENCES START (Store User visited last(previous) tab sleceted and Item per page by module)
    settingUserPreference(moduleName: string, previousLastTabSelected: string, lastTabSelectedName: string, itemPerPageD: { componentName: string, value: string } = null) {
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
                }
            });
        } else {
            //push Data first time.
            let itemPPage = [];
            let prevousTabList = [];
            if (!!itemPerPageD) {
                itemPPage.push(itemPerPageD);
            }
            if (!!previousLastTabSelected && previousLastTabSelected !== '') {
                prevousTabList.push(previousLastTabSelected);
            }
            preferenceDetails.push(
                {
                    moduleName: moduleName,
                    itemPerPageDetails: itemPPage,
                    lastTabSelectedName: lastTabSelectedName,
                    lastSelectedTabLists: prevousTabList
                }
            )
        }
        sessionStorage.setItem("UserPreference", JSON.stringify(preferenceDetails));
    }

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

    getPreferenceDetailsFromSession() {
        return JSON.parse(sessionStorage.getItem("UserPreference"));
    }
    //==================================USER PREFERENCES END ============================================


    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    logoutUser() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    removeNextDarkClassFormBody() {
        document.querySelector('body').classList.remove('next-dark');
    }

    setBrowserBackButton(isBack) {
        this.isBrowserBackclick = isBack;
    }

    getBrowserBackButton() {
        return this.isBrowserBackclick;
    }

    getDifferencebetweenStrings(a: string, b: string) {
        var i = 0;
        var j = 0;
        var result = "";
    
        while (j < b.length) {
          if (a[i] != b[j] || i == a.length)
            result += b[j];
          else
            i++;
          j++;
        }
        return result;
      }
}


export class LogOutStaticHelper {
    static coreSer: CoreHelperService;
    static logoutUser(coreHelperService: CoreHelperService) {
        coreHelperService.logoutUser();
    }
}
