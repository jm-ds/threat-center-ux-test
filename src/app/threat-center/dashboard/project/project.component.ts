import { Component, OnInit} from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {TaskComponent} from '@app/threat-center/shared/task/task.component';
import { Scan, Project } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { StateService } from '@app/threat-center/shared/services/state.service';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';
import {ApexChartService} from '@app/theme/shared/components/chart/apex-chart/apex-chart.service';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { ChartDB } from '../../../fack-db/chart-data';

@Component({
  selector: 'project-dashboard',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(
    private apiService:ApiService,
    private stateService:StateService,
    private route: ActivatedRoute,
    public apexEvent: ApexChartService) {
       this.chartDB = ChartDB;
    }

  public chartDB: any;
  obsProject:Observable<Project>;
  //selectedScan:Scan;
  projectId:string;

  columns = ['Version','Branch','Tag','Created','Vulnerabilities','Licenses','Components','Embedded'];

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    console.log(this.projectId);
    if(!this.obsProject) {
      console.log("Loading ScansComponent");
      this.obsProject = this.apiService.getProject(this.projectId)
      .pipe(map(result => result.data.project));

      this.stateService.obsProject = this.obsProject;
    }
    //this.obsProject.subscribe(project => {this.selectedScan = project.scans[0];});
    this.obsProject.subscribe(project => {
      this.stateService.selectedScan = project.scans.edges[0];
      let critical = [];
      let high = [];
      let medium = [];
      let low = [];
      let info = [];
      let categories = [];

      let copyleftStrong = [];
      let copyleftWeak = [];
      let copyleftPartial = [];
      let copyleftLimited = [];
      let copyleft = [];
      let custom = [];
      let dual = [];
      let permissive = [];

      let notLatest = [];
      let vulnerabilities = [];
      let riskyLicenses = [];

       let embedded = [];
       let analyzed = [];
       let skipped = [];


      for (let i = 9; i >=0; i--) {
        let edge = project.scans.edges[i];
        if (edge) {
          let scan = edge.node;
          if(scan && scan.scanMetrics) {
            let vulnerabilityMetrics = scan.scanMetrics.vulnerabilityMetrics;
            let licenseMetrics = scan.scanMetrics.licenseMetrics;
            let componentMetrics = scan.scanMetrics.componentMetrics;
            let assetMetrics = scan.scanMetrics.assetMetrics;

            // Vulnerability chart data
            critical.push(scan.scanMetrics.vulnerabilityMetrics.critical);
            high.push(scan.scanMetrics.vulnerabilityMetrics.high);
            medium.push(scan.scanMetrics.vulnerabilityMetrics.medium);
            low.push(scan.scanMetrics.vulnerabilityMetrics.low);
            info.push(scan.scanMetrics.vulnerabilityMetrics.info);

            // License chart data
            // License chart data
            copyleftStrong.push(scan.scanMetrics.licenseMetrics.copyleftStrong);
            copyleftWeak.push(scan.scanMetrics.licenseMetrics.copyleftWeak);
            copyleftPartial.push(scan.scanMetrics.licenseMetrics.copyleftPartial);
            copyleftLimited.push(scan.scanMetrics.licenseMetrics.copyleftLimited);
            copyleft.push(scan.scanMetrics.licenseMetrics.copyleft);
            custom.push(scan.scanMetrics.licenseMetrics.custom);
            dual.push(scan.scanMetrics.licenseMetrics.dual);
            permissive.push(scan.scanMetrics.licenseMetrics.permissive);

            // Component chart data
            notLatest.push(scan.scanMetrics.componentMetrics.notLatest);
            vulnerabilities.push(scan.scanMetrics.componentMetrics.vulnerabilities);
            riskyLicenses.push(scan.scanMetrics.componentMetrics.riskyLicenses);

            // Asset chart data
            embedded.push(scan.scanMetrics.assetMetrics.embedded);
            analyzed.push(scan.scanMetrics.assetMetrics.analyzed);
            skipped.push(scan.scanMetrics.assetMetrics.skipped);

            // categories for bar charts
            //let cat = scan.branch.concat(' ').concat(formatDate(scan.created,'dd/MM/yyyy','en-US'));
            categories.push(scan.branch);
          }
        }
      }

      // set vulnerabilityChart data
      this.vulnerabilityChart.series.push({name:'Critical',data:critical});
      this.vulnerabilityChart.series.push({name:'High',data:high});
      this.vulnerabilityChart.series.push({name:'Medium',data:medium});
      this.vulnerabilityChart.series.push({name:'Low',data:low});
      this.vulnerabilityChart.series.push({name:'Info',data:info});

       // set licenseChart data
       this.licenseChart.series.push({name:'CL Strong',data:copyleftStrong});
       this.licenseChart.series.push({name:'CL Weak',data:copyleftWeak});
       this.licenseChart.series.push({name:'CL Partial',data:copyleftPartial});
       this.licenseChart.series.push({name:'CL Limited',data:copyleftLimited});
       this.licenseChart.series.push({name:'Copyleft',data:copyleft});
       this.licenseChart.series.push({name:'Custom',data:custom});
       this.licenseChart.series.push({name:'Dual',data:dual});
       this.licenseChart.series.push({name:'Permissive',data:permissive});

      // set componentChart data
      this.componentChart.series.push({name:'Not Latest',data:notLatest});
      this.componentChart.series.push({name:'Vulnerabilities',data:vulnerabilities});
      this.componentChart.series.push({name:'Risky Licenses',data:riskyLicenses});

      // set assetChart data
      this.assetChart.series.push({name:'Analyzed',data:analyzed});
      this.assetChart.series.push({name:'Skipped',data:skipped});
      this.assetChart.series.push({name:'Embedded',data:embedded});

      // set categories on bar charts
      this.xaxis.categories = categories;

    });
 }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.project_tabs_selectedTab=$event.nextId;
  }

  rowUnselect ($event: any) {
    // prevent unselect row
    this.stateService.selectedScan = $event.data;
  }

  public licensePieChart2 = {
      chart: {
        height: 218,
        type: 'donut',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 500
        }
      },
      stroke: {
        width: 2,
      },
      series: [55, 35, 5, 10, 47],
      labels: ["Apache License 2.0","Eclipse Public License 1.0","JSON License","Mozilla License","Mozilla Public License 1.1"],
      tooltip: {
          enabled: false
      },
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '13px',
              },
              value: {
                show: true
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false,
        dropShadow: {
          enabled: true,
        }
      }
    };

    chart =  {
       height: 200,
       parentHeightOffset: 0,
       stacked: true,
       type: 'bar',
       foreColor: '#adb7be',
        animations: {
          enabled: false
        },
        toolbar: {
          show: false,
        }
     };

     plotOptions = {
       bar: {
         horizontal: false,
         columnWidth: '60%',
       },
     };

     legend = {
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 5,
        fontSize: '11px',
        //width: 500,
        itemMargin: {
         horizontal: 5,
         vertical: 0
        },
      };

      dataLabels = {
        enabled: false
      };

      stroke = {
       show: true,
       width: 1,
       colors: ['#fff']
      };

      xaxis = {
        categories: [],
        labels: {
          show: true,
          rotate: -45,
         },
      };


    public vulnerabilityChart = {
     chart: this.chart,
     plotOptions: this.plotOptions,
     legend: this.legend,
     dataLabels: this.dataLabels,
     stroke: this.stroke,
     colors: ['#ff2b2b','#ff5252', '#ffa21d','#00acc1','#00e396' ],//,'#11c15b'
     series: [],
     xaxis: this.xaxis
   };

  public licenseChart = {
     chart: this.chart,
     plotOptions: this.plotOptions,
     legend: this.legend,
     dataLabels: this.dataLabels,
     stroke: this.stroke,
      colors: ['#ff2b2b','#ff5252', '#ffa21d','#11c15b'],
      series: [],
      xaxis: this.xaxis
    };

    public componentChart = {
      chart: this.chart,
      plotOptions: this.plotOptions,
      legend: this.legend,
      dataLabels: this.dataLabels,
      stroke: this.stroke,
      colors: ['#ff2b2b','#ff5252', '#ffa21d','#00acc1','#00e396' ],//,'#11c15b'
      series: [],
      xaxis: this.xaxis
    };

    public assetChart = {
      chart: this.chart,
      plotOptions: this.plotOptions,
      legend: this.legend,
      dataLabels: this.dataLabels,
      stroke: this.stroke,
      colors: ['#11c15b','#4680ff', '#ffa21d'],
      series: [],
      xaxis: this.xaxis
    };


}
