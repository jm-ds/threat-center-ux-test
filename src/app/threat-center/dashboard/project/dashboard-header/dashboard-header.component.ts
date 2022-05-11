import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AuthorizationService } from '@app/security/services';

import { Project } from '@app/models';

@Component({
  selector: 'project-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class ProjectDashboardHeaderComponent {
  @Input() project: Project;

  @Output() openIgnoreAssetsModal = new EventEmitter();
  @Output() openProjectTagsModal = new EventEmitter();

  constructor(public authorizationService: AuthorizationService) { }

  /** Ignore assets */
  onIgnoreAssets() {
    this.openIgnoreAssetsModal.emit();
  }

  /** Project tags */
  onProjectTags() {
    this.openProjectTagsModal.emit();
  }
}
