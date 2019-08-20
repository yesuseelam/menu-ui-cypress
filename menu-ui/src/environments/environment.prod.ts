/* tslint:disable */
import { enableProdMode, NgModuleRef } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';
import { Environment } from './model';

enableProdMode();

export const environment: Environment = {
    production: true,
    showDevModule: false,
    _API_URL_V2 : "https://menu-api.restsolutions.cfahome.com",
    _OKTA_DETAILS : {
        appName: 'Chick-fil-A',
        uiRedirectUrl: 'https://menu.restsolutions.cfahome.com',// for local testing use 'http://localhost:4200',
        idmUrl: 'https://auth.idm.cfahome.com/oauth2/token',
        clientId: '0oa9chf4l3gLXxl7C1t7', //replace this with your app's client id
        oktaIssuerUrl: 'https://cfahome.okta.com/oauth2/aus4i6zex3F52d4rn1t7',
        oktaUrl: 'https://cfahome.okta.com'
    },
    /** Angular debug tools in the dev console
     * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
     * @param modRef
     * @return {any}
     */
    decorateModuleRef(modRef: NgModuleRef<any>) {
        disableDebugTools();
        return modRef;
    },
    ENV_PROVIDERS: [

    ]
};
