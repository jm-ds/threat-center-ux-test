import {Component, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-date-interval-filter',
  templateUrl: './date-interval-filter.component.html',
  styleUrls: ['./date-interval-filter.component.scss']
})
export class DateIntervalFilterComponent implements OnInit {

  dateStart: any;
  dateEnd: any;

  constructor() { }

  ngOnInit() {
  }

}
