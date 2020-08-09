import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthorizationService } from './services/authorization.service';

@Directive({
    selector: '[hideIfUnauthorized]'
})
export class HideIfUnauthorizedDirective implements OnInit {

    @Input('hideIfUnauthorized') permission: string;

    constructor(private el: ElementRef,private authorizationService: AuthorizationService) { }

    ngOnInit() {
        console.log("Directive Permission: ",this.permission);
        if(!this.authorizationService.has(this.permission)) {
            this.el.nativeElement.style.display = 'none';
        }
    }
}
