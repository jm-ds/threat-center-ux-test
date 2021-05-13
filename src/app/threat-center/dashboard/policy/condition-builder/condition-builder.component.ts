import {Component, Injectable, Input, OnInit} from '@angular/core';
import { Policy, PolicyCondition, PolicyConditionGroup } from '@app/models';
import { NavItemComponent } from '@app/theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import {MatChipInputEvent} from '@angular/material/chips';

@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'condition-builder',
    templateUrl: './condition-builder.component.html',
    styleUrls: ['./condition-builder.component.scss']
})
export class ConditionBuilderComponent implements OnInit {
    @Input() public group: PolicyConditionGroup;
    @Input() public parentGroup: PolicyConditionGroup;
    @Input() public policy: Policy;
    @Input() public readonly: Boolean;

    securityOperators: CodeNamePair[];
    securitySeverityValues: CodeNamePair[];
    securityCVSS3ScoreValues: NumCodeNamePair[]
    legalOperators: CodeNamePair[];
    legalFoundInValues: CodeNamePair[];
    componentOperators: CodeNamePair[];
    codeQualityOperators: CodeNamePair[];
    workflowReleasePhases: CodeNamePair[];
    subordinateConditionListItems: SubordinateConditionListItem[];

    operators: Map<String, CodeNamePair[]>;
    conditionNames: Map<String, Map<String,ConditionMetadata>>;

    conditionTypeItems: CodeNamePair[];

    categories: ConditionCategories;

    conditionTypes: object;

    

    constructor(group: PolicyConditionGroup, parentGroup: PolicyConditionGroup, policy: Policy){
        this.group = group;
        this.parentGroup = parentGroup;
        this.policy = policy;
    }


    ngOnInit() {
        this.fillConditionNames();
        this.subordinateConditionListItems = this.getSubordinateConditionTypeNames()

        this.conditionTypeItems = [];
        for (const key in this.conditionTypes) {
            if (Object.prototype.hasOwnProperty.call(this.conditionTypes, key)) {
                this.conditionTypeItems.push({code: key, name: this.conditionTypes[key]})
            }
        }
    }


    // fields metaada
    fillConditionNames() {
        this.categories = new ConditionCategories();

        // main types

        this.conditionNames = new  Map<String, Map<String,ConditionMetadata>>();
        let conditions = new Map<string, ConditionMetadata>();
        conditions.set("SEVERITY", { code: "SEVERITY", title: "Severity", dataType: "SVR", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "GE", name: ">=" },
                        { code: "LE", name: "<=" }],
            values: [
                { code: "INFO", name: "Info" },
                { code: "LOW", name: "Low" },
                { code: "MEDIUM", name: "Medium" },
                { code: "HIGH", name: "High" },
                { code: "CRITICAL", name: "Critical" }
            ],
            inputType: "CMB"});
        conditions.set("CVSS2", { code: "CVSS2", title: "CVSS2 Score", dataType: "DCM", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "GE", name: ">=" },
                        { code: "LE", name: "<=" }],
            values: [
                { code: "1", name: "1" },
                { code: "2", name: "2" },
                { code: "3", name: "3" },
                { code: "4", name: "4" },
                { code: "5", name: "5" },
                { code: "6", name: "6" },
                { code: "7", name: "7" },
                { code: "8", name: "8" },
                { code: "9", name: "9" },
                { code: "10", name: "10" }
            ],
            inputType: "CMB"});
        conditions.set("CVSS3", { code: "CVSS3", title: "CVSS3 Score", dataType: "DCM", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "GE", name: ">=" },
                        { code: "LE", name: "<=" }],
            values: [
                { code: "1", name: "1" },
                { code: "2", name: "2" },
                { code: "3", name: "3" },
                { code: "4", name: "4" },
                { code: "5", name: "5" },
                { code: "6", name: "6" },
                { code: "7", name: "7" },
                { code: "8", name: "8" },
                { code: "9", name: "9" },
                { code: "10", name: "10" }
            ],
            inputType: "CMB"});
        let securityType = new ConditionTypeMetadata("SECURITY", "Security");
        securityType.conditionMetadatas = conditions;
        this.categories.mainConditions.set(securityType.code, securityType);

        conditions = new Map<string, ConditionMetadata>();
        conditions.set("LICENSE_FAMILY", { code: "LICENSE_FAMILY", title: "License Family", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "LIKE", name: "LIKE" }],
            values: [], inputType: "STR"});
        conditions.set("LICENSE_NAME", { code: "LICENSE_NAME", title: "License Name", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "LIKE", name: "LIKE" }],
            values: [], inputType: "STR"});
        conditions.set("LICENSE_CATEGORY", { code: "LICENSE_CATEGORY", title: "License Category", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" }],
            values: [
                { code: "UNDEFINED", name: "Undefined" },
                { code: "PROPRIETARY_FREE", name: "Proprietary Free" },
                { code: "PUBLIC_DOMAIN", name: "Public Domain" },
                { code: "PROPRIETARY", name: "Proprietary" },
                { code: "PERMISSIVE", name: "Permissive" },
                { code: "COPYLEFT_WEAK", name: "Copyleft Weak" },
                { code: "COPYLEFT_STRONG", name: "Copyleft Strong" },
                { code: "COPYLEFT_PARTIAL", name: "Copyleft Partial" },
                { code: "COPYLEFT_LIMITED", name: "Copyleft Limited" },
                { code: "COPYLEFT", name: "Copyleft" }                
            ], inputType: "CMB"});
        conditions.set("LICENSE_FOUND_IN", { code: "LICENSE_FOUND_IN", title: "Found in", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" }],
            values: [{ code: "COMPONENT", name: "Component" },
                    { code: "IP", name: "IP" }], inputType: "CMB"});
        conditions.set("LICENSE_ATTRIBUTE", { code: "LICENSE_ATTRIBUTE", title: "License Attribute", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" }],
            values: [
                { code: "COMMERCIAL_USE", name: "Commercial Use" },
                { code: "MODIFY", name: "Modify" },
                { code: "DISTRIBUTE", name: "Distribute" },
                { code: "SUBLICENSE", name: "Sublicense" },
                { code: "ADD_WARRANTY", name: "Add Warranty" },
                { code: "PATENT_USE", name: "Patent Use" },
                { code: "PRIVATE_USE", name: "Private Use" },
                { code: "STATICALLY_LINK", name: "Statically Link" },
                { code: "CONTACT_AUTHOR", name: "Contact Author" },
                { code: "PAYMENT_OBLIGATION", name: "Payment Obligation" },
                { code: "LICENSE_CHANGE", name: "License Change" },
                { code: "PROVIDE_CREDIT", name: "Provide Credit" },
                { code: "INCLUDE_A_COPY_OF_NOTICE", name: "Include a Copy of Notice" },
                { code: "INCLUDE_LICENSE_TEXT_IN_CODE", name: "Include License Text in Code" },
                { code: "STATE_CHANGES", name: "State Changes" },
                { code: "INSTALL_INSTRUCTIONS", name: "Install Instructions" },
                { code: "SAME_LICENSE", name: "Same License" },
                { code: "INCLUDE_LICENSE_TEXT_IN_DOCUMENTATION", name: "Include License Text in Documentation" },
                { code: "INCLUDE_LIST_OF_CONDITIONS", name: "Include List of Conditions" },
                { code: "INCLUDE_DISCLAIMER_OF_WARRANTY", name: "Include Disclaimer of Warranty" },
                { code: "SOURCE_CODE_REDISTRIBUTION", name: "Source Code Redistribution" },
                { code: "INCLUDE_CREDIT_NOTICE_IN_ADVERTISEMENTS", name: "Include Credit Notice in Advertisements" },
                { code: "INDEMNIFY_CLAUSE", name: "Indemnify Clause" },
                { code: "NOTICE_OF_USAGE", name: "Notice of Usage" },
                { code: "DISTRIBUTION_THROUGH_NETWORK_USE", name: "Distribution Through Network Use" },
                { code: "NAME_MODIFICATION", name: "Name Modification" },
                { code: "TRADEMARK_USE", name: "Trademark Use" },
                { code: "LIABILITY", name: "Liability" },
                { code: "SUBLICENSING", name: "Sublicensing" },
                { code: "DAMAGE_COMPENSATION", name: "Damage Compensation" },
                { code: "WARRANTY_STATEMENT", name: "Warranty Statement" },
                { code: "MODIFICATIONS", name: "Modifications" },
                { code: "REDISTRIBUTION", name: "Redistribution" },
                { code: "PATENT_CLAUSE", name: "Patent Clause" },
                { code: "PATENT_GRANT", name: "Patent Grant" },
                { code: "PATENT_RIGHTS", name: "Patent Rights" }
            ], inputType: "CMB"});
        let legalType = new ConditionTypeMetadata("LEGAL", "Legal");
        legalType.conditionMetadatas = conditions;
        this.categories.mainConditions.set(legalType.code, legalType);

        conditions = new Map<string, ConditionMetadata>();
        conditions.set("SUPPLY_RISK", { code: "SUPPLY_RISK", title: "Supply Chain Risk", dataType: "DCM", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "GE", name: ">=" },
                        { code: "LE", name: "<=" }],
            values: [], inputType: "NUM"});
        conditions.set("SUPPLY_QUALITY", { code: "SUPPLY_QUALITY", title: "Supply Chain Quality", dataType: "DCM", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "GE", name: ">=" },
                        { code: "LE", name: "<=" }],
            values: [], inputType: "NUM"});
        this.conditionNames.set("SUPPLY_CHAIN", conditions);
        let supplyChainType = new ConditionTypeMetadata("SUPPLY_CHAIN", "Supply Chain");
        supplyChainType.conditionMetadatas = conditions;
        this.categories.mainConditions.set(supplyChainType.code, supplyChainType);


        //// subordiname types

        conditions = new Map<string, ConditionMetadata>();
        conditions.set("COMPONENT_GROUP_ID", { code: "COMPONENT_GROUP_ID", title: "Component group ID", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "LIKE", name: "LIKE" }],
            values: [], inputType: "STR"});
        conditions.set("COMPONENT_ARTIFACT_ID", { code: "COMPONENT_ARTIFACT_ID", title: "Component ID", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "LIKE", name: "LIKE" }],
            values: [], inputType: "STR"});
        conditions.set("COMPONENT_VERSION", { code: "COMPONENT_VERSION", title: "Component version", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "LIKE", name: "LIKE" }],
            values: [], inputType: "STR"});
        conditions.set("COMPONENT_NAME", { code: "COMPONENT_NAME", title: "Component name", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "LIKE", name: "LIKE" }],
            values: [], inputType: "STR"});
        conditions.set("COMPONENT_AGE", { code: "COMPONENT_AGE", title: "Component age in months", dataType: "INT", 
            operators: [{ code: "EQ", name: "=" },
                        { code: "GE", name: ">=" },
                        { code: "LE", name: "<=" }],
            values: [], inputType: "NUM"});
        let componentType = new ConditionTypeMetadata("COMPONENT", "Component");
        componentType.conditionMetadatas = conditions;
        this.categories.subordinateConditions.set(componentType.code, componentType);

        conditions = new Map<string, ConditionMetadata>();
        conditions.set("EMBEDDED_ASSET", { code: "EMBEDDED_ASSET", title: "IP w/Embedded Assets", dataType: "DBL", 
            operators: [{ code: "GT", name: ">" },
                        { code: "LT", name: "<" }],
            values: [], inputType: "NUM"});
        let codeQualityType = new ConditionTypeMetadata("CODE_QUALITY", "Code Quality");
        codeQualityType.conditionMetadatas = conditions;
        this.categories.subordinateConditions.set(codeQualityType.code, codeQualityType);

        conditions = new Map<string, ConditionMetadata>();
        conditions.set("RELEASE_STAGE", { code: "RELEASE_STAGE", title: "Release Stage", dataType: "STR", 
            operators: [{ code: "IN", name: "IN" }],
            values: [
                { code: "DEVELOPMENT", name: "Development" },
                { code: "STAGE", name: "Stage" },
                { code: "Q/A", name: "Q/A" },
                { code: "PRODUCTION", name: "Production" }
            ], inputType: "CMM"});
        let releaseStageType = new ConditionTypeMetadata("RELEASE_STAGE", "Release Stage");
        releaseStageType.conditionMetadatas = conditions;
        this.categories.subordinateConditions.set(releaseStageType.code, releaseStageType);
        
        conditions = new Map<string, ConditionMetadata>();
        conditions.set("PROJECT_TAG", { code: "PROJECT_TAG", title: "Project Tags", dataType: "STR", 
            operators: [{ code: "IN", name: "IN" }],
            values: [], inputType: "CHP"});
        let projectTagType = new ConditionTypeMetadata("PROJECT_TAG", "Project Tag");
        projectTagType.conditionMetadatas = conditions;
        this.categories.subordinateConditions.set(projectTagType.code, projectTagType);

        this.fillQualificatorsData();
    }


    // meta conditions
    fillQualificatorsData() {
        let threshold = { code: "THRESHOLD", title: "Threshold", dataType: "INT", 
            operators: [{ code: "GE", name: ">=" }],
            values: [], inputType: "NUM"};
        let scope = { code: "SCOPE", title: "Scope", dataType: "STR", 
            operators: [{ code: "EQ", name: "=" }],
            values: [{ code: "PROJECT", name: "Project" },
                    { code: "COMPONENT", name: "Component" }], inputType: "CMB"};


        this.categories.mainConditions.forEach((value: ConditionTypeMetadata, key: string) => {
                    value.conditionMetadatas.set(threshold.code, threshold);
                    value.conditionMetadatas.set(scope.code, scope);
        });   
        let condType = new ConditionTypeMetadata("THRESHOLD", "Threshold");
        condType.conditionMetadatas.set("THRESHOLD", threshold);
        this.categories.subordinateConditions.set(condType.code, condType);
        condType = new ConditionTypeMetadata("SCOPE", "Scope");
        condType.conditionMetadatas.set("SCOPE", scope);
        this.categories.subordinateConditions.set(condType.code, condType);
    }

    // returns condition names
    getConditionTypeNames(map: any): ConditionMetadata[] {
        return Array.from(map.values());
    }

    // returns condition operators
    getOperators (categoryName:string, conditionType: string, conditionName: string) : CodeNamePair[]  {
        let operators = undefined;
        if (!!conditionType && !!conditionName) {
            if (categoryName === 'MAIN') {
                operators = this.categories.mainConditions.get(conditionType).conditionMetadatas.get(conditionName);
            } else {
                operators = this.categories.subordinateConditions.get(conditionType).conditionMetadatas.get(conditionName);
            }
            if (!! operators) {
                operators = operators.operators;
            }
        }
        if (!!operators) {
            return operators;
        } else {
            return [];
        }
    }

    // remove condition
    removeCondition(group: PolicyConditionGroup, condition: PolicyCondition) {
        const index = group.conditions.indexOf(condition);
        if (index > -1) {
            group.conditions.splice(index, 1);
        }
        if (index==group.conditions.length) {
            group.conditions[group.conditions.length-1].logicalOperator = undefined;
        }
    }

    // add condition
    addCondition(group: PolicyConditionGroup) {
        if (group.groupOperator) {
            let newCondition = new PolicyCondition();
            let conditionTypeMetadata: ConditionTypeMetadata;
            if (group === this.parentGroup.groups[0]) {
                newCondition.conditionType=this.policy.conditionType;
                conditionTypeMetadata = this.categories.mainConditions.get(newCondition.conditionType);
            } else {
                conditionTypeMetadata = Array.from(this.categories.subordinateConditions.values())[0];
                newCondition.conditionType=conditionTypeMetadata.code;
            }
            let conditionMetadata = Array.from(conditionTypeMetadata.conditionMetadatas.values())[0];
            newCondition.conditionName = conditionMetadata.code;
            newCondition.operator = conditionMetadata.operators[0].code;
            newCondition.conditionDataType = conditionMetadata.dataType
            if (conditionMetadata.dataType == 'STR' && conditionMetadata.inputType == 'CMB') {
                newCondition.strValue = conditionMetadata.values[0].code;
            }
            if (conditionMetadata.dataType == 'DCM' && conditionMetadata.inputType == 'CMB') {
                newCondition.decimalValue = parseInt(conditionMetadata.values[0].code);
            }
            if (conditionMetadata.dataType == 'SVR' && conditionMetadata.inputType == 'CMB') {
                newCondition.severityValue = conditionMetadata.values[0].code;
            }
            if (!group.conditions) {
                group.conditions=[];
            } else if (group.conditions.length > 0) {
                group.conditions[group.conditions.length-1].logicalOperator="AND";
            }
            group.conditions.push(newCondition);
        }
    }

    // move condition down
    moveDown(group: PolicyConditionGroup, condition: PolicyCondition) {
        const index = group.conditions.indexOf(condition);
        if (index > -1 && index < (group.conditions.length-1)) {
            let elem = group.conditions[index];
            if (index+1 === group.conditions.length-1) {
                group.conditions[index+1].logicalOperator = elem.logicalOperator;
                elem.logicalOperator = undefined;
            }
            group.conditions.splice(index, 1, group.conditions[index+1]);
            group.conditions.splice(index+1, 1, elem);
        }
    }

    // move condition up
    moveUp(group: PolicyConditionGroup, condition: PolicyCondition) {
        const index = group.conditions.indexOf(condition);
        if (index > 0 && index < (group.conditions.length)) {
            let elem = group.conditions[index];
            if (index === group.conditions.length-1) {
                elem.logicalOperator = group.conditions[index-1].logicalOperator;
                group.conditions[index-1].logicalOperator = undefined;
            }
            group.conditions.splice(index, 1, group.conditions[index-1]);
            group.conditions.splice(index-1, 1, elem);
        }
    }


    // change value handler
    onChangeValue(newValue: any, condition: PolicyCondition) {
        condition.decimalValue = undefined;
        condition.doubleValue = undefined;
        condition.intValue = undefined;
        condition.severityValue = undefined;
        condition.strValue = undefined;
        if (condition.conditionDataType === "DCM") {
            condition.decimalValue=newValue;
        } else if (condition.conditionDataType === "DBL") {
            condition.doubleValue = newValue;
        } else if (condition.conditionDataType === "INT") {
            condition.intValue = newValue;
        } else if (condition.conditionDataType === "SVR") {
            condition.severityValue = newValue;
        } else  if(condition.conditionDataType === "STR" && this.getConditionMetadata(condition.conditionType, condition.conditionName).inputType === 'CMM') {
            condition.arrayValue = newValue;
            condition.strValue = newValue.join(",");
        } else  {
            condition.strValue = newValue;
        }    
    }

    // return condition metadata for condition
    getConditionMetadata(conditionType: string, conditionName: string): ConditionMetadata {
        let condType = this.categories.mainConditions.get(conditionType) || this.categories.subordinateConditions.get(conditionType);
        if (!condType) {
            return undefined;
        }
        return condType.conditionMetadatas.get(conditionName);
    } 

    // return condition value
    getConditionValue(condition: PolicyCondition) {
        if (condition.conditionDataType === "DCM") {
            if (this.getConditionMetadata(condition.conditionType, condition.conditionName).inputType === 'CMB') {
                return !!condition.decimalValue? condition.decimalValue.toString(): condition.decimalValue;
            } else {
                return condition.decimalValue;
            }
        } else if (condition.conditionDataType === "DBL") {
            return condition.doubleValue;
        } else if (condition.conditionDataType === "INT") {
            if (this.getConditionMetadata(condition.conditionType, condition.conditionName).inputType === 'CMB') {
                return !!condition.intValue? condition.intValue.toString(): condition.intValue;
            } else {
                return condition.intValue;
            }
        } else if (condition.conditionDataType === "SVR") {
            return condition.severityValue;
        } else  if(condition.conditionDataType === "STR" && this.getConditionMetadata(condition.conditionType, condition.conditionName).inputType === 'CMM') {
            return condition.arrayValue;
        } else  {
            return condition.strValue;
        }    
    }

    // change main condition name handler
    onChangeName(newName:any, condition: PolicyCondition) {
        condition.conditionName=newName;
        condition.decimalValue = undefined;
        condition.doubleValue = undefined;
        condition.intValue = undefined;
        condition.severityValue = undefined;
        condition.strValue = undefined;
        condition.arrayValue = undefined;
        let conditionTypeMetadata = this.categories.mainConditions.get(condition.conditionType) || this.categories.subordinateConditions.get(condition.conditionType);
        if (!!conditionTypeMetadata) {
            let conditionMetadata = conditionTypeMetadata.conditionMetadatas.get(newName);
            if (!!conditionMetadata) {
                condition.conditionDataType = conditionMetadata.dataType;
                if (!!conditionMetadata.operators && conditionMetadata.operators.length>0) {
                    condition.operator = conditionMetadata.operators[0].code;
                }
                if (conditionMetadata.dataType == 'STR' && conditionMetadata.inputType == 'CMB' && conditionMetadata.values.length > 0) {
                    condition.strValue = conditionMetadata.values[0].code;
                }
                if (conditionMetadata.dataType == 'SVR' && conditionMetadata.inputType == 'CMB' && conditionMetadata.values.length > 0) {
                    condition.severityValue = conditionMetadata.values[0].code;
                }
                if (conditionMetadata.dataType == 'DCM' && conditionMetadata.inputType == 'CMB' && conditionMetadata.values.length > 0) {
                    condition.decimalValue = parseInt(conditionMetadata.values[0].code);
                }
    
            }
        }
    }


    // change subordinate condition name handler
    onChangeSubordinateName(newName:any, condition: PolicyCondition) {
        condition.conditionName=newName;
        condition.decimalValue = undefined;
        condition.doubleValue = undefined;
        condition.intValue = undefined;
        condition.severityValue = undefined;
        condition.strValue = undefined;
        condition.arrayValue = undefined;
        let conditionInfo = this.subordinateConditionListItems.find((item)=> !item.isType&&item.code===newName);
        if (!!conditionInfo) {
            condition.conditionType = conditionInfo.conditionType;
        }
        let conditionTypeMetadata = this.categories.mainConditions.get(condition.conditionType) || this.categories.subordinateConditions.get(condition.conditionType);
        if (!!conditionTypeMetadata) {
            let conditionMetadata = conditionTypeMetadata.conditionMetadatas.get(newName);
            if (!!conditionMetadata) {
                condition.conditionDataType = conditionMetadata.dataType;
                if (!!conditionMetadata.operators && conditionMetadata.operators.length>0) {
                    condition.operator = conditionMetadata.operators[0].code;
                }
                if (conditionMetadata.dataType == 'STR' && conditionMetadata.inputType == 'CMB' && conditionMetadata.values.length > 0) {
                    condition.strValue = conditionMetadata.values[0].code;
                }
                if (conditionMetadata.dataType == 'SVR' && conditionMetadata.inputType == 'CMB' && conditionMetadata.values.length > 0) {
                    condition.severityValue = conditionMetadata.values[0].code;
                }
                if (conditionMetadata.dataType == 'DCM' && conditionMetadata.inputType == 'CMB' && conditionMetadata.values.length > 0) {
                    condition.decimalValue = parseInt(conditionMetadata.values[0].code);
                }
            }
        }
    }

    // return subordibate condition names
    getSubordinateConditionTypeNames(): SubordinateConditionListItem[] {
        let result : SubordinateConditionListItem[] = [];
        this.categories.subordinateConditions.forEach((value: ConditionTypeMetadata, key: string) => {
            let item = new SubordinateConditionListItem();
            item.code=value.code;
            item.title=value.title;
            item.isType = true;
            item.conditionType = value.code;
            result.push(item);
            value.conditionMetadatas.forEach((v: ConditionMetadata, k: string) => {
                let item = new SubordinateConditionListItem();
                item.code=v.code;
                item.title=v.title;
                item.isType = false;
                item.conditionType = value.code;
                result.push(item);
            });
        });
        return result;
    }

    // remove project tag from valucondition value
    removeProjectTag(condition, tag) {
        if (!!condition.strValue) {
            let tags = condition.strValue.split(",");
            let ind = tags.indexOf(tag);
            if (ind>-1) {
                tags.splice(ind,1);
                if (tags.length>0) {
                    condition.strValue = tags.join(",");
                } else {
                    condition.strValue = undefined;
                }
            }
        }
    }

    // add project tag to condition value
    addProjectTag(condition, event) {
        if (!condition.strValue || condition.strValue.length === 0) {
            condition.strValue = event.value;
        } else {
            let tags = condition.strValue.split(",");
            if (tags.indexOf(event.value)===-1) {
                condition.strValue += ','+event.value;
            }
        }
        event.input.value="";
    }

    // if this is a last main condition
    isLastMainCondition(condition: PolicyCondition) {
        return this.policy.conditions.groups[0] && this.policy.conditions.groups[0].conditions && this.policy.conditions.groups[0].conditions.length>0 && 
            this.policy.conditions.groups[0].conditions[0] === condition;
    }

    // if this is a last condition
    isLastCondition(group: PolicyConditionGroup, condition: PolicyCondition) {
        if (!group.conditions) {
            return false;
        }
        const index = group.conditions.indexOf(condition);
        return index === group.conditions.length-1;
    }    

    // if this is a first condition
    isFirstCondition(group: PolicyConditionGroup, condition: PolicyCondition) {
        if (!group.conditions) {
            return false;
        }
        const index = group.conditions.indexOf(condition);
        return index === 0;
    }    
}

class CodeNamePair {
  code: string;
  name: string;
}

class NumCodeNamePair {
    code: number;
    name: string;
  }

class ConditionCategories {
    mainConditions : Map<string, ConditionTypeMetadata>;
    subordinateConditions : Map<string, ConditionTypeMetadata>;
    constructor() {
        this.mainConditions = new Map<string, ConditionTypeMetadata>();
        this.subordinateConditions = new Map<string, ConditionTypeMetadata>();
    }
}
  
class ConditionTypeMetadata {
    code: string;
    title: string;
    conditionMetadatas: Map<string, ConditionMetadata>;
    constructor(code: string, title: string) {
        this.conditionMetadatas = new Map<string, ConditionMetadata>();
        this.code = code;
        this.title = title;
    }
}

class ConditionMetadata {
    code: string;
    title: string;
    dataType: string;
    operators: CodeNamePair[];
    values: CodeNamePair[];
    inputType: string;
} 

class SubordinateConditionListItem {
    code: string;
    title: string;
    isType: boolean;
    conditionType: string;
}
  
  