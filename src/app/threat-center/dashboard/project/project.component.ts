import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { StateService } from '@app/threat-center/shared/services/state.service';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';
import { ApexChartService } from '@app/theme/shared/components/chart/apex-chart/apex-chart.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ChartDB } from '../../../fack-db/chart-data';
import { MatPaginator } from '@angular/material';
import { ProjectDashboardService } from '../services/project.service';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { ScanHelperService } from '../services/scan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HostListener } from '@angular/core';
import { ScanAssetsComponent } from './scanasset/scanassets/scanassets.component';
import * as _ from 'lodash';
import { Project } from '@app/models';

@Component({
  selector: 'project-dashboard',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, AfterViewInit, OnDestroy {

  colorsClass = ['red', 'orange', 'yellow', 'lgt-blue', 'green', 'pink', 'white', 'blue'];
  constructor(
    private apiService: ApiService,
    private stateService: StateService,
    private route: ActivatedRoute,
    public apexEvent: ApexChartService,
    private projectDashboardService: ProjectDashboardService,
    private coreHelperService: CoreHelperService,
    private scanHelperService: ScanHelperService,
    private router: Router,
    private modalService: NgbModal) {
    this.chartDB = ChartDB;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.scanHelperService.isHighlightNewScanObservable$
      .subscribe(x => {
        this.isHighlightNewScan = x;
        if (x == true) {
          // get new scan and highlight it.
          this.getProjectScanData();
        }
      });

    if (!!this.router.getCurrentNavigation() && !!this.router.getCurrentNavigation().extras && !!this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;

      if (!!state && !!state["from"] && state["from"] === 'DIALOG') {
        this.isScrollToTabs = true;
      }
    }
  }
  ngOnDestroy(): void {
    this.scanHelperService.updateIsHighlightNewScan(false);
    this.highlitedScanId = "";
  }

  ngAfterViewInit(): void {
    if (this.isScrollToTabs) {
      const ele = document.getElementById("tabPanels");
      ele.scrollIntoView({ block: 'nearest' });
    }
  }


  public chartDB: any;
  obsProject: Observable<Project>;
  //selectedScan:Scan;
  projectId: string;
  errorMsg: string;
  log: string;

  columns = ['Version', 'Branch', 'Tag', 'Created', 'Vulnerabilities', 'Licenses', 'Components', 'Embedded'];
  tabDataCount = undefined;

  vulnerabilityCount = 0;
  componentCount = 0;
  licensesCount = 0;
  copyrightCount = 9;
  assetCount = 0;
  sourceCodeAssetcount = 0;

  defaultPageSize = 25;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  projectDetails = null;
  scanList = [];

  vulScanData: any = {};
  componentScanData: any = {};
  licensesScanData: any = {};
  assetScanData: any = {};

  isHighlightNewScan: boolean = false;
  highlitedScanId: string = "";
  isScrollToTabs: boolean = false;

  scrollX;
  scrollY;
  isAssetStory: boolean = false;
  @ViewChild(ScanAssetsComponent, { static: false }) child: ScanAssetsComponent;
  projectMetrics = [];

  ngOnInit() {
    this.obsProject = this.route.data
      .pipe(map(res => res.project.data.project));
    this.initProjectData();
    this.stateService.project_tabs_selectedTab = "scan";
    this.route.data.subscribe(projData => {
      if (!!projData.otherComponentData && projData.otherComponentData.length >= 1) {
        this.populateScanComponents(projData.otherComponentData);
        this.populateDataForTotalCountsOfMetrics(projData.otherComponentData);
      }
    });

    this.projectId = this.route.snapshot.paramMap.get('projectId');
    console.log(this.projectId);
    if (!this.obsProject) {
      console.log("Loading ScansComponent");
      this.obsProject = this.apiService.getProject(this.projectId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Scan")))
        .pipe(map(result => result.data.project));

      this.stateService.obsProject = this.obsProject;
    }
    this.subscribeProjectData();
    this.getLastTabSelected();
    this.defaultPageSize = this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Scan");
  }

  subscribeProjectData() {
    //this.obsProject.subscribe(project => {this.selectedScan = project.scans[0];});
  }

  private getProperties(objArray, metricsObjName) {
    let properties = [];
    this.projectMetrics.forEach(d => {
      if (d[objArray]) {
        const obj = d[objArray];
        if (!!obj[metricsObjName]) {
          Object.keys(obj[metricsObjName]).forEach(p => {
            if (!properties.includes(p)) {
              properties.push(p);
            }
          });
        }
      }
    });
    return properties;
  }

  private initComponentchart() {
    const properties = this.getProperties('componentMetrics', 'vulnerabilityMetrics');
    this.componentChart.series = [];
    properties.forEach((key, index) => {
      this.componentChart.series.push(
        {
          data: this.projectMetrics.map(val => val['componentMetrics'].vulnerabilityMetrics[key]),
          name: _.upperFirst(_.camelCase(key)),
          hover: false,
          colorClass: this.colorsClass[index]
        }
      )
    });
  }
  public getProjectScanData() {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    const obsProject = this.apiService.getProject(this.projectId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Scan")))
      .pipe(map(result => result.data.project));
    obsProject.subscribe(project => {
      this.scanList = project.scans.edges;
      this.projectDetails = project;
      this.stateService.obsProject = obsProject;
      this.stateService.selectedScan = project.scans.edges[0];
      this.highlitedScanId = project.scans.edges[0].node.scanId;
    });
  }


  initProjectData() {
    this.stateService.obsProject = this.obsProject;
    this.obsProject.subscribe((project: any) => {
      this.coreHelperService.settingProjectBreadcum("Project", project.name, project.projectId, false);
      //Taking sacn list to show in scan tab
      this.scanList = project.scans.edges;
      this.projectDetails = project;

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
      let openSource = [];
      let unique = [];
      this.projectMetrics = project.projectMetricsGroup.projectMetrics;
      this.initComponentchart();
      for (let i = 0; i <= project.scans.edges.length; i++) {
        let edge = project.scans.edges[i];
        if (edge) {
          const scan: any = edge.node;
          if (scan && scan.scanMetricsSummary) {
            // Vulnerability chart data

            if (!!scan.scanMetricsSummary.vulnerabilityMetrics) {
              critical.push(!!scan.scanMetricsSummary.vulnerabilityMetrics.critical ? scan.scanMetricsSummary.vulnerabilityMetrics.critical : 0);
              high.push(!!scan.scanMetricsSummary.vulnerabilityMetrics.high ? scan.scanMetricsSummary.vulnerabilityMetrics.high : 0);
              medium.push(!!scan.scanMetricsSummary.vulnerabilityMetrics.medium ? scan.scanMetricsSummary.vulnerabilityMetrics.medium : 0);
              low.push(!!scan.scanMetricsSummary.vulnerabilityMetrics.low ? scan.scanMetricsSummary.vulnerabilityMetrics.low : 0);
              info.push(!!scan.scanMetricsSummary.vulnerabilityMetrics.info ? scan.scanMetricsSummary.vulnerabilityMetrics.info : 0);
            }

            // License chart data
            if (!!scan.scanMetricsSummary.licenseMetrics) {
              copyleftStrong.push(!!scan.scanMetricsSummary.licenseMetrics.copyleftStrong ? scan.scanMetricsSummary.licenseMetrics.copyleftStrong : 0);
              copyleftWeak.push(!!scan.scanMetricsSummary.licenseMetrics.copyleftWeak ? scan.scanMetricsSummary.licenseMetrics.copyleftWeak : 0);
              copyleftPartial.push(!!scan.scanMetricsSummary.licenseMetrics.copyleftPartial ? scan.scanMetricsSummary.licenseMetrics.copyleftPartial : 0);
              copyleftLimited.push(!!scan.scanMetricsSummary.licenseMetrics.copyleftLimited ? scan.scanMetricsSummary.licenseMetrics.copyleftLimited : 0);
              copyleft.push(!!scan.scanMetricsSummary.licenseMetrics.copyleft ? scan.scanMetricsSummary.licenseMetrics.copyleft : 0);
              custom.push(!!scan.scanMetricsSummary.licenseMetrics.custom ? scan.scanMetricsSummary.licenseMetrics.custom : 0);
              dual.push(!!scan.scanMetricsSummary.licenseMetrics.dual ? scan.scanMetricsSummary.licenseMetrics.dual : 0);
              permissive.push(!!scan.scanMetricsSummary.licenseMetrics.permissive ? scan.scanMetricsSummary.licenseMetrics.permissive : 0);
            }

            // // Component chart data
            // if (!!scan.scanMetricsSummary.componentMetrics) {
            //   notLatest.push(scan.scanMetricsSummary.componentMetrics.notLatest);
            //   vulnerabilities.push(scan.scanMetricsSummary.componentMetrics.vulnerabilities);
            //   riskyLicenses.push(scan.scanMetricsSummary.componentMetrics.riskyLicenses);
            // }


            // Asset chart data
            if (!!scan.scanMetricsSummary.assetMetrics) {
              embedded.push(!!scan.scanMetricsSummary.assetMetrics.embedded ? scan.scanMetricsSummary.assetMetrics.embedded : 0);
              unique.push(!!scan.scanMetricsSummary.assetMetrics.unique ? scan.scanMetricsSummary.assetMetrics.unique : 0);
              openSource.push(!!scan.scanMetricsSummary.assetMetrics.openSource ? scan.scanMetricsSummary.assetMetrics.openSource : 0);

            }

            // categories for bar charts
            //let cat = scan.branch.concat(' ').concat(formatDate(scan.created,'dd/MM/yyyy','en-US'));
            categories.push(scan.branch);
          }
        }
      }



      // // set vulnerabilityChart data
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
      // this.componentChart.series.push({ name: 'Not Latest', data: notLatest, colorClass: "red", hover: false });
      // this.componentChart.series.push({ name: 'Vulnerabilities', data: vulnerabilities, colorClass: "orange", hover: false });
      // this.componentChart.series.push({ name: 'Risky Licenses', data: riskyLicenses, colorClass: "yellow", hover: false });

      // set assetChart data
      this.assetChart.series.push({ name: 'Embedded', data: embedded, colorClass: "green", hover: false });
      this.assetChart.series.push({ name: 'Open Source', data: openSource, colorClass: "lgt-blue", hover: false });
      this.assetChart.series.push({ name: 'Unique', data: unique, colorClass: "yellow", hover: false });
      // set categories on bar charts
      this.xaxis.categories = categories;

    });
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.project_tabs_selectedTab = $event.nextId;
    this.coreHelperService.settingUserPreference("Project", $event.activeId, $event.nextId);
  }

  rowUnselect($event: any) {
    // prevent unselect row
    this.stateService.selectedScan = $event.data;
    console.log(this.stateService.selectedScan);
  }
  onRowSelect($event) {
    this.apicallTogetCounts(this.stateService.selectedScan.node["scanId"]);
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
      show: false,
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
    noData: {
      text: "There's no data",
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '14px',
        fontFamily: undefined
      }
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + " (" + data + ")</li>";
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
    noData: {
      text: "There's no data",
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '14px',
        fontFamily: undefined
      }
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + " (" + data + ")</li>";
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
    noData: {
      text: "There's no data",
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '14px',
        fontFamily: undefined
      }
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + " (" + data + ")</li>";
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
    noData: {
      text: "There's no data",
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '14px',
        fontFamily: undefined
      }
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let str = "";
        for (let i = 0; i < w.config.series.length; i++) {
          let data = 0;
          if (!!w.config.series[i].data && w.config.series[i].data.length >= 1)
            data = w.config.series[i].data[dataPointIndex];
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + " (" + data + ")</li>";
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
          str += "<li class='" + w.config.series[i].colorClass + "'>" + w.config.series[i].name + " (" + data + ")</li>";
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
      return !!data[0] ? data[0] : 0;
      // return data[0];
      // return data.reduce((prev, next) => prev + (+next), 0);
    } else {
      return 0;
    }
  }

  //While any changes occurred in page
  changePage(pageInfo) {
    if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
      //page size changed...
      this.defaultPageSize = pageInfo.pageSize;
      //Setting item per page into session..
      this.coreHelperService.settingUserPreference("Project", null, null, { componentName: "Scan", value: pageInfo.pageSize });
      //API Call
      this.loadProjectData(Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Scan")), undefined, undefined, undefined);
      this.paginator.firstPage();
    }
    else {
      //Next and Previous changed
      if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
        //call with after...
        if (!!this.projectDetails.scans.pageInfo && this.projectDetails.scans.pageInfo['hasNextPage']) {
          this.loadProjectData(Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Scan")), undefined, this.projectDetails.scans.pageInfo['endCursor'], undefined);
        }
      } else {
        //call with before..
        if (!!this.projectDetails.scans.pageInfo && this.projectDetails.scans.pageInfo['hasPreviousPage']) {
          this.loadProjectData(undefined, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Scan")), undefined, this.projectDetails.scans.pageInfo['startCursor']);
        }
      }
    }
  }

  //Loading project data after paggination for scan tab.
  loadProjectData(first, last, endCursor = undefined, startCursor = undefined) {
    let projects = this.apiService.getProject(this.projectId, first, last, endCursor, startCursor)
      .pipe(map(result => result.data.project));
    projects.subscribe(project => {
      this.scanList = project.scans.edges;
      this.projectDetails = project;
    });
  }

  //load all metrics data after selecting scan in table.
  private apicallTogetCounts(scanId: string) {
    this.gettingDataforAllMetrics(scanId)
      .subscribe(data => {
        if (!!data && data.length >= 1) {
          this.populateDataForTotalCountsOfMetrics(data);
        }
      });
  }

  //chain of obsevables (helper function for api calls)
  private gettingDataforAllMetrics(scanId: string) {
    const res1 = this.projectDashboardService.getScanVulnerabilities(scanId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Vulnerabilities")));
    const res2 = this.projectDashboardService.getScanComponents(scanId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Components")));
    const res3 = this.projectDashboardService.getScanLicenses(scanId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Licenses")));
    const res4 = this.projectDashboardService.getScanAssets(scanId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")));
    return forkJoin([res1, res2, res3, res4]);
  }

  //Helper function which will help to populate metrics count data
  private populateDataForTotalCountsOfMetrics(data) {
    if (!!data[0]) {
      this.vulnerabilityCount = !!data[0].data ?
        data[0].data.scan.vulnerabilities['totalCount'] : this.vulnerabilityCount;
    }
    if (!!data[1]) {
      this.componentCount = !!data[1].data ?
        data[1].data.scan.components['totalCount'] : this.componentCount;
    }
    if (!!data[2]) {
      this.licensesCount = !!data[2].data ?
        data[2].data.scan.licenses['totalCount'] : this.licensesCount;
    }
    if (!!data[3]) {
      this.assetCount = !!data[3].data ?
        data[3].data.scan.scanAssets['totalCount'] : this.assetCount;
    }
  }

  private populateScanComponents(data) {
    this.vulScanData = Observable.of(data[0].data);
    this.componentScanData = Observable.of(data[1].data.scan);
    this.licensesScanData = Observable.of(data[2].data.scan);
    this.assetScanData = Observable.of(data[3].data.scan);
  }

  private getLastTabSelected() {
    this.stateService.project_tabs_selectedTab = !!this.coreHelperService.getLastTabSelectedNameByModule("Project") ? this.coreHelperService.getLastTabSelectedNameByModule("Project") : this.stateService.project_tabs_selectedTab;
  }

  openLogs(content, errorMsg: string, log: string) {
    // open logs popup
    this.errorMsg = errorMsg;
    this.log = log;
    this.modalService.open(content, { windowClass: 'md-class', centered: true });
  }

  getStory(event) {
    this.isAssetStory = event;
  }

  //Callled when component deactivate or destrory
  canDeactivate(): Observable<boolean> | boolean {
    //Need to check here is browser back button clicked or not if clicked then do below things..
    if (this.coreHelperService.getBrowserBackButton()) {
      this.coreHelperService.setBrowserBackButton(false);
      if (this.isAssetStory) {
        this.child.goBack();
        return false;
      } else {
        if (!!this.coreHelperService.getPreviousTabSelectedByModule("Project")) {
          this.stateService.project_tabs_selectedTab = this.coreHelperService.getPreviousTabSelectedByModule("Project", true);
          this.coreHelperService.settingUserPreference("Project", null, this.stateService.project_tabs_selectedTab);
          window.scroll(this.scrollX, this.scrollY);
          return false;
        } else {
          this.coreHelperService.settingUserPreference("Project", "", null);
          return true;
        }
      }
    } else {
      this.coreHelperService.settingUserPreference("Project", "", null);
      return true;
    }
  }

  //Below method will fire when click on browser back button.
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.coreHelperService.setBrowserBackButton(true);
    if (!!this.coreHelperService.getPreviousTabSelectedByModule("Project") || this.isAssetStory) {
      history.pushState(null, null, window.location.href);
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
    this.scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  }
}
