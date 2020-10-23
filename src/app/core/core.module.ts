import { NgModule } from '@angular/core';
import { LocalService } from './services/local.service';
import { StorageService } from './services/storage.service';


@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [StorageService, LocalService],
})
export class CoreModule { }
