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
        Swal.fire({
            type: "error",
            title: "Error!",
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
}
