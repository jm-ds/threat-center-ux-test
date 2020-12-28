import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { QuickstartRoutingModule } from './quickstart-routing.module';
import { ThemeSharedModule } from '@app/theme/shared/theme-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule, NgbProgressbarModule, NgbTabsetModule, NgbDropdownModule, NgbButtonsModule, NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { QuickstartWizardComponent } from './wizard/quickstart-wizard.component';
import { TaskComponent } from '@app/threat-center/shared/task/task.component';

import { TcSharedModule } from '@app/threat-center/shared/tc-shared.module';

import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadingDialogComponent } from '../project-scan-dialog/loading-dialog.component';

@NgModule({
  declarations: [
    QuickstartWizardComponent,
    LoadingDialogComponent
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
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LoadingDialogComponent]
})
export class QuickstartModule { }
