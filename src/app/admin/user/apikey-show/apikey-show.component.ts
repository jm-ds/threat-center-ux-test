import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { FetchResult } from 'apollo-link';
import { ApiKey, Message, Messages, User } from '@app/models';

import { MESSAGES } from '@app/messages/messages';

import { UserUtils } from '../user-utils';

import { AlertService } from '@app/services/core/alert.service';
import { OrgService } from '@app/services/org.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-api-key',
    templateUrl: './apikey-show.component.html',
    styleUrls: ['./apikey-show.component.scss']
})
export class ApiKeyShowComponent extends UserUtils implements OnInit {

    messages: Messages;
    keyId: string;
    username: string;
    apiKey: ApiKey;
    user: User;
    isUserKey: boolean = true;


    constructor(
        private userService: UserService,
        protected router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private orgService: OrgService
    ) {
        super(router);
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.keyId = this.route.snapshot.paramMap.get('keyid');
        this.username = this.route.snapshot.paramMap.get('username');
        this.isUserKey = !!this.username
        let getApiKeyObservable = undefined;
        if (this.isUserKey) { // user key
            this.userService.getUser(this.username).subscribe(
                data => {
                    this.user = data.data.user;
                },
                error => {
                    console.error("ApiKeyShowComponent", error);
                }
            );
            getApiKeyObservable = this.userService.getApiKey(this.username, this.keyId);
        } else { // org key
            getApiKeyObservable = this.orgService.getOrgApiKey(this.keyId);
        }
        getApiKeyObservable.subscribe(
            data => {
                this.apiKey = data.data.apiKey;
                if (!this.apiKey) {
                    this.apiKey = undefined;
                    console.error("ApiKeyShowComponent", "API key is not found");
                }
            },
            error => {
                this.apiKey = undefined;
                console.error("ApiKeyShowComponent", error);
            }
        );
    }


  /** Remove API key */
  removeApiKey() {
    if (confirm(MESSAGES.API_KEY_REMOVE_CONFIRM)) {
      let removeApiKeyObservable: Observable<FetchResult>;
      let successLink: string;

      if (this.isUserKey) { // user key
        removeApiKeyObservable = this.userService.removeApiKey(this.apiKey);
      } else { // org key
        removeApiKeyObservable = this.orgService.removeOrgApiKey(this.apiKey);
        successLink = '/dashboard/org-setting/integration/org-apikeys';
      }

      removeApiKeyObservable.subscribe(
        () => {
          if (this.isUserKey) {
            const navigationExtras: NavigationExtras = {
              state: {
                messages: [Message.success(MESSAGES.API_KEY_REMOVE_SUCCESS)]
              },
              queryParams: {
                userName: this.username
              }
            };

            this.router.navigate(['/admin/user/show'], navigationExtras);
          } else {
            this.router.navigate([successLink], {
              state: {
                messages: [Message.success(MESSAGES.API_KEY_REMOVE_SUCCESS)]
              }
            });
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API key Removing', error);

          this.messages = [Message.error(MESSAGES.API_KEY_REMOVE_ERROR)];
        }
      );
    }
  }


    // Copy API key to clipboard
    copyKey() {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = this.apiKey.apiKey;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        this.alertService.alertBox('API key copied to clipboard!', 'API key!', 'success');
    }

    // navigate to organization settings
    goToOrgSettings() {
        this.router.navigateByUrl('dashboard/org-setting/integration/org-apikeys');
    }

    gotoUser() {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                "userName": this.username
            }
        };
        this.router.navigate(['/admin/user/show'], navigationExtras);
    }
}
