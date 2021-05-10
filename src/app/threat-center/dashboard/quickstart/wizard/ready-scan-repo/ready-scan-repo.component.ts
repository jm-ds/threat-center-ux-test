import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";

@Component({
    selector: 'ready-scan-repo',
    templateUrl: './ready-scan-repo.component.html'
})

export class ReadyScanRepositorylistComponent implements OnInit {
    @Input() tabColumns: Array<{}>;
    @Input() values = new Array();
    @Input() ispaginator: boolean = false;
    @Input() rows: number = 50;

    @Output() branchChange: EventEmitter<any> = new EventEmitter();

    public selectedItem: string = '';


    constructor() { }

    ngOnInit(): void {
    }

    changeBranch(newValue) {
        this.branchChange.emit(newValue);
    }
}