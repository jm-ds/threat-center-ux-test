import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Table } from 'primeng';

import { Message, Messages, Policy, PolicyConditionGroup } from '@app/models';

import { MESSAGES } from '@app/messages/messages';

import { PolicyService } from '@app/services/policy.service';

@Component({
    selector: 'app-policy-view',
    templateUrl: './policy-show.component.html',
    styleUrls: ['./policy-show.component.scss'],
    providers: [PolicyConditionGroup, Policy]
})
export class PolicyShowComponent implements OnInit {

    policy: Policy;
    messages: Messages;
    entityId: string;
    projectId: string
    conditionTypes: any;
    activeTabIdString: string = "policyGeneralInfo";
    conditionTypeTitle: string;


    public actionCols = ['ActionType','ActionName'];
    public actionTypes = [{label: 'Alert', value: 'ALERT'},{label: 'Issue', value: 'ISSUE'},{label: 'Gate Release', value: 'RELEASE'},
       {label: 'Attribute Source', value: 'ATTRIBUTION'}, {label: 'Upgrade library version', value: 'UPGRADE_VERSION'}];
    public actionNames = {
        'ALERT': [{label: 'Slack', value: 'SLACK'},{label: 'E-mail', value: 'EMAIL'}],//,{label: 'Dashboard', value:'DASHBOARD'}
        'ISSUE' : [{label: 'Jira', value: 'JIRA'},{label: 'Github', value:'GITHUB'}],
        'RELEASE': [{label: 'No', value:'NO'},{label: 'Yes', value:'PROD'}],
        'ATTRIBUTION': [{label: 'Attribute Source', value:'ATTRIBUTION'}],
        'UPGRADE_VERSION': [{label: 'Latest Secured Version', value:'LAST_VERSION'},{label: 'Next Secured Version', value:'NEXT_VERSION'}]
    };
    public actionTypeMap={};
    public actionNameMap={};

    @ViewChild(Table) private table: Table;

    constructor(
        private policyService: PolicyService,
        protected router: Router,
        private route: ActivatedRoute,
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.policy = null;
        this.conditionTypes = this.policyService.getConditionTypes();
        const policyId = this.route.snapshot.paramMap.get('policyId');
        this.entityId = this.policyService.nullUUID(this.route.snapshot.paramMap.get('entityId'));
        this.projectId = this.policyService.nullUUID(this.route.snapshot.paramMap.get('projectId'));
        this.policyService.getPolicy(this.entityId, this.projectId, policyId).subscribe(
            data => {
                this.policy = data.data.policy;
                if (this.policy) {
                    this.prepareConditionsAfterFetch(data.data.policy.conditions, this.policy);
                    this.conditionTypeTitle = this.policyService.getConditionTypes()[this.policy.conditionType];
                } else {
                    this.policy = undefined;
                    this.conditionTypeTitle = undefined;
                    console.error("PolicyShowComponent", "Policy not found");
                }
            },
            error => {
                this.policy = undefined;
                console.error("PolicyShowComponent", error);
            }
        );
        this.fillActionMaps();
    }

    fillActionMaps() {
        this.actionTypes.forEach(obj => {
            this.actionTypeMap[obj.value] = obj.label;
        });
        for (const tp in this.actionNames) {
            this.actionNameMap[tp] = {};
            this.actionNames[tp].forEach(obj => {
                this.actionNameMap[tp][obj.value] = obj.label;
            });

        }
    }

    prepareConditionsAfterFetch(group: PolicyConditionGroup, policy: Policy) {
        if (!group) {
            return;
        }
        if (group.conditions) {
            for (const condition of group.conditions) {
                if (condition.conditionType==='RELEASE_STAGE') {
                    condition.arrayValue = !!condition.strValue ? condition.strValue.split(","): [];
                }
            }
            if (group.groups && group.groups.length>0) {
                for (const condition of group.groups[0].conditions) {
                    condition.conditionType = policy.conditionType;
                }

            }
        }
        if (group.groups) {
            for (const grp of group.groups) {
                this.prepareConditionsAfterFetch(grp, policy);
            }
        }
    }

  removePolicy() {
    if (confirm(MESSAGES.POLICY_REMOVE_CONFIRM)) {
      this.preparePolicyBeforeSend(this.policy.conditions);

      this.policyService
        .removePolicy(this.policy)
        .subscribe(
          () => {
            let link = ['/dashboard/policy/list'];

            if (this.entityId) {
              link.push(this.entityId);
            }

            if (this.projectId) {
              link.push(this.projectId);
            }

            this.router.navigate(link, {
              state: {
                messages: [Message.success(MESSAGES.POLICY_REMOVE_SUCCESS)]
              }
            });
          },
          error => {
            let link = ['/dashboard/policy/show', this.policy.policyId];

            if (this.entityId) {
              link.push(this.entityId);
            }

            if (this.projectId) {
              link.push(this.projectId);
            }

            let message = '';

            if (error.message) {
              const errorMessages = error.message.split(':');

              if (errorMessages.length > 0) {
                message = errorMessages[errorMessages.length - 1];
              }
            }

            this.router.navigate(link, {
              state: {
                messages: [Message.error(`${MESSAGES.POLICY_REMOVE_ERROR} ${message}`)]
              }
            });
          });
    }
  }

    preparePolicyBeforeSend(group: PolicyConditionGroup) {
        if (!group) {
            return;
        }
        if (group.conditions) {
            for (const condition of group.conditions) {
                if (condition.conditionType==='RELEASE_STAGE') {
                    condition.arrayValue = undefined;
                }
            }
        }
        if (group.groups) {
            for (const grp of group.groups) {
                this.preparePolicyBeforeSend(grp);
            }
        }
    }

  /** Enable/disable policy */
  enablePolicy() {
    let confirmText = MESSAGES.POLICY_DISABLE_CONFIRM;

    if (!this.policy.active) {
      confirmText = MESSAGES.POLICY_ENABLE_CONFIRM;
    }

    if (confirm(confirmText)) {
      let policy = Object.assign({}, this.policy);

      policy.active = !policy.active;

      this.preparePolicyBeforeSend(this.policy.conditions);

      this.policyService
        .enablePolicy(policy)
        .subscribe(
          () => {
            let link = ['/dashboard/policy/list'];

            if (this.entityId) {
              link.push(this.entityId);
            }

            if (this.projectId) {
              link.push(this.projectId);
            }

            this.router.navigate(link, {
              state: {
                messages: [Message.success(MESSAGES.POLICY_UPDATE_SUCCESS)]
              }
            });
          },
          error => {
            console.error('Policy state change', error);

            let link = ['/dashboard/policy/show', this.policy.policyId];

            if (this.entityId) {
              link.push(this.entityId);
            }

            if (this.projectId) {
              link.push(this.projectId);
            }

            let message = '';

            if (error.message) {
              const errorMessages = error.message.split(':');

              if (errorMessages.length > 0) {
                message = errorMessages[errorMessages.length - 1];
              }
            }

            this.router.navigate(link, {
              state: {
                messages: [Message.error(`${MESSAGES.POLICY_UPDATE_ERROR} ${message}`)]
              }
            });
          });
    }
  }

  /**
   * Filter table
   *
   * @param event input event
   */
   onFilterInput(event: Event) {
    const { value } = event.target as HTMLInputElement;

    this.table.filterGlobal(value, 'contains');
  }

    gotoTab(tabId: string) {
        this.activeTabIdString = tabId;
    }
}
