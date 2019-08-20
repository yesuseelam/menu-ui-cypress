import { NgModule } from '@angular/core';
import { LastUpdatedPipe } from './last-updated.pipe';

@NgModule({
    imports: [],
    declarations: [LastUpdatedPipe],
    providers: [LastUpdatedPipe],
    exports: [LastUpdatedPipe],
})

export class LastUpdatedModule {

    static forRoot() {
        return {
            ngModule: LastUpdatedModule,
            providers: [],
        };
    }
}