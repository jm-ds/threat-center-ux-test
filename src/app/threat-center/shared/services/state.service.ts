import { Injectable } from '@angular/core';
import { Project, ScanEdge, UserSelection } from '@app/models';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class StateService {

  private userSelection: UserSelection;

  public project_tabs_selectedTab: string;
  public component_tabs_selectedTab: string;
  public vulnerability_tabs_selectedTab: string;
  public selectedScan: ScanEdge;
  public obsProject: Observable<Project>;


}
