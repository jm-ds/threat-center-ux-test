import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { AuthorizationService } from '@app/security/services';

@Component({
    selector: 'repo-list',
    templateUrl: './repo-list.component.html',
    styleUrls: ['./repo-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RepositoryListComponent implements OnInit {
    @Input() tabColumns: Array<{}>;
    @Input() values = new Array();
    @Input() ispaginator: boolean = false;
    @Input() rows: number = 50;
    @Input() selectionMode: string = 'single';
    @Input() filterDelay = 0;
    @Input() globalFilterFields = new Array();
    @Input() isLanguage:boolean = true;

    @Output() rowSelect: EventEmitter<any> = new EventEmitter();
    @Output() rowUnSelect: EventEmitter<any> = new EventEmitter();

    @ViewChild('dt') dataTable: any;

    selectedRepos: any[] = [];
    get dataTableRef() {
        return this.dataTable;
    }

    get selectedRepository() {
        return this.selectedRepos;
    }

    constructor(protected authorizationService: AuthorizationService) { }
    ngOnInit(): void {
    }

    //On selecting Row Event
    onRowSelect(event) {
        this.rowSelect.emit(event);
    }

    //On Unselecting Row Event
    onRowUnselect(event) {
        this.selectedRepos = [];
        this.rowUnSelect.emit(event);
    }

    //Un select Row if selected other grid row
    deSelection() {
        this.selectedRepos = [];
    }

    getIfDuplicate(name:string){
        return this.values.filter(val => { return val.node.name === name }).length >= 2;
    }

    getIfDuplicateIn(name){
        return this.values.filter(val => { return val.name === name }).length >= 2;
    }

    getName(str:string){
        return str.split("/")[1].split("/")[0]
    }
}
