import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ProjectBreadcumsService {
    constructor() { }
    
    //To Set project breadcums to session storage
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

    //get breadcum details from storage file
    getProjectBreadcum() {
        if (!!sessionStorage.getItem("ProjectBreadcum")) {
            return JSON.parse(sessionStorage.getItem("ProjectBreadcum"));
        }
        return null;
    }
}