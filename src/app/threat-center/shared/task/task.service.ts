import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { ScanRequest, TaskQuery } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  public scanRequest:ScanRequest;

  constructor(private apollo: Apollo) { }

  submitScanRequest() {
    /*if(!this.scanRequest) {}
      // should reroute back to wizard.
      return;
    }*/

    return this.apollo.watchQuery<TaskQuery>({
      query: gql`
        query {
            task_submitScanRequest(login:"${this.scanRequest.login}",repository:"${this.scanRequest.repository}",branch:"${this.scanRequest.branch}",entityId:"${this.scanRequest.entityId}") {
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
      `,
       fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  getTaskUpdate(taskToken:string) {
    return this.apollo.watchQuery<TaskQuery>({
      query: gql`
        query {
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
      `,fetchPolicy: 'no-cache',
    }).valueChanges;
  }
}
