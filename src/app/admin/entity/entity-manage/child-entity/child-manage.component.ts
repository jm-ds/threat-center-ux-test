import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EntityModel } from '../../entity.class';

@Component({
    selector: 'app-child-manage',
    templateUrl: './child-manage.component.html'
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