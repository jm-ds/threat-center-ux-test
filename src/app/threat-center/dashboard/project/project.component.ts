import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApexChartService } from '@app/theme/shared/components/chart/apex-chart/apex-chart.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HostListener } from '@angular/core';
import { ScanAssetsComponent } from './scanasset/scanassets/scanassets.component';
import * as _ from 'lodash';
import { Entity, Project } from '@app/models';
import { NextConfig } from '@app/app-config';
import { UserPreferenceService } from '@app/services/core/user-preference.service';
import { ProjectBreadcumsService } from '@app/services/core/project-breadcums.service';
import { ChartHelperService } from '@app/services/core/chart-helper.service';
import { ClipboardDialogComponent } from "@app/threat-center/dashboard/project/clipboard-dialog/clipboard-dialog.component";
import { AuthorizationService } from '@app/security/services';
import { ProjectService } from '@app/services/project.service';
import { ProjectDashboardService } from '@app/services/project-dashboard.service';
import { ScanHelperService } from '@app/services/scan-helper.service';
import { StateService } from '@app/services/state.service';


@Component({
  selector: 'project-dashboard',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, AfterViewInit, OnDestroy {

  colorsClass = ['red', 'orange', 'yellow', 'lgt-blue', 'green', 'pink', 'white', 'blue'];
  vulLabelSeq = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  isDisablePaggination: boolean = false;
  panelActiveId: string = 'chart-panel';
  constructor(
    // private apiService: ApiService,
    private projectService: ProjectService,
    public stateService: StateService,
    private route: ActivatedRoute,
    public apexEvent: ApexChartService,
    private projectDashboardService: ProjectDashboardService,
    private coreHelperService: CoreHelperService,
    private scanHelperService: ScanHelperService,
    private router: Router,
    private modalService: NgbModal,
    private userPreferenceService: UserPreferenceService,
    private projectBreadcumsService: ProjectBreadcumsService,
    private chartHelperService: ChartHelperService,
    public authorizationService: AuthorizationService) {
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
    this.userPreferenceService.settingUserPreference("Project", null, null, null,
      this.panelActiveId, null, null, this.stateService.selectedScan.node.scanId);
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

  columns = ['ID', 'Commit', 'Branch', 'Tag', 'Created', 'Vulnerabilities', 'Licenses', 'Components', 'Embedded'];
  tabDataCount = undefined;

  vulnerabilityCount = 0;
  componentCount = 0;
  licensesCount = 0;
  copyrightCount = 9;
  assetCount: any = 0;
  sourceCodeAssetcount = 0;
  assetCountTooltip = '';

  defaultPageSize = 25;
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
  @ViewChild(ScanAssetsComponent) child: ScanAssetsComponent;
  projectMetrics = [];
  filterBranchName = '';
  timeOut;
  timeOutDuration = 1000;
  projectTagInputValue = "";

  ngOnInit() {
    this.initProjectsChartConfig();
    this.obsProject = this.route.data
      .pipe(map(res => res.project.data.project));
    this.initProjectData();
    this.stateService.project_tabs_selectedTab = "scan";
    this.route.data.subscribe(projData => {
      if (!!projData.otherComponentData && projData.otherComponentData.length >= 1) {
        this.populateScanComponents(projData.otherComponentData);
        this.populateDataForTotalCountsOfMetrics(projData.otherComponentData);

        // if previously any scan selected then get counts of all components, licens eand assets...
        const lastScanSelected = this.userPreferenceService.getLastScanSelectedByModule("Project");
        if (!!this.stateService.selectedScan.node["scanId"]) {
          this.obsProject.subscribe((project: any) => {
            const scan = project.scans.edges.find(d => { return d.node.scanId === this.stateService.selectedScan.node["scanId"] });
            this.apicallTogetCounts(this.stateService.selectedScan.node["scanId"]);
            if (!!scan.node && !!scan.node.scanMetricsSummary && !!scan.node.scanMetricsSummary.assetMetrics) {
              const embededItem = !!scan.node.scanMetricsSummary.assetMetrics["embedded"] ? scan.node.scanMetricsSummary.assetMetrics["embedded"] : '0';
              const openSource = !!scan.node.scanMetricsSummary.assetMetrics["openSource"] ? scan.node.scanMetricsSummary.assetMetrics["openSource"] : '0';
              const unique = !!scan.node.scanMetricsSummary.assetMetrics["unique"] ? scan.node.scanMetricsSummary.assetMetrics["unique"] : '0';
              this.assetCount = embededItem + '/' + openSource + '/' + unique;
              this.assetCountTooltip = embededItem + ' embedded, ' + openSource + ' openSource, ' + unique + ' unique';
            } else { }
          });
        }
      }
    });

    this.projectId = this.route.snapshot.paramMap.get('projectId');
    console.log(this.projectId);
    if (!this.obsProject) {
      console.log("Loading ScansComponent");
      this.obsProject = this.projectService.getProject(this.projectId, this.filterBranchName, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Scan")))
        .pipe(map(result => result.data.project));

      this.stateService.obsProject = this.obsProject;
    }
    this.getLastTabSelected();
    this.defaultPageSize = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Scan");
    this.initChartPreference();
  }

  toggleAccordian(event) {
    this.panelActiveId = this.panelActiveId == event.panelId ? "" : event.panelId;
  }

  initChartPreference() {
    const detail = this.userPreferenceService.getPanelDetailByModule("Project");
    if (!!detail) {
      this.panelActiveId = detail.panelActiveId !== null && detail.panelActiveId !== undefined ? detail.panelActiveId : this.panelActiveId;
    }
  }

  public getProjectScanData(idElement: string = '') {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    const obsProject = this.projectService.getProject(this.projectId, this.filterBranchName, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Scan")))
      .pipe(map(result => result.data.project));
    obsProject.subscribe(project => {
      this.scanList = project.scans.edges;
      this.projectDetails = project;
      this.stateService.obsProject = obsProject;
      this.stateService.selectedScan = project.scans.edges[0];
      this.highlitedScanId = project.scans.edges[0].node.scanId;
      this.coreHelperService.setFocusOnElement(idElement);
    });
  }


  initProjectData() {
    this.stateService.obsProject = this.obsProject;
    this.obsProject.subscribe((project: any) => {

      this.initProjectBradcum(project);

      //Taking sacn list to show in scan tab
      this.scanList = project.scans.edges;
      this.projectDetails = project;
      const lastScanSelected = this.userPreferenceService.getLastScanSelectedByModule("Project");
      // this.stateService.selectedScan = !!lastScanSelected && !!lastScanSelected.lastSelectedScanId ?  project.scans.edges.find(d => { return d.node.scanId === lastScanSelected.lastSelectedScanId }) : project.scans.edges[0];
      if (!!lastScanSelected && !!lastScanSelected.lastSelectedScanId && project.scans.edges.find(d => { return d.node.scanId === lastScanSelected.lastSelectedScanId })) {
        this.stateService.selectedScan = project.scans.edges.find(d => { return d.node.scanId === lastScanSelected.lastSelectedScanId })
      } else {
        this.stateService.selectedScan = project.scans.edges[0];
      }
      let categories = [];
      if (!!project.projectMetricsGroup.projectMetrics && project.projectMetricsGroup.projectMetrics.length >= 1) {
        this.projectMetrics = project.projectMetricsGroup.projectMetrics.sort(function (a, b) { return Number(new Date(a.measureDate)) - Number(new Date(b.measureDate)) });
      }
      _.each(this.projectMetrics, data => {
        this.xaxis.categories.push(this.getFormattedDate(new Date(data.measureDate)));
      });

      //Initializa all chart data.....
      //Init Vul Chart
      this.initCharts('vulnerabilityChart', 'vulnerabilityMetrics', 'severityMetrics', this.vulLabelSeq);
      //Init component chart
      this.initCharts('componentChart', 'componentMetrics', 'vulnerabilityMetrics', this.vulLabelSeq);
      //Init License chart
      this.initCharts('licenseChart', 'licenseMetrics', 'licenseCategoryMetrics', null);
      //Init Asset chart
      this.initCharts('assetChart', 'assetMetrics', 'assetCompositionMetrics', null);
      const assetCountData = this.getAssetcountString();
      this.assetCount = assetCountData.orgText;
      this.assetCountTooltip = assetCountData.tooltipText;
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.project_tabs_selectedTab = $event.nextId;
    this.userPreferenceService.settingUserPreference("Project", $event.activeId, $event.nextId, null, null, null, null, this.stateService.selectedScan.node.scanId);
    if ($event.nextId === 'scan') {
      this.initProjectsChartConfig();
      this.obsProject = this.projectService.getProject(this.projectId, this.filterBranchName, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Scan")))
        .pipe(map(result => result.data.project));
      this.initProjectData();

      // if previously any scan selected then get counts of all components, licens eand assets...
      const lastScanSelected = this.userPreferenceService.getLastScanSelectedByModule("Project");
      this.obsProject.subscribe((data: any) => {
        if (!!data.scans && data.scans.edges.length >= 1 && !!data.scans.edges[0]) {

          const scan = data.scans.edges.find(d => { return d.node.scanId === lastScanSelected.lastSelectedScanId });
          this.apicallTogetCounts(this.stateService.selectedScan.node.scanId);
          if (!!scan.node && !!scan.node.scanMetricsSummary && !!scan.node.scanMetricsSummary.assetMetrics) {
            const embededItem = !!scan.node.scanMetricsSummary.assetMetrics["embedded"] ? scan.node.scanMetricsSummary.assetMetrics["embedded"] : '0';
            const openSource = !!scan.node.scanMetricsSummary.assetMetrics["openSource"] ? scan.node.scanMetricsSummary.assetMetrics["openSource"] : '0';
            const unique = !!scan.node.scanMetricsSummary.assetMetrics["unique"] ? scan.node.scanMetricsSummary.assetMetrics["unique"] : '0';
            this.assetCount = embededItem + '/' + openSource + '/' + unique;
            this.assetCountTooltip = embededItem + ' embedded, ' + openSource + ' openSource, ' + unique + ' unique';
          } else { }

        }
      });
    }
  }

  rowUnselect($event: any) {
    // prevent unselect row
    this.stateService.selectedScan = $event.data;
    console.log(this.stateService.selectedScan);
  }

  onRowSelect($event) {
    this.apicallTogetCounts(this.stateService.selectedScan.node["scanId"]);
    if (!!$event.data && !!$event.data.node.scanMetricsSummary && !!$event.data.node.scanMetricsSummary.assetMetrics) {
      const embededItem = !!$event.data.node.scanMetricsSummary.assetMetrics["embedded"] ? $event.data.node.scanMetricsSummary.assetMetrics["embedded"] : '0';
      const openSource = !!$event.data.node.scanMetricsSummary.assetMetrics["openSource"] ? $event.data.node.scanMetricsSummary.assetMetrics["openSource"] : '0';
      const unique = !!$event.data.node.scanMetricsSummary.assetMetrics["unique"] ? $event.data.node.scanMetricsSummary.assetMetrics["unique"] : '0';
      this.assetCount = embededItem + '/' + openSource + '/' + unique;
      this.assetCountTooltip = embededItem + ' embedded, ' + openSource + ' openSource, ' + unique + ' unique';
    } else { }
  }

  chart;

  plotOptions;

  legend;

  dataLabels;

  stroke;

  xaxis;


  public vulnerabilityChart;

  public licenseChart;

  public componentChart;

  public assetChart;

  public initProjectsChartConfig() {
    this.chart = {
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

    this.plotOptions = {
      bar: {
        horizontal: false,
        columnWidth: '65%',
        distributed: false
      },
    };

    this.legend = {
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

    this.dataLabels = {
      enabled: false
    };

    this.stroke = {
      show: true,
      width: 1,
      colors: ['#fff']
    };

    this.xaxis = {
      categories: [],
      labels: {
        show: true,
        rotate: -45,
      },
    };

    this.vulnerabilityChart = {
      chart: this.chart,
      plotOptions: this.plotOptions,
      legend: this.legend,
      dataLabels: this.dataLabels,
      stroke: this.stroke,
      colors: ['#ff2b2b', '#ff5252', '#ff701d', '#ffa21d', '#00e396'],//,'#11c15b'
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

    this.licenseChart = {
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

    this.componentChart = {
      chart: this.chart,
      plotOptions: this.plotOptions,
      legend: this.legend,
      dataLabels: this.dataLabels,
      stroke: this.stroke,
      colors: ['#ff2b2b', '#ff5252', '#ff701d', '#ffa21d', '#00e396'],//,'#11c15b'
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

    this.assetChart = {
      chart: this.chart,
      plotOptions: this.plotOptions,
      legend: this.legend,
      dataLabels: this.dataLabels,
      stroke: this.stroke,
      colors: ['#00acc1', '#ffa21d', '#11c15b'],
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
  }

  // While any changes occurred in page
  changePage(pageInfo) {
    this.isDisablePaggination = true;
    if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
      //page size changed...
      this.defaultPageSize = pageInfo.pageSize;
      //Setting item per page into session..
      this.userPreferenceService.settingUserPreference("Project", null, null, { componentName: "Scan", value: pageInfo.pageSize });
      //API Call
      this.loadProjectData(Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Scan")), undefined, undefined, undefined);
      this.paginator.firstPage();
    }
    else {
      //Next and Previous changed
      if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
        //call with after...
        if (!!this.projectDetails.scans.pageInfo && this.projectDetails.scans.pageInfo['hasNextPage']) {
          this.loadProjectData(Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Scan")), undefined, this.projectDetails.scans.pageInfo['endCursor'], undefined);
        }
      } else {
        //call with before..
        if (!!this.projectDetails.scans.pageInfo && this.projectDetails.scans.pageInfo['hasPreviousPage']) {
          this.loadProjectData(undefined, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Scan")), undefined, this.projectDetails.scans.pageInfo['startCursor']);
        }
      }
    }
  }

  // Loading project data after pagination for scan tab.
  loadProjectData(first, last, endCursor = undefined, startCursor = undefined) {
    let projects = this.projectService.getProject(this.projectId, this.filterBranchName, first, last, endCursor, startCursor)
      .pipe(map(result => result.data.project));
    projects.subscribe(project => {
      this.scanList = project.scans.edges;
      this.projectDetails = project;
      this.isDisablePaggination = false;
    });
  }

  getAssetcountString() {
    if (!!this.assetChart && this.assetChart.series.length >= 1 && !!this.projectMetrics && this.projectMetrics.length >= 1) {
      return this.getSequenceWiseAssets();
    } else {
      return { orgText: '0', tooltipText: '' };
    }
  }

  //need to get assets sequence wise
  private getSequenceWiseAssets() {
    const metrics = this.projectMetrics.sort(function (a, b) { return Number(new Date(b.measureDate)) - Number(new Date(a.measureDate)) });
    const embededItem = !!metrics[0].assetMetrics.assetCompositionMetrics['EMBEDDED'] ? metrics[0].assetMetrics.assetCompositionMetrics['EMBEDDED'] : '0';
    const openSource = !!metrics[0].assetMetrics.assetCompositionMetrics['OPEN_SOURCE'] ? metrics[0].assetMetrics.assetCompositionMetrics['OPEN_SOURCE'] : '0';
    const unique = !!metrics[0].assetMetrics.assetCompositionMetrics['UNIQUE'] ? metrics[0].assetMetrics.assetCompositionMetrics['UNIQUE'] : '0';
    return { orgText: embededItem + '/' + openSource + '/' + unique, tooltipText: embededItem + ' embedded, ' + openSource + ' openSource, ' + unique + ' unique' }
  }

  //load all metrics data after selecting scan in table.
  private apicallTogetCounts(scanId: string) {
    this.gettingDataforAllMetrics(scanId)
      .subscribe(data => {
        if (!!data && data.length >= 1) {
          this.populateScanComponents(data);
          this.populateDataForTotalCountsOfMetrics(data);
        }
      });
  }

  //chain of obsevables (helper function for api calls)
  private gettingDataforAllMetrics(scanId: string) {
    const componentPage = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Components");
    const vulPage = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Vulnerabilities");
    const licensePage = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses");
    const res = this.projectDashboardService.getAllScanData(scanId, NextConfig.config.defaultItemPerPage, { parentScanAssetId: '', filter: '', first: Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")) }, componentPage, vulPage, licensePage);
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
    this.vulScanData = of(data[0].data);
    this.componentScanData = of(data[0].data.scan);
    this.licensesScanData = of(data[0].data.scan);
    this.assetScanData = of(data[0].data.scan);
  }

  private getLastTabSelected() {
    this.stateService.project_tabs_selectedTab = !!this.userPreferenceService.getLastTabSelectedNameByModule("Project") ? this.userPreferenceService.getLastTabSelectedNameByModule("Project") : this.stateService.project_tabs_selectedTab;
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
        if (!!this.userPreferenceService.getPreviousTabSelectedByModule("Project")) {
          this.stateService.project_tabs_selectedTab = this.userPreferenceService.getPreviousTabSelectedByModule("Project", true);
          this.userPreferenceService.settingUserPreference("Project", null, this.stateService.project_tabs_selectedTab);
          // window.scroll(this.scrollX, this.scrollY);
          const ele = document.getElementById("chart-bl");
          ele.scrollIntoView({ block: 'end' });
          return false;
        } else {
          this.userPreferenceService.settingUserPreference("Project", "", null);
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
  private initCharts(chartVarName: string, propFirstPara: string, propSecondPara: string, proper = null) {
    let properties = [];
    if (!!proper) {
      properties = proper;
    } else {
      if (propFirstPara === 'assetMetrics') {
        properties = ["EMBEDDED", "OPEN_SOURCE", "UNIQUE"];
      } else {
        if (propFirstPara === 'licenseMetrics') {
          properties = this.getProperties(propFirstPara, propSecondPara);
          if (!properties || properties.length === 0) {
            properties = ['PERMISSIVE'];
          }
        } else {
          properties = this.getProperties(propFirstPara, propSecondPara);
        }

      }
    }
    this[chartVarName].series = [];
    properties.forEach((key, index) => {
      this[chartVarName].series.push(
        {
          data: this.projectMetrics.map(val => {
            const propData = val[propFirstPara];
            const propSData = propData[propSecondPara];
            return !!propSData[key] ? propSData[key] : 0;
          }),
          name: _.upperFirst(_.camelCase(key)),
          hover: false,
          colorClass: !!this.chartHelperService.getProjectPageColorCodeByLabel(key) ? this.chartHelperService.getProjectPageColorCodeByLabel(key) : this.colorsClass[index],
        }
      )
    });
    this[chartVarName].xaxis = this.xaxis;
    if (chartVarName === 'licenseChart') {
      this[chartVarName].colors = [];
      _.each(properties, p => {
        this[chartVarName].colors.push(this.chartHelperService.getColorByLabel(p));
      });
    }
  }

  private initProjectBradcum(project) {
    //if project breadcum data has not been saved to storage then store it to storage
    if (!this.projectBreadcumsService.getProjectBreadcum()) {
      this.projectDashboardService.getEntity(project.entityId)
        .pipe(map(res => res.data.entity))
        .subscribe((entity: Entity) => {
          this.projectBreadcumsService.settingProjectBreadcum("Entity", entity.name, entity.entityId, false);
          this.projectBreadcumsService.settingProjectBreadcum("Project", project.name, project.projectId, false);
        });
    } else {
      this.projectBreadcumsService.settingProjectBreadcum("Project", project.name, project.projectId, false);
    }
  }

  private getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  //Below method will fire when click on browser back button.
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.coreHelperService.setBrowserBackButton(true);
    if (!!this.userPreferenceService.getPreviousTabSelectedByModule("Project") || this.isAssetStory) {
      history.pushState(null, null, window.location.href);
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
    this.scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  }

  // open project tags popup
  openProjectTagDialog(content: any) {
    this.modalService.open(content, { windowClass: 'md-class', centered: true });
  }

  // remove project tag handler
  removeProjectTag(project: Project, tag: string) {
    if (!!project.tags) {
      let ind = project.tags.indexOf(tag);
      if (ind > -1) {
        project.tags.splice(ind, 1);
      }
    }
  }

  // add project tag handler
  addProjectTagHandler(project: Project, event: any) {
    this.addProjectTag(project, event.value);
    event.input.value = "";
  }

  // add project tag
  addProjectTag(project: Project, tag: string) {
    if (!tag) {
      return;
    }
    let tags = tag.split(",").map(item => item.trim()).filter(item => item.length > 0);
    if (!project.tags || project.tags.length === 0) {
      project.tags = tags;
    } else {
      tags.forEach(tag => {
        if (project.tags.indexOf(tag) === -1) {
          project.tags.push(tag);
        }
      });
    }
  }

  // save project tags
  setProjectTags(project: Project) {
    if (!!this.projectTagInputValue) {
      this.addProjectTag(project, this.projectTagInputValue);
      this.projectTagInputValue = "";
    }
    project.tags = project.tags.filter(item => item.trim().length > 0);
    this.projectDashboardService.setProjectTags(project.projectId, project.tags).subscribe(() => { }, (error) => {
      console.error('Error', error);
    });
  }

  /**
   * Filter by column
   *
   * @param event input event
   * @param idElement element ID
   */
  onFilterColumn(event: Event, idElement: string = '') {
    const { value } = event.target as HTMLInputElement;

    if (value.length === 0) {
      this.filterBranchName = '';
    } else {
      this.filterBranchName = value;
    }
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.getProjectScanData(idElement);
    }, this.timeOutDuration);
  }

  getColumnFilterValue() {
    return this.filterBranchName;
  }

  copyToClipboard(value: string, message: string) {
    if (value != null && value.length > 0) {
      navigator.clipboard.writeText(value).then(r => {
        const modalRef = this.modalService.open(ClipboardDialogComponent, {
          keyboard: false,
          centered: true,
          windowClass: 'clip-board-copy'
        });
        modalRef.componentInstance.message = message;
      });
    }
  }
}
