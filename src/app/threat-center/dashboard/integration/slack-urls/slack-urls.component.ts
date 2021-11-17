import { Component, Injectable, Input, OnInit } from '@angular/core';
import { AlertService } from '@app/services/core/alert.service';
import { EntitySettings } from '@app/models/entity';
import { EntityManagerService } from '@app/services/entity-manage.service';
import { OrgService } from '@app/services/org.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';



@Component({
    selector: 'slack-urls',
    templateUrl: './slack-urls.component.html',
    styleUrls: ['./slack-urls.component.scss']
})
export class SlackUrlsComponent implements OnInit {
  @Input() public entitySettings: EntitySettings
  @Input() public entityId: string;
  public columns = ['Slack URL'];

  public editUrl: string;
  private editIndex: number;

  constructor(
    private modalService: NgbModal,
    private orgService: OrgService,
    private entityService: EntityManagerService,
    private alertService:AlertService
  ) {
  }

  ngOnInit() {
    if (!this.entitySettings || !this.entitySettings.entityId) {
      this.entitySettings = new EntitySettings();
      this.entitySettings.entityId = this.entityId;
    }
    if (!this.entitySettings.alertSlackUrls) {
      this.entitySettings.alertSlackUrls = [];
    }
  }

  // remove url
  removeUrl(url: string) {
    if (!this.entitySettings.alertSlackUrls) {
      return;
    }
    const index = this.entitySettings.alertSlackUrls.indexOf(url);
    if (index > -1) {
        this.entitySettings.alertSlackUrls.splice(index, 1);
    }
    this.saveUrls();
  }

  // open add url popup
  openAddUrlDialog(content: any) {
    this.editUrl = "";
    this.editIndex = -1;
    this.modalService.open(content, { windowClass: 'md-class', centered: true });
  }

  // set/save url
  setUrl() {
    if (!this.entitySettings.alertSlackUrls) {
      this.entitySettings.alertSlackUrls = [];
    }
    if (this.editIndex === -1) {
      this.entitySettings.alertSlackUrls.push(!!this.editUrl? this.editUrl: "");
    } else {
      this.entitySettings.alertSlackUrls.splice(this.editIndex, 1, !!this.editUrl? this.editUrl: "");
    }
    this.saveUrls();
  }    

  // save urls
  saveUrls() {
    if (!this.entitySettings.entityId || this.entitySettings.entityId.substring(0,1) === '0') {
      this.orgService.setOrgSlackUrls(this.entitySettings.entityId, this.entitySettings.alertSlackUrls)
      .subscribe(({data}) => {}, 
       (error) => {
        console.error('Slack url saving error', error);
        Swal.close();
        this.alertService.alertBox('Error while saving slack urls','Saving slack url','error');
       }
      );
    } else {
      this.entityService.setEntitySlackUrls(this.entitySettings.entityId, this.entitySettings.alertSlackUrls)
      .subscribe(({data}) => {}, 
       (error) => {
        console.error('Slack url saving error', error);
        Swal.close();
        this.alertService.alertBox('Error while saving slack urls','Saving slack url','error');
       }
      );
    } 
  }

  // validate url
  validateUrl() {
    if (!this.editUrl) {
      return false;
    }
    let regEx = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    return regEx.test(this.editUrl);
  }

  // open edit url popup
  openEditUrlDialog(content: any, url: string) {
    if (!this.entitySettings.alertSlackUrls) {
      this.entitySettings.alertSlackUrls = [];
    }
    this.editIndex = this.entitySettings.alertSlackUrls.indexOf(url);
    this.editUrl = url;
    this.modalService.open(content, { windowClass: 'md-class', centered: true });
  }
  
}
