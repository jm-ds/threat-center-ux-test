import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { RunningTaskCountQuery, ScanRequest, TaskQuery } from '../models/types';
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';

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
    return this.apollo.watchQuery<TaskQuery>({
      query: gql`  query {
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
    }
  `, fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  getRunningScanTasksCount(entityId: string) {
    return this.apollo.watchQuery<RunningTaskCountQuery>({
      query: gql`  query {
        running_scan_tasks_count(entityId:"${entityId}")
    }
  `, fetchPolicy: 'no-cache'
    }).valueChanges;
  }

}
