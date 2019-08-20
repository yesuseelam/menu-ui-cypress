import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ItemTypeComponent } from '../../../components/management/item-type/item-type.component';
import {DialogService} from "../../../shared/dialog.service";
import {IUser} from "../../../models/IUser";
import {UserService} from "../../../shared/user.service";

@Injectable()
export class ConfirmItemTypeDeactivateGuard implements CanDeactivate<ItemTypeComponent> {

  public  user:IUser;

  constructor(private dialogService: DialogService,private  userService:UserService) {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }


  public canDeactivate(target: ItemTypeComponent) {
    if (target && target.isChanges() && !this.user.isReadOnly) {

      return this.dialogService.openConfirmDialog('You have pending changes on '+ target.selectedItemType.name +'. Data will be Lost.', null)
        .afterClosed();

    }
    return true;
  }
}
