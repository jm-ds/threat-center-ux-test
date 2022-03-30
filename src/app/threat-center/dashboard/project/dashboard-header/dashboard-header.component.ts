import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Project } from '@app/threat-center/shared/models/types';

import { AuthorizationService } from '@app/security/services';

@Component({
  selector: 'project-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class ProjectDashboardHeaderComponent {
  @Input() project: Project;

  @Output() openProjectTagsModal = new EventEmitter();

  constructor(public authorizationService: AuthorizationService) { }

  /** Ignore assets */
  onIgnoreAssets() { }

  /** Project tags */
  onProjectTags() {
    this.openProjectTagsModal.emit();
  }
}
