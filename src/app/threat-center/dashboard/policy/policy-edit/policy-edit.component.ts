import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, Messages, Policy, PolicyAction, PolicyCondition, PolicyConditionGroup } from '@app/models';

import { MESSAGES } from '@app/messages/messages';

import { EntityService } from '@app/services/entity.service';
import { ProjectService } from '@app/services/project.service';
import { PolicyService } from '@app/services/policy.service';

import { ConditionBuilderComponent } from '../condition-builder/condition-builder.component';

@Component({
  selector: 'app-policy-edit',
  templateUrl: './policy-edit.component.html',
  styleUrls: ['./policy-edit.component.scss'],
  providers: [PolicyConditionGroup, Policy]
})
export class PolicyEditComponent implements OnInit {

    policy: Policy;
    newPolicy = true;
    messages: Messages;
    confirmed: Array<any>;
    source: Array<any>;
    display: any;
    entityId: string;
    projectId: string
    conditionTypeItems: any;
    conditionType: CodeNamePair;
    @ViewChild(ConditionBuilderComponent, {static: false}) conditions: ConditionBuilderComponent;
    activeTabIdString: string = "policyGeneralInfo";


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
    public saveDisabled: boolean = false;

    public actionCols = ['ActionType','ActionName'];


    constructor(
        private policyService: PolicyService,
        // private apiService: ApiService,
        private entityService:EntityService,
        private projectService:ProjectService,
        protected router: Router,
        private route: ActivatedRoute,
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.saveDisabled = false;
        this.policy = null;
        this.conditionTypeItems = this.policyService.getConditionTypeItems();
        const policyId = this.route.snapshot.paramMap.get('policyId');
        this.entityId = this.policyService.nullUUID(this.route.snapshot.paramMap.get('entityId'));
        this.projectId = this.policyService.nullUUID(this.route.snapshot.paramMap.get('projectId'));
        if (policyId !== null && policyId !== undefined) {
            this.newPolicy = false;
            this.policyService.getPolicy(this.entityId, this.projectId, policyId).subscribe(
                data => {
                    this.policy = data.data.policy;
                    if (this.policy) {
                        this.prepareConditionsAfterFetch(data.data.policy.conditions);
                    } else {
                        this.policy = undefined;
                        console.error("PolicyEditComponent", "Policy not found");
                    }
                    this.conditionType = { "code": this.policy.conditionType, "name": this.policyService.getConditionTypes()[this.policy.conditionType]};
                },
                error => {
                    this.policy = undefined;
                    console.error("PolicyEditComponent", error);
                }
            );
        } else {
            this.newPolicy = true;
            this.policy = new Policy();
            this.createRootGroup();
            this.policy.actions=[];
            this.policy.conditionType = "SECURITY";
            this.policy.entityId=this.entityId;
            this.policy.projectId=this.projectId;
            this.policy.applyToChilds = true;
            this.confirmed = [];
            if (!!this.entityId) {
                this.entityService.getEntity(this.entityId).subscribe(data=>{
                    this.policy.entity=data.data.entity;
                })
            }
            if (!!this.projectId) {
                this.projectService.getProject(this.projectId, "",  1).subscribe(data=>{
                    this.policy.project=data.data.project;
                })
            }
            this.conditionType = { "code": this.policy.conditionType, "name": this.policyService.getConditionTypes()[this.policy.conditionType]};
        }
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

    createRootGroup() {
        this.policy.conditions=new PolicyConditionGroup();
        this.policy.conditions.groupOperator = "AND";
        let mainGroup = new PolicyConditionGroup();
        mainGroup.groupOperator = "AND";
        let subordinateGroup = new PolicyConditionGroup();
        subordinateGroup.groupOperator = "OR";
        this.policy.conditions.groups.push(mainGroup);
        this.policy.conditions.groups.push(subordinateGroup);
    }

  savePolicy() {
    this.saveDisabled = true;

    this.prepareConditionsBeforeSave(this.policy.conditions);

    let messages: Message[] = this.validatePolicy();

    if (messages.length > 0) {
      this.messages = messages;
      this.saveDisabled = false;

      return;
    }

    this.policyService
      .savePolicy(this.policy)
      .subscribe(
        (data: any) => {
          let link = ['/dashboard/policy/show', data.data.createPolicy.policyId];

          if (this.entityId) {
            link.push(this.entityId);
          }

          if (this.projectId) {
            link.push(this.projectId);
          }

          this.saveDisabled = false;

          this.router.navigate(link, {
            state: {
              messages: [Message.success(MESSAGES.POLICY_SAVE_SUCCESS)]
            }
          });
        },
        (error: HttpErrorResponse) => {
          let message = '';

          this.saveDisabled = false;

          if (error.message) {
            const errorMessages = error.message.split(':');

            if (errorMessages.length > 0) {
              message = errorMessages[errorMessages.length - 1];
            }
          }

          this.messages = [Message.error(`${MESSAGES.POLICY_SAVE_ERROR} ${message}`)];
        });
  }


  /** Policy validation */
  validatePolicy(): Message[] {
    let resMessages: Message[] = [];

    if (!this.policy.name) {
      resMessages.push(Message.error(MESSAGES.POLICY_NAME_ERROR));
    }

    // if (!this.policy.title) {
    //     resMessages.push(Message.error("Policy title field is required."));
    // }

    resMessages = resMessages.concat(this.validateConditionsExists());

    if (!this.policy.actions || this.policy.actions.length === 0) {
      resMessages.push(Message.error(MESSAGES.POLICY_ACTIONS_ERROR));
    }
    return resMessages;
  }

  // validate conditions
  validateConditionsExists(): Message[] {
    if (this.policy.conditions.groups[0].conditions && this.policy.conditions.groups[0].conditions.length === 0) {
      return [Message.error(MESSAGES.CONDITION_GROUP_ERROR)];
    }

    let typeNotExists = false;
    let operatorNotExists = false;
    let valueNotExists = false;
    let conditions: PolicyCondition[] = [];

    conditions = this.policy.conditions.groups[0].conditions;

    if (!!this.policy.conditions.groups[1] && !!this.policy.conditions.groups[1].conditions
      && this.policy.conditions.groups[1].conditions.length > 0) {
      conditions = conditions.concat(this.policy.conditions.groups[1].conditions);
    }
    for (const cond of conditions) {
      if (!cond.conditionType) {
        typeNotExists = true;
      }

      if (!cond.operator) {
        operatorNotExists = true;
      }

      let value: string | number;

      switch (cond.conditionDataType) {
        case 'DCM':
          value = cond.decimalValue;

          break;

        case 'DBL':
          value = cond.doubleValue;

          break;

        case 'INT':
          value = cond.intValue;

          break;

        case 'SVR':
          value = cond.severityValue;

          break;

        default:
          value = cond.strValue;
      }

      if (!value) {
        valueNotExists = true;
      }
    }

    let result: Message[] = [];

    if (typeNotExists) {
      result.push(Message.error(MESSAGES.CONDITION_TYPE_ERROR));
    }

    if (operatorNotExists) {
      result.push(Message.error(MESSAGES.CONDITION_OPERATOR_ERROR));
    }

    if (valueNotExists) {
      result.push(Message.error(MESSAGES.CONDITION_VALUE_ERROR));
    }

    return result;
  }

    prepareConditionsBeforeSave(group: PolicyConditionGroup) {
        if (!group) {
            return;
        }
        if (group.conditions) {
            for (const condition of group.conditions) {
                if (condition.conditionType==='RELEASE_STAGE') {
                    condition.arrayValue = undefined;
                }
                if (condition.conditionType === 'PROJECT_TAG') {

                    if (!!condition.strInputValue) {
                        let tags=condition.strInputValue.split(",").map(item=>item.trim()).filter(item=>item.length>0);
                        if (!condition.strValue || condition.strValue.length === 0) {
                            condition.strValue = tags.join(",");
                        } else {
                            let conditionTags = condition.strValue.split(",");
                            tags.forEach(tag=>{
                                if (conditionTags.indexOf(tag)===-1) {
                                    conditionTags.push(tag);
                                }
                            });
                            condition.strValue = conditionTags.join(",");
                        }
                        condition.strInputValue = "";
                    }
                }
            }
        }
        if (group.groups) {
            for (const grp of group.groups) {
                this.prepareConditionsBeforeSave(grp);
            }
        }
    }

    prepareConditionsAfterFetch(group: PolicyConditionGroup) {
        if (!group) {
            return;
        }
        if (group.conditions) {
            for (const condition of group.conditions) {
                if (condition.conditionType==='RELEASE_STAGE') {
                    condition.arrayValue = !!condition.strValue ? condition.strValue.split(","): [];
                }
            }
        }
        if (group.groups) {
            for (const grp of group.groups) {
                this.prepareConditionsAfterFetch(grp);
            }
        }
    }

    addAction() {
        if (!this.policy.actions) {
            this.policy.actions = [];
        }
        const action = new PolicyAction();
        // give default values
        action.actionType='ALERT';
        action.actionName='EMAIL';
        this.policy.actions.push(action)
    }

    onActionTypeChange(action: PolicyAction, event: any,index) {
        if (!action.actionType) {
            // action.actionName=undefined;
            this.policy.actions[index].actionName = undefined;
        } else {
            // action.actionName=this.actionNames[action.actionType][0].value;
            this.policy.actions[index].actionName = this.actionNames[action.actionType][0].value;
        }
    }

    removeAction(action: PolicyAction) {
        if (!this.policy.actions) {
            return;
        }
        const index = this.policy.actions.indexOf(action);
        if (index > -1) {
            this.policy.actions.splice(index, 1);
        }
    }

    onTypeChange(event: any) {
        if (this.policy.conditions) {
            if (this.policy.conditions.groups && this.policy.conditions.groups.length>0) {
                const conditionType = this.getConditionTypeFromGroup(this.policy.conditions.groups[0]);
                if (conditionType && conditionType!=event) {
                    let mainGroup = new PolicyConditionGroup();
                    mainGroup.groupOperator = "AND";
                    this.policy.conditions.groups[0] = mainGroup;
                }
                this.conditionType = { "code": this.policy.conditionType, "name": this.policyService.getConditionTypes()[this.policy.conditionType]};
            }
        }
    }

    getConditionTypeFromGroup(group: PolicyConditionGroup) {
        if (group.conditions && group.conditions.length>0) {
            return group.conditions[0].conditionType;
        }
        if (group.groups && group.groups.length>0) {
            group.groups.forEach(grp => {
                let conditionType = this.getConditionTypeFromGroup(grp);
                if (conditionType) {
                    return conditionType;
                }
            });
        }
        return undefined;
    }

    gotoTab(tabId: string) {
        this.activeTabIdString = tabId;
    }
}

class CodeNamePair {
    code: string;
    name: string;
  }
