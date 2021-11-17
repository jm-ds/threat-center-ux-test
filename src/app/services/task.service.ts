import { Injectable } from "@angular/core";
import { CoreGraphQLService } from "@app/services/core/core-graphql.service";
import { CheckAlreadyScannedQuery, ScanRequest, TaskQuery } from "@app/models";
import { RunningTaskCountQuery, RunningTaskCountSubscription } from "@app/threat-center/shared/models/types";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  public scanRequest: ScanRequest;

  constructor(private apollo: Apollo,
    private coreGraphQLService: CoreGraphQLService) { }

  submitScanRequest() {
    /*if(!this.scanRequest) {}
      // should reroute back to wizard.
      return;
    }*/

    return this.coreGraphQLService.coreGQLReq<TaskQuery>(
      gql`query {
        task_submitScanRequest(login:"${this.scanRequest.login}",repository:"${this.scanRequest.repository}",branch:"${this.scanRequest.branch}",repoType:"${this.scanRequest.repoType}",projectId:"${this.scanRequest.projectId}",entityId:"${this.scanRequest.entityId}") {
        taskToken,
        pctComplete,
        status,
        statusMessage,
        resourceId
        subtasks {
          taskToken,
          pctComplete,
          status,
          statusMessage,
          resourceId
        }
      }
    }`, 'no-cache');
  }

  getTaskUpdate(taskToken: string) {
    return this.coreGraphQLService.coreGQLReq<TaskQuery>(gql` query {
      task_update(taskToken:"${taskToken}") {
      taskToken,
      pctComplete,
      status,
      statusMessage,
      resourceId
      subtasks {
        taskToken,
        pctComplete,
        status,
        statusMessage,
        resourceId
        }
      }
    }`, 'no-cache');
  }

  getRunningScanTasksCount(entityId: string) {
    return this.coreGraphQLService.coreGQLReq<RunningTaskCountQuery>(gql`  query {
      running_scan_tasks_count(entityId:"${entityId}")
    }`, 'no-cache');
  }


  // subscribe to running scan task count
  subscribeRunningScanTaskCount(entityId: string) {
    return this.apollo.subscribe<RunningTaskCountSubscription>({
      query: gql`subscription{
        subscribeRunningScanTaskCount(entityId:"${entityId}") {value, errors{
          message
        }}
      }`
    });
  }



  // fetch if same project is already scanned
  checkAlreadyScannedProject(errorHandler) {
    return this.coreGraphQLService.coreGQLReq<CheckAlreadyScannedQuery>(
      gql`query {
        checkAlreadyScannedProject(login:"${this.scanRequest.login}",repository:"${this.scanRequest.repository}",branch:"${this.scanRequest.branch}",repoType:"${this.scanRequest.repoType}", entityId: "${this.scanRequest.entityId}")
      }`, 'no-cache', {}, errorHandler);
  }
}
