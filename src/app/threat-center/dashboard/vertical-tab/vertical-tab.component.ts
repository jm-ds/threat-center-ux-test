import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-vertical-tab',
    templateUrl: './vertical-tab.component.html',
    styleUrls: ['./vertical-tab.component.scss']
})
export class VerticalTabComponent implements OnInit {

    @Input() tabList = [];
    @Output() tabActiveId: EventEmitter<string> = new EventEmitter();

    constructor(
    ) {
    }

    ngOnInit() {
    }

    clickOnTab(tabId: string) {
        this.tabList.forEach(tab => {
            if (tab.tabId == tabId) {
                tab.isActive = true;
            } else {
                tab.isActive = false;
            }
        });
        this.tabActiveId.emit(tabId);
    }

}