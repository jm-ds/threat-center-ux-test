import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {AuthorizationService} from "@app/security/services";

@Directive({
    selector: '[removeIfUnauthorized]'
})
export class RemoveIfUnauthorizedDirective implements OnInit {


    @Input('removeIfUnauthorized') permissions: string | string[];

    constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
    }

    ngOnInit() {
        if (!this.authorizationService.hasPermissions(this.permissions)) {
            this.el.nativeElement.remove();
        }
    }
}
