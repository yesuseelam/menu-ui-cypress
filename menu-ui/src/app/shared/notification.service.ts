import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(public snackBar: MatSnackBar) { }

    config: MatSnackBarConfig = {
        duration: 3000
    }


    success(msg) {
        this.config['panelClass'] = ['notification', 'success'];
        this.snackBar.open(msg, '',this.config);
    }

    error(msg) {
        this.config['panelClass'] = ['notification', 'error'];
        this.snackBar.open(msg, '', this.config);
    }
}
