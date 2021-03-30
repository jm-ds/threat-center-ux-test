import { Component, OnInit,Input } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';
import { MarkdownModule } from 'ngx-markdown';
import { ScanAsset } from '@app/models';


export interface DiffContent {
  leftContent: string;
  rightContent: string;
}

export type DiffTableFormat = 'SideBySide' | 'LineByLine';

export interface DiffResults {
  hasDiff: boolean;
  diffsCount: number;
  rowsWithDiff: {
    leftLineNumber?: number;
    rightLineNumber?: number;
    numDiffs: number;
  }[];
}

@Component({
  selector: 'file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {

  //@Input() obsRepositoryAsset:Observable<any>;
  @Input() repositoryAsset:ScanAsset;
  assetData:any;

  //lineHighlights = "6, 10-16";
  lineHighlights:string;

  constructor() { }

  ngOnInit() {
    console.log("repo name:",this.repositoryAsset.name);
    if(this.repositoryAsset.name === "URLUtil.java") {
      this.lineHighlights = "13-30";
    }
    if(this.repositoryAsset.name === "SpringCli.java") {
      this.lineHighlights = "82-99";
    }
  }

  public setHighlights() {

  }
}
