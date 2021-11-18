import { Injectable } from "@angular/core";
import Swal, { SweetAlertType } from "sweetalert2";

@Injectable({
    providedIn: 'root'
})

export class AlertService {
    constructor() { }

    // Core alert message
    alertBox(text: string, title: string = "Error!", type) {
        return Swal.fire({
            type: type,
            title: title,
            text: text
        });
    }

    alertConfirm(title: string, text: string,
        typ: SweetAlertType = 'warning',
        isshowConfirmButton: boolean = false,
        isshowCancelButton: boolean = false,
        confirmButtonColor: string,
        cancelButtonColor: string,
        confirmButtonText: string,
        cancelButtonText: string
    ) {
        return Swal.fire({
            title: title,
            text: text,
            type: typ,
            showConfirmButton: isshowConfirmButton,
            showCancelButton: isshowCancelButton,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: cancelButtonColor,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText
        });
    }

    alertBoxHtml(text: string, title: string = "Error!", type: string = "error") {
        return Swal.fire({
            type: "error",
            title: title,
            html: text
        });
    }

}