import { Component, OnInit, ChangeDetectionStrategy, HostListener, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';
import { Project, Entity, User, ProjectEdge } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { StateService } from '@app/threat-center/shared/services/state.service';
import { AuthenticationService } from '@app/security/services';
import { ChartDB } from '../../../fack-db/chart-data';
import { ApexChartService } from '../../../theme/shared/components/chart/apex-chart/apex-chart.service';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { ScanHelperService } from '../services/scan.service';
import * as _ from 'lodash';
import { EntityService } from '@app/admin/services/entity.service';
import { ChartHelperService } from '@app/core/services/chart-helper.service';


@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class EntityComponent implements OnInit, OnDestroy {
  public chartDB: any;
  public dailyVisitorStatus: string;
  public dailyVisitorAxis: any;
  public deviceProgressBar: any;

  //public entityId:string;
  public obsEntity: Observable<Entity>;
  public projects: TreeNode[];
  public componentsEntity: Entity;
  public uniqueLicenses = [];
  activeTab: string;
  columns = [
    { field: 'projectId', header: 'ProjectId' },
    { field: 'name', header: 'Name' },
    { field: 'created', header: 'Created' }
  ];

  vulnerabilityDonutChart: any = {};
  licenseDonutChart: any = {};
  componentDonutChart: any = {};
  assetDonutChart: any = {};

  componentVulnerabilityRiskChart: any = {};
  componentLicenseRiskChart: any = {};
  componentSourceChart: any = {};
  licenseCategoryChart: any = {};
  licenseRiskChart: any = {};

  stackedChartCommonOptions: Partial<any> = {};
  lineChartOptions: any;
  selectedDonut: string = "Vulnerability";
  lineChartActiveTab: string = "Month";

  monthSericeOverTime: any = {};
  quarterSericeOverTime: any = {};
  yearSericeOverTime: any = {};
  intervalSericeOverTime: any = {};

  entityPageBreadCums: Array<any> = [];
  recursionHelperArray = new Array();
  recursivehelperArrayForIrgTree = new Array();

  entityTreeModel: TreeNode | any = { data: [] };
  organizationTreeModel = [];

  isShowComponentdropdown: boolean = false;
  componentChartDropValues = [
    // { id: this.coreHelperService.uuidv4(), name: "Components", isActive: true },
    { id: this.coreHelperService.uuidv4(), name: "Vulnerability Risk", isActive: true },
    { id: this.coreHelperService.uuidv4(), name: "License Risk", isActive: false },
    { id: this.coreHelperService.uuidv4(), name: "Source", isActive: false }
  ];
  selectedComponentChartDropvalue = "Vulnerability Risk";
  isShowLicensedropdown: boolean = false;
  licenseChartDropValues = [
    { id: this.coreHelperService.uuidv4(), name: "License Count", isActive: true },
    { id: this.coreHelperService.uuidv4(), name: "Category", isActive: false },
    { id: this.coreHelperService.uuidv4(), name: "Risk", isActive: false },
  ];
  selectedlicenseChartDropValue = "License Count";
  public commonLineSparklineOptions: any = {};

  currentEntityId: string = "";
  isShowStackedChart: boolean = true;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private stateService: StateService,
    private route: ActivatedRoute,
    public apexEvent: ApexChartService,
    public authService: AuthenticationService,
    private coreHelperService: CoreHelperService,
    private scanHelperService: ScanHelperService,
    private entityService: EntityService,
    private chartHelperService: ChartHelperService,
    private modalService: NgbModal,
  ) {
    this.chartDB = ChartDB;
    //this.licensePieChart.legend.show=true;
    this.dailyVisitorStatus = '1y';

    this.deviceProgressBar = [
      {
        type: 'success',
        value: 66
      }, {
        type: 'primary',
        value: 26
      }, {
        type: 'danger',
        value: 8
      }
    ];

    this.scanHelperService.isRefreshObjectPageObservable$
      .subscribe(x => {
        if (x == true) {
          this.obsEntity.subscribe(entity => {
            entity.entityMetrics = null;
            if (!!entity && !entity.entityMetrics) {
              //refresh Object page..
              this.loadEntityPage();
            }
          });
        }
      });
  }


  ngOnDestroy(): void {
    sessionStorage.removeItem('EntityBreadCums');
  }

  public generateDayWiseTimeSeries = function (baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  };

  initStackedChartAccordingToDonut(value: string) {

    if (this.isShowStackedChart) {
      this.selectedDonut = value;
      this.stackedChartCommonOptions = Object.assign(this.chartHelperService.getStackedChartCommonConfiguration());
      switch (this.selectedDonut) {
        case 'Vulnerability':
          // check active tab as well..
          this.monthSericeOverTime['series'] = [{
            name: "South",
            data: this.generateDayWiseTimeSeries(
              new Date("11 Feb 2017 GMT").getTime(),
              20,
              {
                min: 10,
                max: 60
              }
            )
          },
          {
            name: "North",
            data: this.generateDayWiseTimeSeries(
              new Date("11 Feb 2017 GMT").getTime(),
              20,
              {
                min: 10,
                max: 20
              }
            )
          },
          {
            name: "Central",
            data: this.generateDayWiseTimeSeries(
              new Date("11 Feb 2017 GMT").getTime(),
              20,
              {
                min: 10,
                max: 15
              }
            )
          }];
          break;

        default:
          break;
      }
      if (this.selectedDonut === 'Vulnerability') {

      }
    }
    this.isShowStackedChart = !this.isShowStackedChart ? true : this.isShowStackedChart;
  }

  onStackedChartTabChange($event: NgbTabChangeEvent) {
    this.lineChartActiveTab = $event.nextId;
    // stacked area chart tab chages..
    switch (this.lineChartActiveTab) {
      case 'Month':
        // here init month chart according to selected donut

        break;
      case 'Quarter':
        // here init Quarter chart according to selected donut
        this.quarterSericeOverTime['series'] = [{
          name: "South",
          data: this.generateDayWiseTimeSeries(
            new Date("1 Feb 2019 GMT").getTime(),
            20,
            {
              min: 10,
              max: 60
            }
          )
        },
        {
          name: "North",
          data: this.generateDayWiseTimeSeries(
            new Date("11 Feb 2020 GMT").getTime(),
            20,
            {
              min: 10,
              max: 20
            }
          )
        },
        {
          name: "Central",
          data: this.generateDayWiseTimeSeries(
            new Date("11 Feb 2021 GMT").getTime(),
            20,
            {
              min: 10,
              max: 15
            }
          )
        }];
        break;
      case 'Year':
        // here init Quarter chart according to selected donut
        this.yearSericeOverTime['series'] = [{
          name: "South",
          data: this.generateDayWiseTimeSeries(
            new Date("1 Feb 2020 GMT").getTime(),
            20,
            {
              min: 10,
              max: 60
            }
          )
        },
        {
          name: "North",
          data: this.generateDayWiseTimeSeries(
            new Date("11 Feb 2020 GMT").getTime(),
            20,
            {
              min: 10,
              max: 20
            }
          )
        },
        {
          name: "Central",
          data: this.generateDayWiseTimeSeries(
            new Date("11 Feb 2020 GMT").getTime(),
            20,
            {
              min: 10,
              max: 15
            }
          )
        }];
        break;
      case 'Interval':
        // here init Quarter chart according to selected donut
        break;
      default:
        //
        break;
    }
  }

  navigateToProject(projectId) {
    const entityId = this.route.snapshot.paramMap.get('entityId')
    const url = "dashboard/entity/" + entityId + '/project/' + projectId;
    this.router.navigate([url]);
  }

  ngOnInit() {
    this.loadEntityPage();
  }

  loadEntityPage() {
    let entityId = this.route.snapshot.paramMap.get('entityId');
    // if an entityId isn't provided in params, use User defaultEntityId
    if (!entityId) {
      entityId = this.authService.currentUser.defaultEntityId;
    }
    console.log(entityId);
    console.log("Loading Entity");
    let isPush = true;
    if (!!sessionStorage.getItem('EntityBreadCums')) {
      isPush = false;
      this.entityPageBreadCums = JSON.parse(sessionStorage.getItem('EntityBreadCums'));
    }
    this.loadEntity(entityId, isPush);
    this.loadVulnerabilities(entityId);
    this.getLastTabSelected();
    this.commonLineSparklineOptions = Object.assign(this.chartHelperService.sparkLineChartCommonConfiguration());
  }

  loadVulnerabilities(entityId: any) {
    console.log("Loading entity components:", entityId);
    this.apiService.getEntityComponents(entityId)
      .pipe(map(result => result.data.entity))
      .subscribe(entity => {
        this.componentsEntity = entity;
        let uniqueLicenseNames = [];
        if (this.componentsEntity.entityComponents) {
          this.componentsEntity.entityComponents.edges.forEach(component => {
            let licenses = component.node.entityComponentLicenses;
            if (licenses) {
              licenses.edges.forEach(license => {
                if (uniqueLicenseNames.indexOf(license.node.name) === -1) {
                  uniqueLicenseNames.push(license.node.name);
                  this.uniqueLicenses.push(license.node);
                }
              });
            }
          });
        }
      });
  }

  loadEntity(entityId: string, isPush: boolean = false) {
    this.currentEntityId = entityId;
    this.entityTreeModel = { data: [] };
    this.organizationTreeModel = [];
    this.selectedDonut = 'Vulnerability';
    this.router.navigateByUrl('dashboard/entity/' + entityId);
    this.obsEntity = this.apiService.getEntity(entityId)
      .pipe(map(result => result.data.entity));


    this.obsEntity.subscribe(entity => {
      this.coreHelperService.settingProjectBreadcum("Entity", entity.name, entity.entityId, false);
      this.buildProjectTree(entity);

      if (isPush) {
        this.entityPageBreadCums.push({ id: entityId, name: entity.name });
        this.setEntityBreadcumToSession();
      }

      if (entity.entityMetrics) {
        const vulnerabilityMetrics = entity.entityMetrics.vulnerabilityMetrics;
        const licenseMetrics = entity.entityMetrics.licenseMetrics;
        const componentMetrics = entity.entityMetrics.componentMetrics;
        const assetMetrics = entity.entityMetrics.assetMetrics;

        this.vulnerabilityDonutChart = {};
        this.vulnerabilityDonutChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
        this.vulnerabilityDonutChart['labels'] = ['Critical', 'High', 'Medium', 'Low', 'Info'];
        this.vulnerabilityDonutChart['colors'] = ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396'];
        this.vulnerabilityDonutChart['series'] = [vulnerabilityMetrics.critical, vulnerabilityMetrics.high, vulnerabilityMetrics.medium, vulnerabilityMetrics.low, vulnerabilityMetrics.info];

        this.licenseDonutChart = this.licenseRiskChart = this.licenseCategoryChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
        this.licenseDonutChart['labels'] = this.licenseRiskChart['labels'] = this.licenseCategoryChart['labels'] = ['CL Strong', 'CL Weak', 'CL Partial', 'CL Limited', 'Copyleft', 'Custom', 'Dual', 'Permissive'];
        this.licenseDonutChart['colors'] = this.licenseRiskChart['colors'] = this.licenseCategoryChart['colors'] = ['#ff2b2b', '#ff5252', '#ffa21d', '#00acc1', '#00e396', '#c71585', '#f8f8ff', '#4680ff'];
        this.licenseDonutChart['series'] = [licenseMetrics.copyleftStrong, licenseMetrics.copyleftWeak, licenseMetrics.copyleftPartial, licenseMetrics.copyleftLimited, licenseMetrics.copyleft, licenseMetrics.custom, licenseMetrics.dual, licenseMetrics.permissive];

        this.componentDonutChart = this.componentVulnerabilityRiskChart = this.componentLicenseRiskChart = this.componentSourceChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
        this.componentDonutChart['labels'] = this.componentVulnerabilityRiskChart['labels'] = this.componentLicenseRiskChart['labels'] = this.componentSourceChart['labels'] = ['Not Latest', 'Vulnerabilities', 'Risky Licenses'];
        this.componentDonutChart['colors'] = this.componentVulnerabilityRiskChart['colors'] = this.componentLicenseRiskChart['colors'] = this.componentSourceChart['colors'] = ['#ff2b2b', '#ff5252', '#ffa21d'];

        this.componentDonutChart['series'] = [componentMetrics.notLatest, componentMetrics.vulnerabilities, componentMetrics.riskyLicenses];
        this.componentVulnerabilityRiskChart['series'] = [componentMetrics.notLatest, componentMetrics.vulnerabilities, componentMetrics.riskyLicenses];

        this.assetDonutChart = {};
        this.assetDonutChart = Object.assign(this.chartHelperService.initDonutChartConfiguration());
        this.assetDonutChart['labels'] = ['Analyzed', 'Skipped', 'Embedded'];
        this.assetDonutChart['colors'] = ['#11c15b', '#4680ff', '#ffa21d'];
        this.assetDonutChart['series'] = [assetMetrics.analyzed, assetMetrics.skipped, assetMetrics.embedded];

        this.initStackedChartAccordingToDonut(this.selectedDonut);
      }
      if (!!entity) {
        this.entityTreeLogic(entity);
      }
    });
  }

  async entityTreeLogic(entity: any) {
    this.recursionHelperArray = [];
    this.recursivehelperArrayForIrgTree = [];
    if (!!entity && !!entity.childEntities && entity.childEntities.edges.length >= 1) {
      await this.populateChildernRecusivaly(entity.childEntities.edges, null);
      let w = {};
      this.entityTreeModel.data = [
        {
          "data": entity,
          "children": this.list_to_tree(this.recursionHelperArray, false),
          expanded: true,
          visible: false
        }
      ];
      this.organizationTreeModel = [
        {
          data: entity,
          expanded: true,
          name: entity.name,
          styleClass: 'p-person',
          type: "entity",
          children: this.list_to_tree(this.recursivehelperArrayForIrgTree, true)
        }
      ];

      console.log(this.organizationTreeModel);
    }
  }

  buildProjectTree(entity: Entity) {
    let edges = entity.projects.edges;

    let nodes: TreeNode[] = edges.map(projectEdge => {
      let node: TreeNode = {
        label: projectEdge.node.name,
        data: projectEdge.node,
        expandedIcon: "fa fa-folder-open",
        collapsedIcon: "fa fa-folder",
        children: []
      };
      this.buildProjectTreeHier(projectEdge, node);
      return node;
    });
    this.projects = nodes;
  }

  buildProjectTreeHier(projectEdge: ProjectEdge, treeNode: TreeNode) {
    if (projectEdge.node.childProjects) {
      projectEdge.node.childProjects.edges.forEach(edge => {
        let childNode: TreeNode = {
          label: edge.node.name,
          data: edge.node,
          expandedIcon: "fa fa-folder-open",
          collapsedIcon: "fa fa-folder",
          children: []
        };
        treeNode.children.push(childNode);
        this.buildProjectTreeHier(edge, childNode);
      });
    }

  }

  changeEntity(entityId: string, name: string, isPush: boolean) {
    this.router.navigateByUrl('dashboard/entity/' + entityId);
    this.loadEntity(entityId, isPush);
    if (!isPush) {
      this.entityPageBreadCums.pop();
      this.setEntityBreadcumToSession();
    }
  }

  setEntityBreadcumToSession() {
    sessionStorage.setItem('EntityBreadCums', JSON.stringify(this.entityPageBreadCums));
  }

  goBackfromBreadcum(entityId, currentIndex) {
    const startIndexToRemove = currentIndex + 1;
    this.entityPageBreadCums.splice(startIndexToRemove, this.entityPageBreadCums.length - (startIndexToRemove));
    this.setEntityBreadcumToSession();
    this.loadEntity(entityId);
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.project_tabs_selectedTab = $event.nextId;
    this.activeTab = $event.nextId;
    this.coreHelperService.settingUserPreference("Entity", $event.activeId, this.activeTab);
  }


  //Called when component deactivate or destrory
  canDeactivate(): Observable<boolean> | boolean {
    //Need to check here is browser back button clicked or not if clicked then do below things..
    if (this.coreHelperService.getBrowserBackButton()) {
      this.coreHelperService.setBrowserBackButton(false);
      if (!!this.coreHelperService.getPreviousTabSelectedByModule("Entity")) {
        this.activeTab = this.coreHelperService.getPreviousTabSelectedByModule("Entity", true);
        this.coreHelperService.settingUserPreference("Entity", null, this.activeTab);
        return false;
      } else {
        this.coreHelperService.settingUserPreference("Entity", "", null);
        return true;
      }
    } else {
      this.coreHelperService.settingUserPreference("Entity", "", null);
      return true;
    }
  }

  //Below method will fire when click on browser back button.
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.coreHelperService.setBrowserBackButton(true);
    if (!!this.coreHelperService.getPreviousTabSelectedByModule("Entity")) {
      history.pushState(null, null, window.location.href);
    }
  }

  changeComponentChartDropdown(item: { id: string, name: string, isActive: boolean }) {
    this.isShowStackedChart = false;
    this.isShowComponentdropdown = false;
    this.selectedComponentChartDropvalue = item.name;
    _.each(this.componentChartDropValues, value => { value.isActive = (value.id !== item.id) ? false : true; });
    //binding value accroding to dropdown...
    switch (this.selectedComponentChartDropvalue) {
      case 'Components':
        break;
      case 'Vulnerability Risk':
        // this.componentVulnerabilityRiskChart['series'] = [25, 30, 99];
        break;
      case 'License Risk':
        this.componentLicenseRiskChart['series'] = [10, 6, 4];
        break;
      case 'Source':
        this.componentSourceChart['series'] = [99, 55, 77];
        break;
      default:
        break;
    }
  }

  changeLincesChartDropdown(item: { id: string, name: string, isActive: boolean }) {
    this.isShowStackedChart = false;
    this.isShowLicensedropdown = false;
    this.selectedlicenseChartDropValue = item.name;
    _.each(this.licenseChartDropValues, value => { value.isActive = (value.id !== item.id) ? false : true; })
    //bind value accroding to dropdown...
    switch (this.selectedlicenseChartDropValue) {
      case 'License Count':
        break;
      case 'Category':
        this.licenseCategoryChart['series'] = [10, 55, 60, 70, 80, 99, 105, 109];
        break;
      case 'Risk':
        this.licenseRiskChart['series'] = [10, 20, 30, 70, 90, 48, 7, 88];
        break;
      default:
        break;
    }
  }

  newParentChildDataPush = [];
  onEntityTreeNameSelect(rowData, rowNode) {
    if (!!rowNode.parent) {
      if (this.entityPageBreadCums.length == 1) {
        const defaultEntity = this.entityPageBreadCums[0];
        this.entityPageBreadCums = [];
        this.entityPageBreadCums.push(defaultEntity);
      }
      this.newParentChildDataPush = [];

      this.recursiveArrayPopulate(rowNode.parent, { id: rowNode.node.id, name: rowNode.node.name });
      for (var i = this.newParentChildDataPush.length - 1; i >= 0; i--) {
        this.entityPageBreadCums.push(this.newParentChildDataPush[i]);
      }
      this.setEntityBreadcumToSession();
      this.router.navigateByUrl('dashboard/entity/' + rowData.entityId);
      this.loadEntity(rowData.entityId, false);
    }
  }

  recursiveArrayPopulate(parent, dataToPush) {
    if (!!parent.parent) {
      this.newParentChildDataPush.push(dataToPush);
      this.recursiveArrayPopulate(parent.parent, { id: parent.id, name: parent.name });
    } else {
      this.newParentChildDataPush.push(dataToPush);
    }
  }

  getAdditionData(data) {
    if (!!data && data.length >= 1) {
      // return data[0];
      return data.reduce((prev, next) => prev + (+next), 0);
    } else {
      return 0;
    }
  }

  onNodeSelect($event) {
  }

  showAndHideRow(rowData) {
    return this.currentEntityId !== rowData.entityId;
  }

  private getLastTabSelected() {
    this.activeTab = !!this.coreHelperService.getLastTabSelectedNameByModule("Entity") ? this.coreHelperService.getLastTabSelectedNameByModule("Entity") : this.activeTab;
  }

  private async populateChildernRecusivaly(childData, prId) {
    if (childData.length >= 1) {
      for (let i = 0; i < childData.length; i++) {
        if (!!childData[i].node) {
          let cData: any = await this.entityService.getTreeEntity(childData[i].node.entityId).toPromise();
          let d = {};
          d['id'] = childData[i].node.entityId;
          d['data'] = cData.data.entity;
          d['parentId'] = prId;
          d['name'] = childData[i].node.name;
          d['children'] = null;
          this.recursionHelperArray.push(d);
          this.recursivehelperArrayForIrgTree.push({ parentId: prId, id: childData[i].node.entityId, name: childData[i].node.name, children: null, data: cData.data.entity, type: 'entity', expanded: false, styleClass: 'p-person' });
          if (!!cData.data && !!cData.data.entity && !!cData.data.entity.childEntities
            && cData.data.entity.childEntities.edges.length >= 1) {
            await this.populateChildernRecusivaly(cData.data.entity.childEntities.edges, cData.data.entity.entityId);
          }
        }
      }
    } else {
      this.recursionHelperArray = new Array();
    }
  }

  private list_to_tree(list, isFromOrg: boolean = false) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }
    let j = 0;
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentId !== "0" && !!node.parentId) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parentId]].children.push(node);
        list[map[node.parentId]].expanded = true;
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  //clicking on any where in the screen below method will fire
  onClick(event) {
    this.isShowComponentdropdown = (!!event.target.className && event.target.className !== 'chart-opt-selected' && event.target.parentNode.className !== 'chart-opt-selected') ? false : this.isShowComponentdropdown;
    this.isShowLicensedropdown = (!!event.target.className && event.target.className !== 'chart-opt-selected' && event.target.parentNode.className !== 'chart-opt-selected') ? false : this.isShowLicensedropdown;
  }
}
