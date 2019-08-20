import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { LocationSetTypeComponent } from '../../../components/management/location-set-type/location-set-type.component';
import {DialogService} from "../../../shared/dialog.service";
import {UserService} from "../../../shared/user.service";
import {IUser} from "../../../models/IUser";

@Injectable()
export class ConfirmLSTDeactivateGuard implements CanDeactivate<LocationSetTypeComponent> {

  public  user:IUser;

  constructor(private dialogService: DialogService,private  userService:UserService) {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  canDeactivate(target: LocationSetTypeComponent) {
    if(target && target.isChanges() && !this.user.isReadOnly){
      return this.dialogService.openConfirmDialog('You have pending changes on '+ target.selectedLocationSetType.name +'. Data will be Lost.', null)
        .afterClosed();
    }
    return true;
  }
}
