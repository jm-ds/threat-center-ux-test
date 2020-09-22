import {Directive, ElementRef, OnInit, Input} from '@angular/core';
import {AuthorizationService} from './services/authorization.service';

@Directive({
    selector: '[disableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {

    @Input('disableIfUnauthorized') permissions: string | string[];

    constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
    }

    ngOnInit() {
        if (!this.authorizationService.hasPermissions(this.permissions)) {
            this.el.nativeElement.disabled = true;
            this.el.nativeElement.classList.add("disabled");
        }
    }
}
