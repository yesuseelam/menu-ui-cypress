import { NgModule } from '@angular/core';
import { ItemSearchFilterPipe } from './item-search.pipe';

@NgModule({
    imports: [],
    declarations: [ItemSearchFilterPipe],
    providers: [ItemSearchFilterPipe],
    exports: [ItemSearchFilterPipe],
})

export class ItemSearchFilterModule {

    static forRoot() {
        return {
            ngModule: ItemSearchFilterModule,
            providers: [],
        };
    }
}