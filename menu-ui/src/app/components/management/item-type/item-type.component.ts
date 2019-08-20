import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ItemType } from '../../../services/item-type/item-type.model';
import { ItemTypeService } from '../../../services/item-type/item-type.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ItemTypeAddComponent } from './item-type-add/item-type-add.component';
import { ItemTypeEditComponent } from './item-type-edit/item-type-edit.component';
import { ItemTypeClass } from '../../../services/item-type-class/item-type-class.model';
import { ItemTypeClassService } from '../../../services/item-type-class/item-type-class.service';
import {DialogService} from "../../../shared/dialog.service";
import {NotificationService} from "../../../shared/notification.service";
import {UserService} from "../../../shared/user.service";
import {IUser} from "../../../models/IUser";

@Component({
  selector: 'app-item-type',
  styleUrls: ['./item-type.component.scss'],
  templateUrl: './item-type.component.html'
})
export class ItemTypeComponent {

  public itemTypes: ItemType[] = [];
  public itemTypeClasses: ItemTypeClass[] = [];
  public spinner: boolean = true;
  public color = '#e5173f';
  public mode = 'indeterminate';
  public diameter = 50;
  public search: string;
  public selected: string = 'name';
  public selectDropDown = [{tag: 'name', value: 'Name'}, {tag: 'className', value: 'Class Name'}];
  public config: MatDialogConfig;
  public selectedItemType: ItemType;
  @ViewChild('basicMenu', { static: false }) public basicMenu: ContextMenuComponent;
  @ViewChild(ItemTypeEditComponent, { static: true }) public itemTypeEdit: ItemTypeEditComponent;
  public user: IUser;

  constructor(private itemTypeService: ItemTypeService,
              public itemTypeClassService: ItemTypeClassService,
              public dialog: MatDialog, private titleService: Title, private dialogService: DialogService,
              private notificationService: NotificationService, private userService: UserService) {

  }

  public ngOnInit() {
    this.titleService.setTitle('Management - Item Types');
    this.getAllItemTypes();
    this.itemTypeClassService.getAllItemTypeClasses().subscribe((res) => {
      this.itemTypeClasses = res;
    });

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  public getAllItemTypes() {
    this.itemTypeService.getAllItemTypes().subscribe((res) => {
      this.itemTypes = res;
      this.spinner = false;
    });
  }

  public openCreateItemTypeDialog(): void {
    if (this.itemTypeClasses) {
      const dialogRef = this.dialog.open(ItemTypeAddComponent, {
        width: '600px',
        data: {showDelete: false, itemTypeClasses: this.itemTypeClasses}
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result === 'submit') {
          // refresh list only when new item type has been saved
          this.spinner = true;
          this.notificationService.success('Added successfully');
          this.getAllItemTypes();
          this.selectedItemType = null;
        }
      });
    }
  }

  public openDeleteItemTypeDialog(itemType): void {

    this.dialogService.openConfirmDialog('Are you sure you want to delete',itemType.name)
      .afterClosed().subscribe(res => {
      if (res) {
        this.itemTypeService.deleteItemType(itemType.tag).subscribe(() => {
          this.notificationService.success('Deleted successfully');
          this.spinner = true;
          this.getAllItemTypes();
          this.selectedItemType = null;

        });
      };
    });
  }

  public removeItemType(itemType, i) {
    this.openDeleteItemTypeDialog(itemType);
  }

  public isChanges() {
    return this.itemTypeEdit.form.dirty;
  }

  public makeBold(bold) {
    if (!this.isChanges() || this.user.isReadOnly) {
      this.refreshItems(bold);
    } else  {
      this.dialogService.openConfirmDialog('You have pending changes on ' + this.selectedItemType.name + '. Data will be Lost.', null)
        .afterClosed().subscribe(res => {
        if (res) {
          this.refreshItems(bold);
        }
      });
    }
  }

  public refreshItems(bold) {
    this.itemTypes.forEach((itemType) => {
      if (itemType.tag === bold.tag) {
        itemType.selected = true;
        this.selectedItemType = JSON.parse(JSON.stringify(bold));
      } else {
        itemType.selected = false;
      }
    });
  }

  public refreshEditFields(newItem) {
    let itemIndex = this.itemTypes.findIndex(item => item.tag == newItem.tag);
    this.itemTypes[itemIndex] = newItem;
  }
}
