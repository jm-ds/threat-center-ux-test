import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'project-chart',
    templateUrl: './project-chart.component.html',
    styleUrls: ['../project.component.scss']
})

export class ProjectChartComponent implements OnInit {

    @Input() chartLabel: string = '';
    @Input() chartArray = new Array();
    @Input() chartId: string = '';
    @Input() chartconfig: any;
    @Input() iconClass:string = '';

    constructor() { }
    ngOnInit(): void {

    }

    getAdditionData(data) {
        if (!!data && data.length >= 1) {
            const i = data.length - 1;
            return !!data[i] ? data[i] : 0;
            // return data[0];
            // return data.reduce((prev, next) => prev + (+next), 0);
        } else {
            return 0;
        }
    }

    getStyle(item){
        let style ={};
        style['width'] = this.getAdditionData(item.data).toString().length >= 1 && this.getAdditionData(item.data).toString().length <= 4 ? '18px' : '30px';
        style['margin'] = this.getAdditionData(item.data).toString().length >= 1 && this.getAdditionData(item.data).toString().length <= 4 ? '0 7px 10px 0' : '0 12px 10px 0';
        return style;
    }


}