import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';

@Component({
    selector: 'app-project-settings',
    templateUrl: './project-settings.component.html',
    styleUrls: ['./project-settings.component.scss']
  })

  export class ProjectSettingsComponent implements OnInit {
    
    constructor(private location: Location){
    }

    ngOnInit(): void {
    }

    back() {
      this.location.back();
    }
  }  