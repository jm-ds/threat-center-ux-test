import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthorizationService } from './services/authorization.service';

@Directive({
    selector: '[disableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {

    @Input('disableIfUnauthorized') permission: string;

    constructor(private el: ElementRef,private authorizationService: AuthorizationService) { }

    ngOnInit() {
        console.log("Directive Permission: ",this.permission);
        if(!this.authorizationService.has(this.permission)) {
            this.el.nativeElement.disabled = true;
        }
    }
}
