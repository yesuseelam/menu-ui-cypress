import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ItemGroupingComponent } from '../../../components/management/item-grouping/item-grouping.component'
import {DialogService} from "../../../shared/dialog.service";
import {UserService} from "../../../shared/user.service";
import {IUser} from "../../../models/IUser";


@Injectable()
export class ConfirmItemGDeactivateGuard implements CanDeactivate<ItemGroupingComponent> {

  public  user:IUser;

  constructor(private dialogService: DialogService,private  userService:UserService) {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  canDeactivate(target: ItemGroupingComponent) {
    if(target && target.isChanges() && !this.user.isReadOnly){

      return this.dialogService.openConfirmDialog('You have pending changes on '+ target.selectedItem.name +'. Data will be Lost.', null)
        .afterClosed();
    }
    return true;
  }
}
