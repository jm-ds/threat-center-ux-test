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
      },
      {
        id: 'entity',
        title: 'My Business Unit',
        type: 'item',
        url: '/dashboard/entity',
        icon: 'far fa-building',
      },
      {
        id: 'policy',
        title: 'Policies',
        type: 'item',
        url: '/dashboard/policy',
        icon: 'fas fa-feather-alt',
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
      // {
      //   id: 'reports',
      //   title: 'Reports',
      //   type: 'collapse',
      //   icon: 'fas fa-chart-pie',
      //   children: [
      //       // <i class="fas fa-flag-checkered"></i>
      //     {
      //       id: 'executive-report',
      //       title: 'Executive',
      //       icon: 'fas fa-flag-checkered',
      //       type: 'item',
      //       url: '/reports/executive',
      //     },
      //     {
      //       id: 'vulnerability-report',
      //       title: 'Vulnerabilities',
      //       // icon: 'fas fa-fire-alt',
      //       icon: 'fas fa-exclamation-triangle',
      //       type: 'item',
      //       url: '/reports/vulnerability',
      //     },
      //     {
      //       id: 'license-report',
      //       title: 'Licenses',
      //       icon: 'fas fa-balance-scale',
      //       type: 'item',
      //       url: '/reports/license',
      //     },
      //     {
      //       id: 'component-report',
      //       title: 'Components',
      //       icon: 'fas fa-cubes',
      //       type: 'item',
      //       url: '/reports/component',
      //     },
      //     {
      //       id: 'embedded-report',
      //       title: 'Embedded Assets',
      //       icon: 'fas fa-code',
      //       type: 'item',
      //       url: '/reports/embedded',
      //     },
      //     {
      //       id: 'software-leaks-report',
      //       title: 'Software leaks',
      //       icon: 'fas fa-file-export',
      //       type: 'item',
      //       url: '/reports/leaks',
      //     },
      //   ]
      // },
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
            target: false,
          },
          {
            id: 'rbac',
            title: 'RBAC',
            icon: 'fas fa-user-lock',
            type: 'item',
            url: '/admin/role',
            target: false,
          },
          {
            id: 'business-units',
            title: 'Business Units',
            icon: 'far fa-building',
            type: 'item',
            url: '/admin/entity',
            target: false,
          },
          {
            id: 'business-units',
            title: 'Integrations',
            icon: 'fas fa-retweet',
            type: 'item',
            url: '/admin/integration',
            target: false,
          },
        ]
      },
      // {
      //   id: 'orgSetting',
      //   title: 'Organization Settings',
      //   type: 'item',
      //   url: '/dashboard/org-setting',
      //   icon: 'fas fa-cogs',
      // },
      /*
      {
        id: 'page-layouts',
        title: 'Page Layouts',
        type: 'collapse',
        icon: 'feather icon-layout',
        children: [
          {
            id: 'vertical',
            title: 'Vertical',
            type: 'collapse',
            children: [
              {
                id: 'v-static',
                title: 'Static',
                type: 'item',
                url: '/layout/static',
                target: true,
              },
              {
                id: 'v-fixed',
                title: 'Fixed',
                type: 'item',
                url: '/layout/fixed',
                target: true,
              },
              {
                id: 'v-nav-fixed',
                title: 'Navbar Fixed',
                type: 'item',
                url: '/layout/nav-fixed',
                target: true,
              },
              {
                id: 'v-collapse-menu',
                title: 'Collapse Menu',
                type: 'item',
                url: '/layout/collapse-menu',
                target: true,
              },
              {
                id: 'v-rtl',
                title: 'Vertical RTL',
                type: 'item',
                url: '/layout/vertical-rtl',
                target: true
              }
            ]
          },
          {
            id: 'horizontal',
            title: 'Horizontal',
            type: 'item',
            url: '/layout/horizontal',
            target: true
          },
          {
            id: 'horizontal-l2',
            title: 'Horizontal v2',
            type: 'item',
            url: '/layout/horizontal-l2',
            target: true
          },
          {
            id: 'horizontal-rtl',
            title: 'Horizontal RTL',
            type: 'item',
            url: '/layout/horizontal-rtl',
            target: true
          },
          {
            id: 'box-layout',
            title: 'Box Layout',
            type: 'item',
            url: '/layout/box',
            target: true
          },
          {
            id: 'light-layout',
            title: 'Light Layout',
            type: 'item',
            url: '/layout/light',
            target: true
          },
          {
            id: 'dark-layout',
            title: 'Dark Layout',
            type: 'item',
            url: '/layout/dark',
            target: true,
            badge: {
              title: 'Hot',
              type: 'badge-danger'
            }
          }
        ]
      },
      {
        id: 'widget',
        title: 'Widget',
        type: 'collapse',
        icon: 'feather icon-layers',
        badge: {
          title: '100+',
          type: 'badge-success'
        },
        children: [
          {
            id: 'statistic',
            title: 'Statistic',
            type: 'item',
            url: '/widget/statistic'
          },
          {
            id: 'data',
            title: 'Data',
            type: 'item',
            url: '/widget/data'
          },
          {
            id: 'chart',
            title: 'Chart',
            type: 'item',
            url: '/widget/chart'
          }
        ]
      },
      {
        id: 'users',
        title: 'User',
        type: 'collapse',
        icon: 'feather icon-users',
        children: [
          {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: '/users/profile',
            breadcrumbs: false
          },
          {
            id: 'cards',
            title: 'User Card',
            type: 'item',
            url: '/users/card'
          },
          {
            id: 'list',
            title: 'User List',
            type: 'item',
            url: '/users/list'
          }
        ]
      }*/
    ]
  },
  /*
  {
    id: 'ui-element',
    title: 'UI ELEMENT',
    type: 'group',
    icon: 'feather icon-layers',
    children: [
      {
        id: 'basic',
        title: 'Basic',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'alert',
            title: 'Alert',
            type: 'item',
            url: '/basic/alert'
          },
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/basic/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/basic/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumbs & Pagination',
            type: 'item',
            url: '/basic/breadcrumb-paging'
          },
          {
            id: 'cards',
            title: 'Cards',
            type: 'item',
            url: '/basic/cards'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/basic/collapse'
          },
          {
            id: 'carousel',
            title: 'Carousel',
            type: 'item',
            url: '/basic/carousel'
          },
          {
            id: 'grid-system',
            title: 'Grid System',
            type: 'item',
            url: '/basic/grid-system'
          },
          {
            id: 'progress',
            title: 'Progress',
            type: 'item',
            url: '/basic/progress'
          },
          {
            id: 'modal',
            title: 'Modal',
            type: 'item',
            url: '/basic/modal'
          },
          {
            id: 'spinner',
            title: 'Spinner',
            type: 'item',
            url: '/basic/spinner'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/basic/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/basic/typography'
          },
          {
            id: 'tooltip-popovers',
            title: 'Tooltip & Popovers',
            type: 'item',
            url: '/basic/tooltip-popovers'
          },
          {
            id: 'toasts',
            title: 'Toasts',
            type: 'item',
            url: '/basic/toasts'
          },
          {
            id: 'other',
            title: 'Other',
            type: 'item',
            url: '/basic/other'
          }
        ]
      },
      {
        id: 'advance',
        title: 'Advance',
        type: 'collapse',
        icon: 'feather icon-gitlab',
        children: [
          {
            id: 'sweet-alert',
            title: 'Sweet Alert',
            type: 'item',
            url: '/advance/alert'
          },
          {
            id: 'datepicker',
            title: 'Datepicker',
            type: 'item',
            url: '/advance/datepicker'
          },
          {
            id: 'task-board',
            title: 'Task Board',
            type: 'item',
            url: '/advance/task-board'
          },
          {
            id: 'light-box',
            title: 'Light Box',
            type: 'item',
            url: '/advance/light-box'
          },
          {
            id: 'notification',
            title: 'Notification',
            type: 'item',
            url: '/advance/notification'
          },
          {
            id: 'rating',
            title: 'Rating',
            type: 'item',
            url: '/advance/rating'
          },
          {
            id: 'range-slider',
            title: 'Range Slider',
            type: 'item',
            url: '/advance/range-slider'
          },
        ]
      }
    ]
  },
  {
    id: 'forms',
    title: 'Forms',
    type: 'group',
    icon: 'feather icon-layout',
    children: [
      {
        id: 'forms-element',
        title: 'Forms',
        type: 'collapse',
        icon: 'feather icon-file-text',
        children: [
          {
            id: 'form-elements',
            title: 'Form Elements',
            type: 'item',
            url: '/forms/basic'
          },
          {
            id: 'form-elements',
            title: 'Form Advance',
            type: 'item',
            url: '/forms/advance'
          },
          {
            id: 'form-validation',
            title: 'Form Validation',
            type: 'item',
            url: '/forms/validation'
          },
          {
            id: 'form-masking',
            title: 'Form Masking',
            type: 'item',
            url: '/forms/masking'
          },
          {
            id: 'form-wizard',
            title: 'Form Wizard',
            type: 'item',
            url: '/forms/wizard'
          },
          {
            id: 'form-picker',
            title: 'Form Picker',
            type: 'item',
            url: '/forms/picker'
          },
          {
            id: 'form-select',
            title: 'Form Select',
            type: 'item',
            url: '/forms/select'
          }
        ]
      }
    ]
  },
  {
    id: 'table',
    title: 'Table',
    type: 'group',
    icon: 'feather icon-list',
    children: [
      {
        id: 'bootstrap',
        title: 'Bootstrap',
        type: 'collapse',
        icon: 'feather icon-server',
        children: [
          {
            id: 'bt-basic',
            title: 'Basic Table',
            type: 'item',
            url: '/tbl-bootstrap/bt-basic'
          },
          {
            id: 'bt-sizing',
            title: 'Sizing Table',
            type: 'item',
            url: '/tbl-bootstrap/bt-sizing'
          },
          {
            id: 'bt-border',
            title: 'Border Table',
            type: 'item',
            url: '/tbl-bootstrap/bt-border'
          },
          {
            id: 'bt-styling',
            title: 'Styling Table',
            type: 'item',
            url: '/tbl-bootstrap/bt-styling'
          }
        ]
      },
      {
        id: 'data-table',
        title: 'Data Table',
        type: 'item',
        icon: 'feather icon-grid',
        url: '/tbl-datatable'
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  public get() {
    return NavigationItems;
  }
}
