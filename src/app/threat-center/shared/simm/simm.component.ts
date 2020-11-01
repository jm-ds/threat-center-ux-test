import {Component, ElementRef, HostListener, Input, OnChanges, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ScanAsset, ScanAssetQuery, SimmMatch} from "@app/threat-center/shared/models/types";
import gql from "graphql-tag";
import {SimmService} from "@app/threat-center/shared/simm/simm.service";

@Component({
    selector: 'app-simm',
    templateUrl: './simm.component.html',
    styleUrls: ['./simm.component.scss']
})
export class SimmComponent implements OnChanges {

    @Input() sourceAsset: ScanAsset;
    @Input() matchAsset: ScanAsset;
    @Input() stateOpen = true;

    matches: SimmMatch[];
    currentMatchIndex = -1;

    sourceLineHighlights = "10-15,25-30";
    matchLineHighlights = "10-15,25-30";
    sourceLineCount = 0;
    matchLineCount = 0;

    private styleTag: HTMLStyleElement;


    @ViewChildren('sourceScroll', {read: ElementRef}) sourceScroll: QueryList<ElementRef>;
    @ViewChildren('matchScroll', {read: ElementRef}) matchScroll: QueryList<ElementRef>;


    constructor(private simmService: SimmService) {
        this.styleTag = (() => {
            let style = document.createElement("style");
            style.type = "text/css";
            style.setAttribute("data-debug", "Injected by WindowScrolling service.");
            style.textContent = `
                body {
                    overflow: hidden !important ;
                }
            `;
            return (style);
        })();
    }

    ngOnChanges() {
        if (this.matchAsset && this.sourceAsset) {
            this.simmService.compare(this.sourceAsset.content, this.matchAsset.content).subscribe(
                data => {
                    this.matches = data.data.simmCompare;
                    this.currentMatchIndex = -1;
                    this.updateHighlights();
                    this.countLines();
                },
                error => {
                    console.error("SimmComponent", error);
                }
            );
        }
    }

    updateHighlights() {
        this.sourceLineHighlights = "";
        this.matchLineHighlights = "";
        for (const match of this.matches) {
            if (this.sourceLineHighlights.length > 0) {
                this.sourceLineHighlights += ",";
                this.matchLineHighlights += ",";
            }
            this.sourceLineHighlights += match.leftStart + "-" + match.leftEnd;
            this.matchLineHighlights += match.rightStart + "-" + match.rightEnd;
        }
    }

    countLines() {
        const regex = /\n/g;
        this.sourceLineCount = ((this.sourceAsset.content || '').match(regex) || []).length;
        this.matchLineCount  = ((this.matchAsset.content  || '').match(regex) || []).length;

        if (this.sourceLineCount > 0) {
            this.sourceLineCount++;
        }
        else if (this.sourceAsset.content !== undefined && this.sourceAsset.content !== '') {
            this.sourceLineCount = 1;
        }
        /*if (this.matchLineCount > 0) {
            this.matchLineCount++;
        }
        else if (this.matchAsset.content !== undefined && this.matchAsset.content !== '') {
            this.matchLineCount = 1;
        }*/
    }



    @HostListener('window:keydown', ['$event'])
    KeyDown(event: KeyboardEvent) {
        if (event.keyCode === 27) {
            this.close();
            event.stopPropagation();
            event.preventDefault();
        }
    }

    open() {
        this.stateOpen = true;
        document.body.appendChild(this.styleTag);
    }

    close() {
        this.stateOpen = false;
        document.body.removeChild(this.styleTag);
    }

    nextMatch() {
        this.currentMatchIndex++;
        if (this.currentMatchIndex >= this.matches.length) {
            this.currentMatchIndex = this.matches.length - 1;
        }
        this.scroll();
    }

    prevMatch() {
        this.currentMatchIndex--;
        if (this.currentMatchIndex < 0) {
            this.currentMatchIndex = 0;
        }
        this.scroll();
    }

    scroll() {
        this.scrollSide(this.sourceScroll.first.nativeElement, 'left');
        this.scrollSide(this.matchScroll.first.nativeElement, 'right');
    }

    scrollSide(element, side) {
        const md = element.children[0];
        const eH = element.offsetHeight;
        const height = md.offsetHeight - 28;
        const match = this.matches[this.currentMatchIndex];
        const k = (side === 'left' ? match.leftStart / this.sourceLineCount : match.rightStart / this.matchLineCount);
        const lh = height / (side === 'left' ? this.sourceLineCount : this.matchLineCount);
        const scrollTo = (height /*- eH*/ /*- 60*/) * k + 14 - lh;
        element.scroll(0, scrollTo);
    }
}
