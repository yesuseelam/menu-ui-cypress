import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppState } from '../../app.service';
import { AuthenticationStatus } from '../../enum/AuthenticationStatus';

@Injectable()
export class OktaAuthGuard implements CanActivate {
    authStatus = AuthenticationStatus;

    constructor(private service: AppState) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.service.getCurrentAuthStatus === this.authStatus.Authorized) {
            return true; }
        return false;
    }
}
