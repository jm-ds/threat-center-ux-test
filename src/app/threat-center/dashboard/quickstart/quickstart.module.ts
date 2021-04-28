import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { QuickstartRoutingModule } from './quickstart-routing.module';
import { ThemeSharedModule } from '@app/theme/shared/theme-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule, NgbProgressbarModule, NgbTabsetModule, NgbDropdownModule, NgbButtonsModule, NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { QuickstartWizardComponent } from './wizard/quickstart-wizard.component';
import { TcSharedModule } from '@app/threat-center/shared/tc-shared.module';

import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatProgressBarModule } from '@angular/material';
import { RepositoryListComponent } from './wizard/repo-list/repo-list.component';


@NgModule({
  declarations: [
    QuickstartWizardComponent,
    RepositoryListComponent
  ],
  imports: [
    CommonModule,
    QuickstartRoutingModule,
    ThemeSharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    NgbPopoverModule,
    NgbTabsetModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NgbTooltipModule,
    TableModule,
    TcSharedModule,
    FileUploadModule,
    NgxSpinnerModule,
    NgbModule,
    MatProgressBarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: []
})
export class QuickstartModule { }
