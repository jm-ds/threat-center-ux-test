import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Scan } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';

@Component({
  selector: 'scanassets',
  templateUrl: './scanassets.component.html',
  styles: []
})
export class ScanAssetsComponent implements OnInit {

  @Input() scanId;
  @Output() dataCount = new EventEmitter<string>();
  obsScan:Observable<Scan>;

  columns = ['Name', 'File Size','Workspace Path','Status','Embedded Assets' ];

  constructor(private apiService:ApiService,
    private route:ActivatedRoute,
    private router:Router) { }

  ngOnInit() {
    console.log("scanId:",this.scanId);
    console.log("Loading ScanAssetsComponent");
    this.obsScan = this.apiService.getScanAssets(this.scanId)
    .pipe(map(result => result.data.scan));

    this.obsScan.subscribe(asset => {
      this.dataCount.emit(asset.scanAssets.totalCount);
    });
  }

  sort(scanAssets:any) {
    return scanAssets.sort((a,b) => a.node.status.localeCompare(b.node.status)).sort((a,b) => b.node.embeddedAssets.length-a.node.embeddedAssets.length);
  }

  gotoDetails(sAssetId) {
    const entityId = this.route.snapshot.paramMap.get('entityId'), projectId = this.route.snapshot.paramMap.get('projectId');
    const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/scanasset/" + sAssetId;
    this.router.navigate([decodeURIComponent(url)]);
  }
}
