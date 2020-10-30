import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GitHubUserQuery,Branch,UserSelection, Vulnerability,ScanEdge,Project,Entity } from '../models/types';


@Injectable({
  providedIn: 'root'
})
export class StateService {

  private userSelection:UserSelection;

  public project_tabs_selectedTab:string;
  public component_tabs_selectedTab:string;
  public vulnerability_tabs_selectedTab:string;
  public selectedScan:ScanEdge;
  public obsProject:Observable<Project>;


}
