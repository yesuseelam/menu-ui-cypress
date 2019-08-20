import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ItemService } from '../../../services/item/item.service';
import { ItemTypeService } from '../../../services/item-type/item-type.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Item } from '../../../services/item/item.model';
import { ChildItem } from '../../../services/item-grouping/child-item.model';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { Attribute } from '../../../services/attribute/attribute.model';
import { AttributeService } from '../../../services/attribute/attribute.service';
import { map, mergeMap } from 'rxjs/operators';
import { DialogService } from '../../../shared/dialog.service';
import { NotificationService } from '../../../shared/notification.service';
import {UserService} from "../../../shared/user.service";
import {IUser} from "../../../models/IUser";

@Component({
  selector: 'app-item',
  styleUrls: ['./item.component.scss'],
  templateUrl: './item.component.html'
})
export class ItemComponent {
  public selected: string = 'NAME';
  public selectDropDown = [{tag: 'tag', value: 'Item Tag'}, {tag: 'itemTypeName', value: 'Item Type'}];
  public spinner: boolean = true;
  public items: Item[];
  public itemTypes;
  public search: string;
  public selectedItem: Item;
  public globalAttributes: Attribute[];
  public color = '#e5173f';
  public mode = 'indeterminate';
  public diameter = 50;
  public childItems: ChildItem[];
  public config: MatDialogConfig;
  @ViewChild('basicMenu', { static: false }) public basicMenu: ContextMenuComponent;
  @ViewChild(ItemEditComponent, { static: true }) public itemEdit: ItemEditComponent;

  public reloadingFromProd: boolean = false;
  public reloadText = 'Reload Items data from ';
  public reloadButtonTextDefault = this.reloadText;
  public reloadButtonText: string = this.reloadButtonTextDefault;
  public env;
  public disableBtnClick: boolean;
  public user:IUser;

  constructor(private itemService: ItemService,
              private itemTypeService: ItemTypeService, private titleService: Title,
              public dialog: MatDialog, private attributeService: AttributeService,
              private dialogService: DialogService,
              private notificationService: NotificationService, private userService: UserService) {

  }

  public ngOnInit() {

    this.titleService.setTitle('Management - Items/Modifiers');
    const itemTypesObservable = this.itemTypeService.getAllItemTypesForItems();
    const globalAttributesObservable = this.attributeService.getAllGlobalAttributes();

    // load global attributes for filter dropdown
    globalAttributesObservable.subscribe((res) => {
      this.globalAttributes = res;
      this.addSpecialAttributes();
      this.buildGlobalAttributes();
    });

    // load item types
    itemTypesObservable.subscribe((res) => {
      this.itemTypes = res;
    });

    // load items
    this.getAllItems();

    this.getEnv();

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.disableBtnClick =  this.user.isReadOnly;
  }

  public getAllItems() {
    const itemsInitSize = 20;
    const itemsObservableInit = this.itemService.getItemsBySize(itemsInitSize);

    // load the initial list of items first,
    // then load the complete list of the items
    itemsObservableInit.pipe(
      map((res) => {
        this.items = res.items;
      }),
      mergeMap(() => this.itemService.getAllItems())
    ).subscribe((res) => {
      const restOfItems = res.items.filter((item, index) => index > itemsInitSize - 1); // filter out initial list
      restOfItems.forEach((item) => this.items.push(item));
      this.spinner = false;
    });
  }

  public buildGlobalAttributes() {
    for (const attribute of this.globalAttributes) {
      this.selectDropDown.push({tag: attribute.tag, value: attribute.name});
    }
  }

  public isChanges() {
    return this.itemEdit.form.dirty;
  }

  public openCreateItemDialog(): void {
    if (this.globalAttributes && this.itemTypes) {
      const dialogRef = this.dialog.open(ItemAddComponent, {
        width: '700px',
        data: {
          showCreateItem: true, itemTypes: this.itemTypes,
          globalAttributes: this.globalAttributes
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        // refresh list only when new item has been saved
        if (result !== null && result === 'save') {
          this.notificationService.success('Added Successfully');
          this.spinner = true;
          this.getAllItems();
          this.selectedItem = null;
        }
      });
    }
  }

  public makeBold(bold) {
    if (!this.isChanges() || this.user.isReadOnly) {
      this.refreshItems(bold);
    } else {

      this.dialogService.openConfirmDialog('You have pending changes on ' + this.selectedItem.name + '. Data will be Lost.', null)
        .afterClosed().subscribe((res) => {
        if (res) {
          this.refreshItems(bold);
        }
      });
    }
  }

  public selectItem(item) {

  }

  public refreshItems(bold) {
    this.items.forEach((item) => {
      if (item.tag === bold.tag) {
        item.selected = true;
        this.selectedItem = JSON.parse(JSON.stringify(item));
      } else {
        item.selected = false;
      }
    });

  }

  public removeItem(item) {

    this.dialogService.openConfirmDialog('Are you sure you want to delete', item.name)
      .afterClosed().subscribe((res) => {
      if (res) {
        this.itemService.deleteItem(item.tag).subscribe(() => {
          this.notificationService.success('Deleted successfully');
          this.spinner = true;
          this.getAllItems();
          this.itemEdit.item = null;
          this.selectedItem = null;
        });
      }
    });
  }

  public toggleEnabled(item) {
    const action = item.enabled ? 'disable' : 'enable';
    this.dialogService.openConfirmDialog(`Are you sure you want to ${action} ${item.name}?`, null)
      .afterClosed().subscribe((res) => {
      if (res) {
        this.spinner = true;
        this.itemService.setEnabled(item.tag, !item.enabled).subscribe((res) => {
          item.enabled = !item.enabled;
          const title = item.enabled ? 'Enabled' : 'Disabled';
          this.notificationService.success(`${title}: ${item.name}`);
        });
        return true;
      }
      return false;
    });
  }

  public reloadFromProd() {
    // if (confirm('Are you sure you want to reload Items, Attributes, and Groupings data from ' + this.env
    //     + '?  All existing data will be lost except for defined exceptions.')) {
    this.dialogService.openConfirmDialog('Are you sure you want to reload Items, Attributes, and Groupings data from ' +
      this.env + '?  All existing data will be lost.', null)
      .afterClosed().subscribe((res) => {
      if (res) {
        this.reloadingFromProd = true;
        this.disableBtnClick = true;
        this.reloadButtonText = 'Reloading Items data from ' + this.env + '...';
        this.itemService.resetItems().subscribe((result) => {
          this.reloadingFromProd = false;
          this.disableBtnClick = false;
          this.reloadButtonText = this.reloadButtonTextDefault;
          this.notificationService.success('Import from ' + this.env + ' successful');
          this.getAllItems();
        }, (error) => {
          if (error.status === 409) {
            // window.alert('Cannot proceed due to another import process currently running. Please try this feature after sometime');
            this.dialogService.openConfirmDialog('Cannot proceed due to another import process currently running. ' +
              'Please try this feature after sometime', null);
          } else {
            this.dialogService.openConfirmDialog('Something went wrong in backend. Please try this feature after sometime', null);
            // window.alert('Something went wrong in backend. Please try this feature after sometime');
          }
          this.reloadingFromProd = false;
          this.disableBtnClick = false;
          this.reloadButtonText = this.reloadButtonTextDefault;
        });
        return true;
      }
      return false;
    });
  }

  public getEnv() {
    this.itemService.getEnv().subscribe((result) => {
      this.env = result.env;
      this.reloadButtonTextDefault = this.reloadText + this.env;
      this.reloadButtonText = this.reloadButtonTextDefault;
    });
  }

  private addSpecialAttributes() { // do this for now
    let posIdCan = null;
    let posIdIndex = 0;
    this.globalAttributes.forEach((attr, i) => {
      if (attr.tag === 'POS_ID') {
        posIdIndex = i;
        posIdCan = JSON.parse(JSON.stringify(attr));
        posIdCan['tag'] = posIdCan['tag'] + '|CAN';
        posIdCan['name'] = posIdCan['name'] + ' (CAN)';
      }
    });
    this.globalAttributes.splice(posIdIndex + 1, 0, posIdCan);
  }

  itemChange(item) {
    let itemIndex = this.items.findIndex(i => i.tag == item.tag);
    this.items[itemIndex] = item;
  }
}
