import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollStateService {

    windowNoScrollStyleTag: any;

    constructor() {
        this.windowNoScrollStyleTag = (() => {
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

    disableWindowScroll() {
        document.body.appendChild(this.windowNoScrollStyleTag);
    }

    enableWindowScroll() {
        document.body.removeChild(this.windowNoScrollStyleTag);
    }
}
