import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FixComponentResultDialogComponent} from "@app/threat-center/dashboard/project/fix-component-result-dialog/fix-component-result-dialog.component";
import {NgxSpinnerService} from "ngx-spinner";
import {Observable} from "rxjs";
import {FixResult, PatchedInfoSimplified} from "@app/threat-center/shared/models/types";
import { FixService } from '@app/services/fix.service';

@Component({
    selector: 'app-fix-component-dialog',
    templateUrl: './fix-component-dialog.component.html',
    styleUrls: ['./fix-component-dialog.component.scss']
})
export class FixComponentDialogComponent implements OnInit {
    scanId;
    newVersion: string;
    oldVersion: string;
    componentId;

    fixResultObservable: Observable<FixResult[]>;
    patchedVersions: PatchedInfoSimplified;
    loading = true;

    constructor(
        private modalService: NgbModal,
        public activeModal: NgbActiveModal,
        private fixService: FixService,
        private spinner: NgxSpinnerService) {
    }

  ngOnInit() {
    this.fixService
      .getPatchedVersion(this.componentId)
      .subscribe(patchedVersion => {
        this.loading = false;
        this.patchedVersions = patchedVersion;

        if (patchedVersion.nextPatchedVersion === patchedVersion.latestPatchedVersion) {
          this.newVersion = patchedVersion.latestPatchedVersion;
        }
      });
  }

  fixVersion() {
    this.spinner.show();
    this.fixService.fixComponentVersion(this.scanId, this.componentId, this.oldVersion, this.newVersion)
      .subscribe(results => {
        const modalRef = this.modalService.open(FixComponentResultDialogComponent, {
          keyboard: false,
        });
        modalRef.componentInstance.fixResults = results;
      }, error => {
        console.error('error: ' + error);
      }, () => {
        this.spinner.hide();
      });
  }

  closeBtn() {
    this.activeModal.close();
  }
}
