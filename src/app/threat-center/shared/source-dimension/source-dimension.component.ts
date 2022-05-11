import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { RouterModule, Routes } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { FilterUtils } from 'primeng/utils';
import { Table } from 'primeng/table';

@Component({
  selector: 'tc-source-dimension',
  templateUrl: './source-dimension.component.html',
  styleUrls: ['./source-dimension.component.scss']
})
export class SourceDimensionComponent implements OnInit {


  public assetCols = [
      { field: 'name', header: 'Name'},
      { field: 'pct_opensource', header: '% Embedded' },
      { field: 'status', header: 'Scan Status' },
      { field: 'size', header: 'Size' },
      { field: 'licenses', header: 'License(s)' },
  ];

  public assetData = [
    {"assetId": "1v32g23t", "name": "biglignasdfsdfile.java", "size": 5550 , "pct_opensource":55,"status": "Ingored","licenses": [{"name":"GPL v3"},{"name":"Apache License 1.0"}]},
    {"assetId": "zc78ysdy", "name": "turkeyluirkey.j", "size": 3535 , "pct_opensource":5,"status": "Too Large","licenses": [{"name":"GPL v3"}]},
    {"assetId": "asd89v8y", "name": "umbitch.js", "size": 3623 , "pct_opensource":3.6,"status": "Too Small","licenses": [{"name":"GPL v3"}]},
    {"assetId": "asdv89as", "name": "filename.py", "size": 63523 , "pct_opensource":2.7,"status": "Analyzed","licenses": [{"name":"GPL v3"}]},
    {"assetId": "asdf898d", "name": "janga.cs", "size": 236768 , "pct_opensource":46.3,"status": "Analyzed","licenses": [{"name":"GPL v3"}]},
    {"assetId": "asdf8668", "name": "tobongo.java", "size": 56787 , "pct_opensource":17.4,"status": "File type not supported","licenses": [{"name":"GPL v3"}]},
  ];

  @ViewChild(Table) private table: Table;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Filter table
   *
   * @param event input event
   */
   onFilterInput(event: Event) {
    const { value } = event.target as HTMLInputElement;

    this.table.filterGlobal(value, 'contains');
  }
}
