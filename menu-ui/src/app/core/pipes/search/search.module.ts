import { NgModule } from '@angular/core';
import { SearchFilterPipe } from './search-filter.pipe';

@NgModule({
    imports: [],
    declarations: [SearchFilterPipe],
    providers: [SearchFilterPipe],
    exports: [SearchFilterPipe],
})

export class SearchFilterModule {

    static forRoot() {
        return {
            ngModule: SearchFilterModule,
            providers: [],
        };
    }
}