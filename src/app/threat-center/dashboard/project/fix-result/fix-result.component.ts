import {Component, Input, OnInit} from '@angular/core';
import {FixResult} from "@app/threat-center/shared/models/types";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-fix-result',
  templateUrl: './fix-result.component.html',
  styleUrls: ['./fix-result.component.scss']
})
export class FixResultComponent implements OnInit {

  @Input() fixResults: FixResult[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeBtn() {
    this.activeModal.close();
  }

}
