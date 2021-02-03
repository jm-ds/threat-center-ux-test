import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/security/services/authentication.service';
import { NextConfig } from '@app/app-config';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { UserPreferenceModel } from '../core.class';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})

export class CoreHelperService {
    private subject = new Subject();

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

    spinnerEdit(isSpeenerVisible) {
        this.subject.next(isSpeenerVisible);
    }

    getSpinner() {
        return this.subject.asObservable();
    }

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

    settingUserPreference(moduleName: string, lastTabSelectedName: string, itemPerPageD: { componentName: string, value: string } = null) {
        let preferenceDetails: Array<UserPreferenceModel> = [];
        if (!!sessionStorage.getItem("UserPreference")) {
            preferenceDetails = this.getPreferenceDetailsFromSession();
        }
        if (preferenceDetails.filter(pre => { return pre.moduleName === moduleName }).length >= 1) {
            //Update Data
            preferenceDetails.forEach(prefrence => {
                if (prefrence.moduleName === moduleName) {
                    prefrence.lastTabSelectedName = !!lastTabSelectedName && lastTabSelectedName !== '' ? lastTabSelectedName : prefrence.lastTabSelectedName;
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
            //push Data
            let itemPPage = [];
            if (!!itemPerPageD) {
                itemPPage.push(itemPerPageD);
            }
            preferenceDetails.push(
                {
                    moduleName: moduleName,
                    itemPerPageDetails: itemPPage,
                    lastTabSelectedName: lastTabSelectedName
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

    printErrorMessageToConsol(message: string) {
        if (!environment.production && !environment.staging) {
            console.log("ERROR:-", message);
        }
    }

}


export class LogOutStaticHelper {
    static coreSer: CoreHelperService;
    static logoutUser(coreHelperService: CoreHelperService) {
        coreHelperService.logoutUser();
    }
}
