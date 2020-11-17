import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  filterTitle: string;
  filterType = 'ALL';
  filterSeverity = 'ALL';
  filterRead = 'ALL';

  constructor() { }

  ngOnInit() {
  }

}
