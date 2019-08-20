import { NgModule } from '@angular/core';
import { MenuLocationSetTypeFilterPipe } from './menu-location-set-type-filter.pipe';

@NgModule({
    imports: [],
    declarations: [MenuLocationSetTypeFilterPipe],
    providers: [MenuLocationSetTypeFilterPipe],
    exports: [MenuLocationSetTypeFilterPipe],
})

export class MenuLocationSetTypeFilterModule {

    static forRoot() {
        return {
            ngModule: MenuLocationSetTypeFilterModule,
            providers: [],
        };
    }
}
