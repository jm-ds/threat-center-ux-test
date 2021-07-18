import { Component, Injectable, Input, OnInit } from '@angular/core';
import { OrgService } from '@app/admin/services/org.service';
import { EntitySettings } from '@app/models/entity';
import {Router} from "@angular/router";
import {ApiKeyConnection } from '@app/models';


@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'org-apikeys',
    templateUrl: './org-apikeys-list.component.html',
    styleUrls: ['./org-apikeys-list.component.scss']
})
export class OrgApiKeysComponent implements OnInit {
  @Input() public entitySettings: EntitySettings
  @Input() public entityId: string;

  apiKeys: ApiKeyConnection

  constructor(
    private orgService: OrgService,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.orgService.getOrgApiKeys().subscribe(
      data => {
        this.apiKeys = data.data.orgApiKeys;  
      },
      error => {
          console.error("OrgApiKeysComponent", error);
      }
    );
  }


  goToApiKeyShow(apiId) {
    this.router.navigate(['/dashboard/org-setting/integration/org-apikeys/show/apikey/'+apiId]);
  }

}
