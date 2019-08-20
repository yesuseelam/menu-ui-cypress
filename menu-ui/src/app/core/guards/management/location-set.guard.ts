import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { LocationSetComponent } from '../../../components/management/location-set/location-set.component';
import {DialogService} from "../../../shared/dialog.service";

@Injectable()
export class ConfirmLSDeactivateGuard implements CanDeactivate<LocationSetComponent> {
  constructor(private dialogService: DialogService) {

  }

  canDeactivate(target: LocationSetComponent) {
    return true;
  }
}
