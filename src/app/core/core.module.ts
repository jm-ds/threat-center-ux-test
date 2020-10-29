import { NgModule } from '@angular/core';
import { CoreGraphQLService } from './services/core-graphql.service';
import { CoreHttpService } from './services/core-http.service';
import { LocalService } from './services/local.service';
import { StorageService } from './services/storage.service';


@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        StorageService,
        LocalService,
        CoreGraphQLService,
        CoreHttpService
    ],
})
export class CoreModule { }
