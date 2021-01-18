import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class CoreHelperService {
    private subject = new Subject();

    constructor() { }


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

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}
