import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class ConfirmHomeActivateGuard implements CanActivate {

    constructor(private router: Router) {

    }

    canActivate() {
        if ( window.screen.availWidth < 768) {
            this.router.navigate(['/mobile']);
            return false;
        }

        return true;
    }
}
