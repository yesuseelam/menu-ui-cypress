import { ApplicationRef, NgModuleRef } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { Environment } from './model';

export const environment: Environment = {
    production: false,
    showDevModule: true,
    //_API_URL : "http://localhost:8080/",
    //_API_URL_V2 : "http://localhost:8080",
    _API_URL_V2 : "https://menu-api.restsolutions-test.cfadevelop.com",
    _OKTA_DETAILS : {
        appName: 'Menu',
        uiRedirectUrl: 'http://localhost:3000', // for local testing use 'http://localhost:4200',
        idmUrl: 'https://auth.idm-dev.cfadevelop.com/oauth2/token',
        clientId: '0oaic9fbi72PKJn0U0h7', // replace this with your app's client id
        oktaIssuerUrl: 'https://cfahome.oktapreview.com/oauth2/ausc6e4sj2fnPnQ670h7',
        oktaUrl: 'https://cfahome.oktapreview.com'
    },

    /** Angular debug tools in the dev console
     * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
     * @param modRef
     * @return {any}
     */
    decorateModuleRef(modRef: NgModuleRef<any>) {
        const appRef = modRef.injector.get(ApplicationRef);
        const cmpRef = appRef.components[0];

        let _ng = (<any> window).ng;
        enableDebugTools(cmpRef);
        (<any> window).ng.probe = _ng.probe;
        (<any> window).ng.coreTokens = _ng.coreTokens;
        return modRef;
    },
    ENV_PROVIDERS: [

    ]
};
