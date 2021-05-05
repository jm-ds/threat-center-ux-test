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
import { Entity, Project } from '@app/models';
import { NextConfig } from '@app/app-config';

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
  assetCount: any = 0;
  sourceCodeAssetcount = 0;
  assetCountTooltip = '';

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

      this.initProjectBradcum(project);

      //Taking sacn list to show in scan tab
      this.scanList = project.scans.edges;
      this.projectDetails = project;
      this.stateService.selectedScan = project.scans.edges[0];
      let categories = [];
      this.projectMetrics = project.projectMetricsGroup.projectMetrics;

      //Initializa all chart data.....
      //Init Vul Chart
      this.initCharts('vulnerabilityChart', 'vulnerabilityMetrics', 'severityMetrics');
      //Init component chart
      this.initCharts('componentChart', 'componentMetrics', 'vulnerabilityMetrics');
      //Init License chart
      this.initCharts('licenseChart', 'licenseMetrics', 'licenseCategoryMetrics');
      //Init Asset chart
      this.initCharts('assetChart', 'assetMetrics', 'assetCompositionMetrics');
      const assetCountData = this.getAssetcountString();
      this.assetCount = assetCountData.orgText;
      this.assetCountTooltip = assetCountData.tooltipText;

      _.each(this.projectMetrics, data => {
        this.xaxis.categories.push(data.measureDate);
      });
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


  getAssetcountString() {
    // if (!!this.assetChart && this.assetChart.series.length >= 1) {
    //   let orgtext = "";
    //   let tooltipText = "";
    //   //below line need to do because order have to be same as in the assets columns in the scan row...
    //   const data = [this.assetChart.series[2], this.assetChart.series[0], this.assetChart.series[1]];
    //   _.each(data, ser => {
    //     orgtext += ser.data[0] + '/';
    //     tooltipText += " " + ser.data[0] + ' ' + ser['name'] + ','
    //   });
    //   return { orgText: orgtext.slice(0, -1), tooltipText: tooltipText.slice(0, -1) };
    // } else {
    //   return { orgText: '0', tooltipText: '' };
    // }

    return { orgText: '0', tooltipText: '' };
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
    const res = this.projectDashboardService.getAllScanData(scanId, NextConfig.config.defaultItemPerPage, { parentScanAssetId: '', filter: '', first: Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")) });
    return forkJoin([res]);
  }

  //Helper function which will help to populate metrics count data
  private populateDataForTotalCountsOfMetrics(data) {
    if (!!data[0]) {
      this.vulnerabilityCount = data[0].data.scan.vulnerabilities['totalCount'];
      this.componentCount = data[0].data.scan.components['totalCount'];
      // this.assetCount = data[0].data.scan.scanAssetsTree['totalCount'];
      this.licensesCount = data[0].data.scan.licenses['totalCount'];
    }
  }

  private populateScanComponents(data) {
    this.vulScanData = Observable.of(data[0].data);
    this.componentScanData = Observable.of(data[0].data.scan);
    this.licensesScanData = Observable.of(data[0].data.scan);
    this.assetScanData = Observable.of(data[0].data.scan);
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
          // window.scroll(this.scrollX, this.scrollY);
          const ele = document.getElementById("chart-bl");
          ele.scrollIntoView({ block: 'end' });
          return false;
        } else {
          this.coreHelperService.settingUserPreference("Project", "", null);
          return true;
        }
      }
    } else {
      // this.coreHelperService.settingUserPreference("Project", "", null);
      return true;
    }
  }

  //Get Prperty names below method will going to return array of perperties.
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

  //Initialize chart dynamically
  private initCharts(chartVarName: string, propFirstPara: string, propSecondPara: string) {
    const properties = this.getProperties(propFirstPara, propSecondPara);
    this[chartVarName].series = [];
    properties.forEach((key, index) => {
      this[chartVarName].series.push(
        {
          data: this.projectMetrics.map(val => { const propData = val[propFirstPara]; const propSData = propData[propSecondPara]; return propSData[key]; }),
          name: _.upperFirst(_.camelCase(key)),
          hover: false,
          colorClass: this.colorsClass[index]
        }
      )
    });
  }

  private initProjectBradcum(project) {
    //if project breadcum data has not been saved to storage then store it to storage
    if (!this.coreHelperService.getProjectBreadcum()) {
      this.projectDashboardService.getEntity(project.entityId)
        .pipe(map(res => res.data.entity))
        .subscribe((entity: Entity) => {
          this.coreHelperService.settingProjectBreadcum("Entity", entity.name, entity.entityId, false);
          this.coreHelperService.settingProjectBreadcum("Project", project.name, project.projectId, false);
        });
    } else {
      this.coreHelperService.settingProjectBreadcum("Project", project.name, project.projectId, false);
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
