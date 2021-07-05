import {Component, OnInit} from '@angular/core';
import {Messages, Policy, PolicyConnection} from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import {PolicyService} from "@app/threat-center/dashboard/services/policy.service";
import { TreeNode } from 'primeng/api';
import { type } from 'jquery';

@Component({
    selector: 'app-policy-list',
    templateUrl: './policy-list.component.html',
    styleUrls: ['./policy-list.component.scss']
})
export class PolicyListComponent implements OnInit {

    policies: TreeNode[];
    messages: Messages;
    onlyActive: Boolean;
    entityId: string;
    projectId: string;
    conditionTypes: any;



    constructor(
        private policyService: PolicyService,
        protected router: Router,
        private route: ActivatedRoute
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.onlyActive = true;
        this.entityId = this.route.snapshot.paramMap.get('entityId');
        this.projectId = this.route.snapshot.paramMap.get('projectId');
        this.conditionTypes = this.policyService.getConditionTypes();
        this.fetchList();
    }

    fetchList() {
        this.policyService.getPolicyList(this.entityId, this.projectId, this.onlyActive).subscribe(
            data => {
                this.buildPolicyTree(data.data.policies);
            },
            error => {
                console.error("PolicyListComponent", error);
            }
        );
    }

    onlyActiveChange() {
        if (this.onlyActive) {
            this.onlyActive = undefined;
        } else {
            this.onlyActive = true;    
        }
        this.fetchList();
    }

    buildPolicyTree(policies: PolicyConnection) {
        let edges = policies.edges;
        let types = []
        for (const edge of edges) {
            if (types.indexOf(edge.node.conditionType)===-1) {
                types.push(edge.node.conditionType);
            }
        }
        let nodes: TreeNode[] = []
        for (const tp of types) {
            const pol = new Policy();
            pol.name = this.getTypeTitle(tp);
            let node: TreeNode = {
                label: this.getTypeTitle(tp),
                data: pol,
                expandedIcon: "fa fa-folder-open",
                collapsedIcon: "fa fa-folder",
                expanded: true,
                children: [
                ]
            };
            nodes.push(node);
            for (const edge of edges) {
                if (edge.node.conditionType===tp) {
                    let chNode: TreeNode = {
                        label: edge.node.name,
                        data: edge.node,
                        expandedIcon: "fa fa-folder-open",
                        collapsedIcon: "fa fa-folder",
                        children: []
                    };
                    node.children.push(chNode);
                }
            }
        }
        this.policies = nodes;
      }
    
      getTypeTitle(typeCode: string) {
          if (typeCode === "SECURITY") {
              return "Security policies";
          } else if (typeCode === "LEGAL") {
            return "Legal policies";
          } else if (typeCode === "SUPPLY_CHAIN") {
            return "Supply chain policies";
          }  
      }
}