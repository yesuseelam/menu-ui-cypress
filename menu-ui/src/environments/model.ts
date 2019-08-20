import { NgModuleRef } from '@angular/core';

export interface Environment {
    production: boolean;
    ENV_PROVIDERS: any;
    showDevModule: boolean;
    _API_URL_V2 : string;
    _OKTA_DETAILS:any;
    decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
