import {Directive, ElementRef, OnInit, Input} from '@angular/core';
import {AuthorizationService} from './services/authorization.service';

@Directive({
    selector: '[hideIfUnauthorized]'
})
export class HideIfUnauthorizedDirective implements OnInit {

    @Input('hideIfUnauthorized') permissions: string | string[];

    constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
    }

    ngOnInit() {
        if (!this.authorizationService.hasPermissions(this.permissions)) {
            this.el.nativeElement.style.display = 'none';
        }
    }
}
