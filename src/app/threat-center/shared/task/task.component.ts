import { Component, OnInit } from '@angular/core';
import { Task } from '@app/models';
import { TaskService } from '@app/services/task.service';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  obsTask:Observable<Task>;

  constructor(private taskService:TaskService) { }

  ngOnInit() {
    //console.log("Loading TaskComponent");
    //this.obsTask = this.taskService.submitScanRequest()
    //.pipe(map(result => result.data));
  }
}
