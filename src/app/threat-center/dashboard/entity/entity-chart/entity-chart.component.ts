import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from "@angular/core";


@Component({
    selector: 'entity-donut-chart',
    templateUrl: './entity-chart.component.html',
    styleUrls: ['../entity.component.scss']
})

export class EntityChartcomponent implements OnInit, AfterViewInit {

    @Output() changeDropdownValue = new EventEmitter();
    @Input() chartlabel: string = '';
    @Input() chartId: string = '';
    @Input() chartConfig: string = '';
    @Input() dropdownValues = new Array();
    @Input() nameSelection: string = "";
    @Input() selecteddropdownValue: string = "";
    @Input() supplyChainChart: any = null;
    
    selectedValue: string = '';
    constructor() { }
    ngAfterViewInit(): void {
        this.selectedValue = this.selecteddropdownValue;
    }
    ngOnInit(): void {

    }

    onChangedropdownValue() {
        this.changeDropdownValue.emit({ dropdown: this.nameSelection, selectedValue: this.selectedValue });
    }
}