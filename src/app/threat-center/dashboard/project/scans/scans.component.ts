import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute,RouterLink } from '@angular/router';
import { Project,Scan } from '@app/threat-center/shared/models/types';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';

@Component({
  selector: 'scans',
  templateUrl: './scans.component.html',
  styles: []
})
export class ScansComponent implements OnInit {

  constructor() { }

    ngOnInit() {

    }
}
