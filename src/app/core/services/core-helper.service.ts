import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class CoreHelperService {
    constructor() { }
    

    // Core alert message
    swalALertBox(text: string, title: string = "Error!", type: string = "error") {
        Swal.fire({
            type: "error",
            title: "Error!",
            text: text
        });
    }
}
