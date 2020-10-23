import { NgModule } from '@angular/core';
import { CoreGraphQLService } from './services/core-graphql.service';
import { LocalService } from './services/local.service';
import { StorageService } from './services/storage.service';


@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        StorageService,
        LocalService,
        CoreGraphQLService
    ],
})
export class CoreModule { }
