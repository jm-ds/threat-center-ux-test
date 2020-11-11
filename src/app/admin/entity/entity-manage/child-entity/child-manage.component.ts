import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntityModel } from '../../entity.class';

@Component({
    selector: 'app-child-manage',
    templateUrl: './child-manage.component.html',
    styleUrls: ['./child-manage.component.scss']
})

export class ChildEntityManageComponent implements OnInit {

    @Input() entityData: EntityModel = new EntityModel();
    constructor(public activeModal: NgbActiveModal) {
    }
    ngOnInit(): void {
        if (!this.entityData.entityType)
            this.entityData.entityType = "";
    }


    saveRecord() {
        this.activeModal.close(this.entityData);
    }

}