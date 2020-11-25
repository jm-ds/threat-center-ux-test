import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskComponent } from '@app/threat-center/shared/task/task.component';
import { Scan, Project } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { StateService } from '@app/threat-center/shared/services/state.service';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';
import { ApexChartService } from '@app/theme/shared/components/chart/apex-chart/apex-chart.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ChartDB } from '../../../fack-db/chart-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'project-dashboard',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private stateService: StateService,
    private route: ActivatedRoute,
    public apexEvent: ApexChartService,
    private modalService: NgbModal) {
    this.chartDB = ChartDB;
  }

  public chartDB: any;
  obsProject: Observable<Project>;
  //selectedScan:Scan;
  projectId: string;
  errorMsg: string;

  columns = ['Version', 'Branch', 'Tag', 'Created', 'Vulnerabilities', 'Licenses', 'Components', 'Embedded'];
  tabDataCount = undefined;
  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    console.log(this.projectId);
    if (!this.obsProject) {
      console.log("Loading ScansComponent");
      this.obsProject = this.apiService.getProject(this.projectId)
        .pipe(map(result => result.data.project));

      this.stateService.obsProject = this.obsProject;
      this.stateService.project_tabs_selectedTab = "scan";
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

      let partialAssetLeakes = [];
      let assetLeakes = [];
      let projectLeakes = [];

      for (let i = 9; i >= 0; i--) {
        let edge = project.scans.edges[i];
        if (edge) {
          let scan = edge.node;
          if (scan && scan.scanMetrics) {
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

            partialAssetLeakes.push(5);
            assetLeakes.push(5);
            projectLeakes.push(5);
            // categories for bar charts
            //let cat = scan.branch.concat(' ').concat(formatDate(scan.created,'dd/MM/yyyy','en-US'));
            categories.push(scan.branch);
          }
        }
      }


      // set vulnerabilityChart data
      this.vulnerabilityChart.series.push({ name: 'Critical', data: critical, colorClass: "red", hover: false });
      this.vulnerabilityChart.series.push({ name: 'High', data: high, colorClass: "orange", hover: false });
      this.vulnerabilityChart.series.push({ name: 'Medium', data: medium, colorClass: "yellow", hover: false });
      this.vulnerabilityChart.series.push({ name: 'Low', data: low, colorClass: "lgt-blue", hover: false });
      this.vulnerabilityChart.series.push({ name: 'Info', data: info, colorClass: "green", hover: false });

      // set licenseChart data
      this.licenseChart.series.push({ name: 'CL Strong', data: copyleftStrong, colorClass: "red", hover: false });
      this.licenseChart.series.push({ name: 'CL Weak', data: copyleftWeak, colorClass: "orange", hover: false });
      this.licenseChart.series.push({ name: 'CL Partial', data: copyleftPartial, colorClass: "yellow", hover: false });
      this.licenseChart.series.push({ name: 'CL Limited', data: copyleftLimited, colorClass: "lgt-blue", hover: false });
      this.licenseChart.series.push({ name: 'Copyleft', data: copyleft, colorClass: "green", hover: false });
      this.licenseChart.series.push({ name: 'Custom', data: custom, colorClass: "pink", hover: false });
      this.licenseChart.series.push({ name: 'Dual', data: dual, colorClass: "white", hover: false });
      this.licenseChart.series.push({ name: 'Permissive', data: permissive, colorClass: "blue", hover: false });

      // set componentChart data
      this.componentChart.series.push({ name: 'Not Latest', data: notLatest, colorClass: "red", hover: false });
      this.componentChart.series.push({ name: 'Vulnerabilities', data: vulnerabilities, colorClass: "orange", hover: false });
      this.componentChart.series.push({ name: 'Risky Licenses', data: riskyLicenses, colorClass: "yellow", hover: false });

      // set assetChart data
      this.assetChart.series.push({ name: 'Analyzed', data: analyzed, colorClass: "green", hover: false });
      this.assetChart.series.push({ name: 'Skipped', data: skipped, colorClass: "lgt-blue", hover: false });
      this.assetChart.series.push({ name: 'Embedded', data: embedded, colorClass: "yellow", hover: false });

      //set sourceCode Leak data
      this.sourceCodeLeakChart.series.push({ name: "Partial Asset Leaks", data: partialAssetLeakes, colorClass: "blue", hover: false });
      this.sourceCodeLeakChart.series.push({ name: "Asset Leaks", data: assetLeakes, colorClass: "white", hover: false });
      this.sourceCodeLeakChart.series.push({ name: "Project Leaks", data: projectLeakes, colorClass: "green", hover: false });

      // set categories on bar charts
      this.xaxis.categories = categories;

    });
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.project_tabs_selectedTab = $event.nextId;
  }

  rowUnselect($event: any) {
    // prevent unselect row
    this.stateService.selectedScan = $event.data;
  }

  chart = {
    height: 160,
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
      columnWidth: '65%',
      distributed: false
    },
  };

  legend = {
    show: false,
    position: 'top',
    horizontalAlign: 'center',
    offsetX: 0,
    offsetY: 0,
    fontSize: '0px',
    //width: 500,
    itemMargin: {
      horizontal: 0,
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
    colors: ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396'],//,'#11c15b'
    series: [],
    xaxis: this.xaxis,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + "(" + data + ")</li>";
        }
        let orgData = 0;
        if (!!w.config.series[seriesIndex].data && w.config.series[seriesIndex].data.length >= 1) {
          orgData = w.config.series[seriesIndex].data[dataPointIndex];
        }
        return (
          '<div class=" arrow_box chart-overlay">' +
          "<span class='active-fig'>" +
          w.config.series[seriesIndex].name +
          ": " +
          orgData +
          "</span>" +
          "<ul class='chart-all-lgnd'>" + str + "</ul>" +
          "</div>"
        );
      }
    }
  };

  public licenseChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396', '#c71585', '#f8f8ff', '#4680ff'],
    series: [],
    xaxis: this.xaxis,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + "(" + data + ")</li>";
        }
        let orgData = 0;
        if (!!w.config.series[seriesIndex].data && w.config.series[seriesIndex].data.length >= 1) {
          orgData = w.config.series[seriesIndex].data[dataPointIndex];
        }
        return (
          '<div class=" arrow_box chart-overlay">' +
          "<span class='active-fig'>" +
          w.config.series[seriesIndex].name +
          ": " +
          orgData +
          "</span>" +
          "<ul class='chart-all-lgnd'>" + str + "</ul>" +
          "</div>"
        );
      }
    }
  };

  public componentChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396'],//,'#11c15b'
    series: [],
    xaxis: this.xaxis,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + "(" + data + ")</li>";
        }
        let orgData = 0;
        if (!!w.config.series[seriesIndex].data && w.config.series[seriesIndex].data.length >= 1) {
          orgData = w.config.series[seriesIndex].data[dataPointIndex];
        }
        return (
          '<div class=" arrow_box chart-overlay">' +
          "<span class='active-fig'>" +
          w.config.series[seriesIndex].name +
          ": " +
          orgData +
          "</span>" +
          "<ul class='chart-all-lgnd'>" + str + "</ul>" +
          "</div>"
        );
      }
    }
  };

  public assetChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#11c15b', '#00acc1', '#ffa21d'],
    series: [],
    xaxis: this.xaxis,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + "(" + data + ")</li>";
        }
        let orgData = 0;
        if (!!w.config.series[seriesIndex].data && w.config.series[seriesIndex].data.length >= 1) {
          orgData = w.config.series[seriesIndex].data[dataPointIndex];
        }
        return (
          '<div class=" arrow_box chart-overlay">' +
          "<span class='active-fig'>" +
          w.config.series[seriesIndex].name +
          ": " +
          orgData +
          "</span>" +
          "<ul class='chart-all-lgnd'>" + str + "</ul>" +
          "</div>"
        );
      }
    }
  };

  public sourceCodeLeakChart = {
    chart: this.chart,
    plotOptions: this.plotOptions,
    legend: this.legend,
    dataLabels: this.dataLabels,
    stroke: this.stroke,
    colors: ['#4680ff', '#f8f8ff', '#00e396'],
    series: [],
    xaxis: this.xaxis,
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + "(" + data + ")</li>";
        }
        let orgData = 0;
        if (!!w.config.series[seriesIndex].data && w.config.series[seriesIndex].data.length >= 1) {
          orgData = w.config.series[seriesIndex].data[dataPointIndex];
        }
        return (
          '<div class=" arrow_box chart-overlay">' +
          "<span class='active-fig'>" +
          w.config.series[seriesIndex].name +
          ": " +
          orgData +
          "</span>" +
          "<ul class='chart-all-lgnd'>" + str + "</ul>" +
          "</div>"
        );
      }
    }
  };
  
  getAdditionData(data) {
    if (!!data && data.length >= 1) {
        return data[0];
      //return data.reduce((prev, next) => prev + (+next), 0);
    } else {
      return 0;
    }
  }

   //fired when getting data from child component
   acceptData(dataCount) {
    this.tabDataCount = dataCount;
  }

  openErrorMsg(content, errorMsg:string) {
    // open error messages
    this.errorMsg = errorMsg;
    this.modalService.open(content);
  }
}
