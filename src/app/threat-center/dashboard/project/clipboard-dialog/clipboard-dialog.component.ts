import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-clipboard-dialog',
  templateUrl: './clipboard-dialog.component.html',
  styleUrls: ['./clipboard-dialog.component.scss']
})
export class ClipboardDialogComponent implements OnInit {

  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeBtn() {
    this.activeModal.close();
  }

}
