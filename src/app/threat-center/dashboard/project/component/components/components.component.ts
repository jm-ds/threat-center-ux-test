import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FixResult, Scan } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FixService } from "@app/threat-center/dashboard/project/services/fix.service";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'components',
    templateUrl: './components.component.html',
    styles: []
})
export class ComponentsComponent implements OnInit {

    @Input() scanId;
    @Output() dataCount = new EventEmitter<string>();
    obsScan: Observable<Scan>;
    fixResultObservable: Observable<FixResult>;
    newVersion: string;

    columns = [
        { field: 'name', header: 'Name' },
        { field: 'group', header: 'Group' },
        { field: 'version', header: 'Version' },
        { field: 'isInternal', header: 'Internal' },
        { field: 'disc', header: 'Source' },
        { field: 'license.name', header: 'Licenses' },
        { field: 'vulnerabilities', header: 'Vulnerabilities' },
    ];

    constructor(private apiService: ApiService, private fixService: FixService, private spinner: NgxSpinnerService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        console.log("scanId:", this.scanId);
        console.log("Loading ComponentsComponent");
        this.obsScan = this.apiService.getScanComponents(this.scanId)
            .pipe(map(result => result.data.scan));
        this.obsScan.subscribe((component: any) => {
            this.dataCount.emit(component.components.totalCount);
        });
    }

    fixVersion(groupId: string, artifactId: string) {
        this.spinner.show();
        this.fixResultObservable = this.fixService.fixComponentVersion(this.scanId, groupId, artifactId, this.newVersion.split("||")[1]);
        this.fixResultObservable.subscribe(res => {
            this.spinner.hide();
            if (res) {
                Swal.fire('Good job!', 'Mvn dependency version updated!', 'success');
            } else {
                Swal.fire('Error!', 'Something went wrong, try later!', 'warning');
            }
        });
    }

    gotoDetails(cId) {
        const entityId = this.route.snapshot.paramMap.get('entityId'), projectId = this.route.snapshot.paramMap.get('projectId');
        const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/component/" + cId;
        this.router.navigate([decodeURIComponent(url)]);
      }
}
