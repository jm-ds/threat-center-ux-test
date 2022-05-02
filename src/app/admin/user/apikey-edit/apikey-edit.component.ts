import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FetchResult } from 'apollo-link';
import { ApiKey, Message, Messages, User } from '@app/models';

import { MESSAGES } from '@app/messages/messages';

import { UserUtils } from '../user-utils';

import { OrgService } from '@app/services/org.service';
import { UserService } from '@app/services/user.service';


@Component({
    selector: 'app-api-key-edit',
    templateUrl: './apikey-edit.component.html',
    styleUrls: ['./apikey-edit.component.scss']
})
export class ApiKeyEditComponent extends UserUtils implements OnInit {

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
        private orgService: OrgService
    ) {
        super(router);
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.keyId = this.route.snapshot.paramMap.get('keyid');
        this.username = this.route.snapshot.paramMap.get('username');
        this.isUserKey = !!this.username
        if (this.isUserKey) {
            let userData = this.userService.getUser(this.username).subscribe(
                data => {
                    this.user = data.data.user;
                },
                error => {
                    console.error("ApiKeyEditComponent", error);
                }
            );
        }
        if (this.keyId === 'new') {
            this.apiKey = new ApiKey();
            this.apiKey.username = this.username;
        } else {
            let getApiKeyObservable=undefined;
            if (this.isUserKey) { //user key
                getApiKeyObservable = this.userService.getApiKey(this.username, this.keyId);
            } else { // org key
                getApiKeyObservable = this.orgService.getOrgApiKey(this.keyId);
            }
            getApiKeyObservable.subscribe(
                data => {
                    this.apiKey = data.data.apiKey;
                    if (!this.apiKey) {
                        this.apiKey = undefined;
                        console.error("ApiKeyEditComponent", "API key is not found");
                    }
                },
                error => {
                    this.apiKey = undefined;
                    console.error("ApiKeyEditComponent", error);
                }
            );
        }
    }

  saveApiKey() {
    let messages: Message[] = this.validateApiKey();

    if (messages.length > 0) {
      this.messages = messages;

      return;
    }

    if (this.keyId === 'new') {
      let generateApiKeyObservable: Observable<FetchResult>;
      let successLink: string;
      if (!!this.apiKey.expiredDate) {
          //workaround to convert date from date picker to right graphql date format
          const value = this.apiKey.expiredDate;
          this.apiKey.expiredDate = new Date();
          this.apiKey.expiredDate.setFullYear(value['year'], value['month'] - 1, value['day']);
      }
      if (this.isUserKey) { // user key
        generateApiKeyObservable = this.userService.generateApiKey(this.apiKey);
        successLink = `/admin/show/${this.username}/show/apikey/`;
      } else { // org key
        generateApiKeyObservable = this.orgService.generateOrgApiKey(this.apiKey);
        successLink = '/dashboard/org-setting/integration/org-apikeys/show/apikey/';
      }

      generateApiKeyObservable.subscribe(
        (data: any) => {
          if (!!data && !!data.data) {
            const link = [successLink, data.data.generateApiKey.keyId];

            this.router.navigate(link, {
              state: {
                messages: [Message.success(MESSAGES.API_KEY_GENERATE_SUCCESS)]
              }
            });
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API key generating', error);

          this.messages = [Message.error(MESSAGES.API_KEY_GENERATE_ERROR)];
        });
    } else {
      let updateApiKeyObservable: Observable<FetchResult>;
      let successLink: string;

      if (this.isUserKey) {  // user key
        updateApiKeyObservable = this.userService.updateApiKey(this.apiKey);
        successLink = `/admin/show/${this.username}/show/apikey/`;
      } else { // org key
        updateApiKeyObservable = this.orgService.updateOrgApiKey(this.apiKey);
        successLink = '/dashboard/org-setting/integration/org-apikeys/show/apikey/';
      }

      updateApiKeyObservable.subscribe(
        (data: any) => {
          if (!!data && !!data.data) {
            const link = [successLink, data.data.updateApiKey.keyId];

            this.router.navigate(link, {
              state: {
                messages: [Message.success(MESSAGES.API_KEY_SAVE_SUCCESS)]
              }
            });
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API key saving', error);

          this.messages = [Message.error(MESSAGES.API_KEY_SAVE_ERROR)];
        });
    }
  }

    // validate API key
    validateApiKey(): Message[] {
        let resMessages: Message[] = [];
        if (!this.apiKey.title) {
            resMessages.push(Message.error(MESSAGES.API_KEY_ERROR));
        }
        return resMessages;
    }

  /** Navigate to organization settings */
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
