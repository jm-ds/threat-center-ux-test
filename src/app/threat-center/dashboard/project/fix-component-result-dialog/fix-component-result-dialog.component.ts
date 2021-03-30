import {Component, Input, OnInit} from '@angular/core';
import { FixResult } from '@app/models';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-fix-result',
  templateUrl: './fix-component-result-dialog.component.html',
  styleUrls: ['./fix-component-result-dialog.component.scss']
})
export class FixComponentResultDialogComponent implements OnInit {

  @Input() fixResults: FixResult[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeBtn() {
    this.activeModal.close();
  }

}
