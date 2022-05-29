import {Injectable} from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'feather icon-monitor',
    children: [
      {
        id: 'scan',
        title: 'ThreatScan',
        type: 'item',
        url: '/dashboard/scan',
        icon: 'fas fa-fingerprint',
        permissions: ["SCAN_VIEW"],
      },
      {
        id: 'entity',
        title: 'My Team',
        type: 'item',
        url: '/dashboard/entity',
        icon: 'fad fa-user-friends',
        permissions: ["ENTITY_VIEW"],
      },
      {
        id: 'policy',
        title: 'Policies',
        type: 'item',
        url: '/dashboard/policy',
        icon: 'fas fa-feather-alt',
        permissions: ["POLICY_CREATE"],
      },
      /*{
        id: 'vulnerability-db',
        title: 'Vulnerabilities',
        type: 'item',
        url: '/dashboard/vulnerabilities',
        icon: 'fas fa-bug',
      },
      {
        id: 'license-db',
        title: 'Licenses',
        type: 'item',
        url: '/dashboard/licenses',
        icon: 'fas fa-balance-scale',
      },*/
      {
        id: 'reports',
        title: 'Reports',
        type: 'collapse',
        icon: 'fad fa-chart-pie',
        children: [
            // <i class="fas fa-flag-checkered"></i>
          /*{
            id: 'executive-report',
            title: 'Executive',
            icon: 'fas fa-flag-checkered',
            type: 'item',
            url: '/reports/executive',
            permissions: ["REPORT_VIEW"],
            target: false,
          },*/
          {
            id: 'vulnerability-report',
            title: 'Vulnerabilities',
            // icon: 'fas fa-fire-alt',
            icon: 'fas fa-exclamation-triangle',
            type: 'item',
            url: '/reports/vulnerability',
            permissions: ["REPORT_VIEW"],
            target: false,
          },
          {
            id: 'license-report',
            title: 'Licenses',
            icon: 'fas fa-balance-scale',
            type: 'item',
            url: '/reports/license',
            permissions: ["REPORT_VIEW"],
            target: false,
          },
          {
            id: 'component-report',
            title: 'Components',
            icon: 'fas fa-cubes',
            type: 'item',
            url: '/reports/component',
            permissions: ["REPORT_VIEW"],
            target: false,
          },
          {
            id: 'embedded-report',
            title: 'Embedded Assets',
            icon: 'fas fa-code',
            type: 'item',
            url: '/reports/embedded',
            permissions: ["REPORT_VIEW"],
            target: false,
          },
          /*{
            id: 'software-leaks-report',
            title: 'Software leaks',
            icon: 'fas fa-file-export',
            type: 'item',
            url: '/reports/leaks',
            permissions: ["REPORT_VIEW"],
            target: false,
          },*/
        ]
      },
      // {
      //   id: "alerts",
      //   title: "Alerts",
      //   type: "collapse",
      //   icon: "fas fa-bell",
      //   children: [
      //     {
      //       id: 'alerts-alerts',
      //       title: 'Alerts',
      //       icon: 'fas fa-bell',
      //       type: 'item',
      //       url: '/alerts/list'
      //     },
      //     {
      //       id: 'alerts-settings',
      //       title: 'Alerts settings',
      //       icon: 'fas fa-cog',
      //       type: 'item',
      //       url: '/alerts/settings'
      //     }
      //   ]
      // },
      {
        id: 'admin',
        title: 'Admin',
        type: 'collapse',
        icon: 'fas fa-users-cog',
        children: [
          {
            id: 'users',
            title: 'Users',
            icon: 'fas fa-users',
            type: 'item',
            url: '/admin/user',
            permissions: ["USER_VIEW"],
            target: false,
          },
          {
            id: 'rbac',
            title: 'RBAC',
            icon: 'fas fa-user-lock',
            type: 'item',
            url: '/admin/role',
            permissions: ["ROLE_VIEW"],
            target: false,
          },
          {
            id: 'business-units',
            title: 'Entity Manager',
            icon: 'far fa-building',
            type: 'item',
            url: '/admin/entity',
            permissions: ["ENTITY_EDIT"],
            target: false,
          },
          // {
          //   id: 'integrations',
          //   title: 'Integrations',
          //   icon: 'fas fa-retweet',
          //   type: 'item',
          //   url: '/admin/integration',
          //   permissions: ["INTEGRATION_VIEW"],
          //   target: false,
          // },
          {
            id: 'orgSetting',
            title: 'Organization Settings',
            icon: 'fas fa-cogs',
            type: 'item',
            url: '/dashboard/org-setting',
            permissions: ["ORG_VIEW"],
            target: false,
          },
          {
            id: 'deployment-mode',
            title: 'Deployment Mode',
            icon: 'fas fa-tasks',
            type: 'item',
            url: '/admin/deployment',
            permissions: ['ENTITY_EDIT'],
            target: false
          },
          {
            id: 'api-explorer',
            title: 'API Explorer',
            icon: 'fas fa-exchange',
            type: 'item',
            url: '/admin/api-explorer',
            permissions: ['ENTITY_EDIT'],
            target: false
          }
        ]
      }
      /*,
      {
        id: 'documentation',
        title: 'Documentation',
        type: 'item',
        url: 'https://docs.threatrix.io',
        icon: 'fad fa-books',
        permissions: ["ENTITY_VIEW"],
      }*/

      // {
      //   id: 'orgSetting',
      //   title: 'Organization Settings',
      //   type: 'item',
      //   url: '/dashboard/org-setting',
      //   icon: 'fas fa-cogs',
      // }

    ]
  }
];

@Injectable()
export class NavigationItem {
  public get() {
    return NavigationItems;
  }
}
