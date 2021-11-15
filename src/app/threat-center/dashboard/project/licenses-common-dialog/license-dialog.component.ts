import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'license-dialog',
    templateUrl: './license-dialog.component.html'
})

export class LicenseDialogComponent implements OnInit {
    @Input() selectedLicenseDetail;
    constructor(public activeModal: NgbActiveModal) {
    }
    ngOnInit(): void {
    }
}