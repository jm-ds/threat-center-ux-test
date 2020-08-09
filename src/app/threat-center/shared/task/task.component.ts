import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';
import { Task } from '../models/types';
import { TaskService } from './task.service';

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
