import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert-type-settings',
  templateUrl: './alert-type-settings.component.html',
  styleUrls: ['./alert-type-settings.component.scss']
})
export class AlertTypeSettingsComponent implements OnInit {

  @Input()
  typeName: string;

  constructor() { }

  ngOnInit() {
  }

}
