import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "@app/security/services";
import { Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class CoreHelperService {
    private subject = new Subject();
    private unAuthorizeSubject = new Subject<any>();
    isBrowserBackclick: boolean = false;
    constructor(private authenticationService: AuthenticationService, private router: Router) { }


    isUnAuthorize(val: boolean = false) {
        this.unAuthorizeSubject.next(val)
    }

    getUnAuthorizeVal() {
        return this.unAuthorizeSubject.asObservable();
    }

     spinnerEdit(isSpeenerVisible) {
        this.subject.next(isSpeenerVisible);
    }

    getSpinner() {
        return this.subject.asObservable();
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    logoutUser() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    removeNextDarkClassFormBody() {
        document.querySelector('body').classList.remove('next-dark');
    }


    setBrowserBackButton(isBack) {
        this.isBrowserBackclick = isBack;
    }

    getBrowserBackButton() {
        return this.isBrowserBackclick;
    }

    getDifferencebetweenStrings(a: string, b: string) {
        var i = 0;
        var j = 0;
        var result = "";

        while (j < b.length) {
            if (a[i] != b[j] || i == a.length)
                result += b[j];
            else
                i++;
            j++;
        }
        return result;
    }

    setFocusOnElement(elementId: string) {
        if (!!elementId && elementId !== '') {
            setTimeout(() => {
                document.getElementById(elementId).focus();
            }, 0);
        }
    }
}


export class LogOutStaticHelper {
    static coreSer: CoreHelperService;
    static logoutUser(coreHelperService: CoreHelperService) {
        coreHelperService.logoutUser();
    }
}
