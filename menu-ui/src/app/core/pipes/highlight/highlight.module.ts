import { NgModule } from '@angular/core';
import { HighLightFilterPipe } from './highlight.pipe';

@NgModule({
    imports: [],
    declarations: [HighLightFilterPipe],
    providers: [HighLightFilterPipe],
    exports: [HighLightFilterPipe],
})

export class HighLightModule {

    static forRoot() {
        return {
            ngModule: HighLightModule,
            providers: [],
        };
    }
}