import { Component, Injectable, Input, OnInit } from '@angular/core';
import { AlertService } from '@app/services/core/services/alert.service';
import { CoreHelperService } from '@app/services/core/services/core-helper.service';
import { EntitySettings } from '@app/models/entity';
import { EntityManageService } from '@app/services/entity-manage.service';
import { OrgService } from '@app/services/org.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
    selector: 'alert-emails',
    templateUrl: './alert-emails.component.html',
    styleUrls: ['./alert-emails.component.scss']
})
export class AlertEmailsComponent implements OnInit {
  @Input() public entitySettings: EntitySettings;
  @Input() public entityId: string;
  public columns = ['Email'];

  public editEmail: string;
  private editIndex: number;

  constructor(
    private modalService: NgbModal,
    private orgService: OrgService,
    private entityService: EntityManageService,
    private coreHelperService:CoreHelperService,
    private alertService:AlertService
  ) {
  }

  ngOnInit() {
    if (!this.entitySettings || !this.entitySettings.entityId) {
      this.entitySettings = new EntitySettings();
      this.entitySettings.entityId = this.entityId;
    }
    if (!this.entitySettings.alertEmailAdressess) {
      this.entitySettings.alertEmailAdressess = [];
    }
  }

  // remove email
  removeEmail(email: string) {
    if (!this.entitySettings.alertEmailAdressess) {
      return;
    }
    const index = this.entitySettings.alertEmailAdressess.indexOf(email);
    if (index > -1) {
        this.entitySettings.alertEmailAdressess.splice(index, 1);
    }
    this.saveEmails();
  }

  // open add email popup
  openAddEmailDialog(content: any) {
    this.editEmail = "";
    this.editIndex = -1;
    this.modalService.open(content, { windowClass: 'md-class', centered: true });
  }

  // set/save email
  setEmail() {
    if (!this.entitySettings.alertEmailAdressess) {
      this.entitySettings.alertEmailAdressess = [];
    }
    if (this.editIndex === -1) {
      this.entitySettings.alertEmailAdressess.push(!!this.editEmail? this.editEmail: "");
    } else {
      this.entitySettings.alertEmailAdressess.splice(this.editIndex, 1, !!this.editEmail? this.editEmail: "");
    }
    this.saveEmails();
  }    

  // save emails
  saveEmails() {
    if (!this.entitySettings.entityId || this.entitySettings.entityId.substring(0,1) === '0') {
      this.orgService.setOrgEmails(this.entitySettings.entityId, this.entitySettings.alertEmailAdressess)            
      .subscribe(({data}) => {}, 
       (error) => {
        console.error('Alert email saving error', error);
        Swal.close();
        this.alertService.alertBox('Error while saving emails','Saving alert emails','error');
       }
      );
    } else {
      this.entityService.setEntityEmails(this.entitySettings.entityId, this.entitySettings.alertEmailAdressess)            
      .subscribe(({data}) => {}, 
       (error) => {
        console.error('Alert email saving error', error);
        Swal.close();
        this.alertService.alertBox('Error while saving emails','Saving alert emails','error');
       }
      );
    }
  }

  // validate email
  validateEmail() {
    if (!this.editEmail) {
      return false;
    }
    let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(this.editEmail);
  }

  // open edit email popup
  openEditEmailDialog(content: any, email: string) {
    if (!this.entitySettings.alertEmailAdressess) {
      this.entitySettings.alertEmailAdressess = [];
    }
    this.editIndex = this.entitySettings.alertEmailAdressess.indexOf(email);
    this.editEmail = email;
    this.modalService.open(content, { windowClass: 'md-class', centered: true });
  }
  
}
