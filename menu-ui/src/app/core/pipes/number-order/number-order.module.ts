import { NgModule } from '@angular/core';
import { NumberOrderPipe } from './number-order.pipe';

@NgModule({
    imports: [],
    declarations: [ NumberOrderPipe ],
    providers: [ NumberOrderPipe ],
    exports: [ NumberOrderPipe ],
})

export class NumberOrderModule {

    static forRoot() {
        return {
            ngModule: NumberOrderModule,
            providers: [],
        };
    }
}