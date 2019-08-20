import { Component, DoCheck, EventEmitter, Output, Input, KeyValueDiffers, OnInit } from '@angular/core';
import { Item } from 'app/services/item/item.model';
import { ItemService } from 'app/services/item/item.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ItemTypeService } from 'app/services/item-type/item-type.service';
import {NotificationService} from "app/shared/notification.service";
import {IUser} from "app/models/IUser";
import {UserService} from "app/shared/user.service";

@Component({
  selector: 'app-item-edit',
  styleUrls: ['./item-edit.component.scss'],
  templateUrl: './item-edit.component.html'
})
export class ItemEditComponent implements OnInit, DoCheck {

  @Input()
  public inputItem: Item;
  @Output() itemChanged = new EventEmitter();
  public itemTypes;
  public item: Item;
  public differ;
  public form: FormGroup;
  public pipe = new DatePipe('en-US');
  public dateFormat = 'MM-dd-y';
  public timeFormat = 'hh:mm:ss a';
  public dateTimeFormat = `${this.dateFormat} ${this.timeFormat}`;
  private snackBarRef: any;
  public  user:IUser;

  constructor(private itemService: ItemService,
              private itemTypeService: ItemTypeService,
              private differs: KeyValueDiffers,
              public matSnackBar: MatSnackBar, private notificationService: NotificationService,private  userService:UserService) {
  }

  public ngOnInit() {
    this.form = this.createFormGroup();
    this.differ = this.differs.find({}).create();

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    this.itemTypeService.getAllItemTypes().subscribe((itemTypes) => {
      this.itemTypes = itemTypes;
    });
  }

  public ngDoCheck() {
    const changes = this.differ.diff(this.inputItem);
    if (changes && this.inputItem) {
      this.getItem();
    }
  }

  public getItem() {
    this.itemService.getItem(this.inputItem.tag).subscribe((res) => {
      this.item = res;
      this.fillFormWithItem(this.form, this.item);
    });
  }

  public createFormGroup() {
    return new FormGroup({
      name: new FormControl({value: ''}),
      description: new FormControl({value: ''}),
      itemTypeTag: new FormControl({value: ''}),
      locked: new FormControl({value: ''}),
    });
  }

  public selectAllOptions(attribute) {
    attribute.value = attribute.options.map((o) => o.value);
    this.form.get(attribute.attrFormTag).setValue(attribute.value);
  }

  public deselectAllOptions(attribute) {
    attribute.value = [];
    this.form.get(attribute.attrFormTag).setValue(attribute.value);
  }

  public allOptionsSelected(attribute) {
    return attribute.options.every((o) => attribute.value.includes(o.value));
  }

  public canChangeItemType(item) {
    return item.itemClass.toLowerCase().indexOf('grouping') < 0;
  }

  public setAttrFormTag(item) {
    item.attributes.forEach((i) => i['attrFormTag'] = i.tag + '|' + i.countryCode);
  }

  public fillFormWithItem(form, item) {
    form.reset();
    form.get('name').setValue(item.name);
    form.get('locked').setValue(item.locked);
    form.get('description').setValue(item.description);
    const itemTypeCtrl = form.get('itemTypeTag');
    itemTypeCtrl.setValue(item.itemType);
    if (this.canChangeItemType(item)) {
      itemTypeCtrl.enable();
    } else {
      itemTypeCtrl.disable();
    }

    this.setAttrFormTag(item);
    for (const attribute of item.attributes) {
      attribute.auditInfo = `Last updated by ${attribute.updatedBy} on ${this.pipe.transform(attribute.dateUpdated, this.dateFormat)} at ${this.pipe.transform(attribute.dateUpdated, this.timeFormat)}`;

      const control = new FormControl();
      form.removeControl(attribute.attrFormTag);
      form.addControl(attribute.attrFormTag, control);
      form.get(attribute.attrFormTag).setValue(attribute.value);
    }

    this.form.markAsPristine();
  }

  public OnSubmit() {
    if (!this.form.valid) {
      return;
    }

    console.log(this.form.value);
    this.itemService.updateItem(this.item.tag, this.form.value).subscribe((res) => {
      this.item.name = this.form.value['NAME|US'];
      this.itemChanged.emit(this.item);
      this.item = res;
      this.fillFormWithItem(this.form, this.item);
      this.notificationService.success('Saved : ' + this.item.name);
    }, (error) => {
      this.notificationService.error('Could not save : ' + this.item.name);
    });
  }

  public OnCancel() {
    this.fillFormWithItem(this.form, this.item);
  }


  dateUpdated($event, ctrlName) {
    if($event.target.value == ''){
      let dateCtrl = this.form.get(ctrlName);
      dateCtrl.setValue(null);
    }
  }
}

