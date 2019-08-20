import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AttributeService} from "app/services/attribute/attribute.service";
import {MenuService} from "app/services/menu/menu.service";
import {MenuKey} from "app/services/menu/menu-key.model";
import {ItemDetail} from "app/services/menu/item-detail.model";
import {NotificationService} from "app/shared/notification.service";
import {DialogService} from "app/shared/dialog.service";
import {IUser} from "app/models/IUser";
import {UserService} from "app/shared/user.service";

@Component({
  selector: 'app-menu-edit',
  styleUrls: ['./menu-edit.component.scss'],
  templateUrl: './menu-edit.component.html'
})
export class MenuEditComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  data;

  itemForm: FormGroup;

  @Input()
  menuKey: MenuKey;

  @Input()
  itemPath: string;

  @Output() itemUpdated = new EventEmitter<String>();

  itemDetail: ItemDetail;

  isLoading: boolean;

  isSubMenuRoot: boolean = false;
  public user: IUser;

  private attributesRemoved: Object = {};

  constructor(private menuService: MenuService,
              private attributeService: AttributeService,
              public matSnackBar: MatSnackBar, private notificationService: NotificationService, private dialogService: DialogService, private userService: UserService
  ) {
  }

  ngOnInit() {

    this.itemForm = new FormGroup({});
    this.attributeService.getAllAttributes().subscribe(attributes => {
      for (let attribute of attributes) {
        let control = new FormControl();
        this.itemForm.addControl(attribute.jsonProperty, control);
      }
    });

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.propertyChanged(changes, 'itemPath')) {
      if (changes.itemPath.currentValue) {
        this.isSubMenuRoot = !this.itemPath.includes("items");
        this.isLoading = true;
        this.menuService.getMenuItem(this.menuKey, this.itemPath).subscribe(item => {
            this.patchItemForm(item);
            this.isLoading = false;
            this.itemDetail = item;
          }
        );
      } else {
        this.itemDetail = null;
      }

    }
  }

  private propertyChanged(changes: SimpleChanges, prop: string) {
    return changes[prop] && changes[prop].currentValue != changes[prop].previousValue
  }

  patchItemForm(item) {

    this.itemForm.reset();
    this.setAttrFormTag(item);

    item.attributes.forEach(attribute => {
      let control = this.itemForm.get(attribute.jsonProperty);
      if (control)
        control.patchValue(attribute.value);

      if (attribute.type == 'DATE') {
        const control = new FormControl();
        this.itemForm.addControl(attribute.attrFormTag, control);
        let date = new Date(attribute.value);
        this.itemForm.get(attribute.attrFormTag).setValue(new Date(date.setMinutes(date.getMinutes() + date.getTimezoneOffset())));
      }
    });
  }

  public setAttrFormTag(item) {
    item.attributes.forEach((i) => i['attrFormTag'] = i.tag + '|' + i.countryCode);
  }

  allOptionsSelected(attribute) {
    if (attribute.value == null)
      return false;
    return attribute.options.every(o => attribute.value.includes(o.value));
  }

  selectAllOptions(attribute) {
    attribute.value = attribute.options.map(o => o.value);
    this.itemForm.get(attribute.jsonProperty).setValue(attribute.value);
  }

  deselectAllOptions(attribute) {
    attribute.value = [];
    this.itemForm.get(attribute.jsonProperty).setValue(attribute.value);
  }

  getInputCssClass(attribute) {
    if (attribute.scope == 'LOCAL')
      return 'attr-local';
    let hasChanged = this.itemForm.get(attribute.jsonProperty).value != attribute.value;
    if (attribute.isOverride || hasChanged)
      return 'attr-global-overridden';
    return 'attr-global';
  }

  onCancel() {
    this.patchItemForm(this.itemDetail);
  }

  getDirtyValues(form: any) {
    let dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        let currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.getDirtyValues(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }

        //  console.log(key + ' ' + currentControl.dirty + ' ' + currentControl.value);
      });

    Object.keys(this.attributesRemoved).forEach(key => {
      dirtyValues[key] = null;
    });
    return dirtyValues;
  }

  onSubmit() {
    let updates = this.getDirtyValues(this.itemForm);

    this.menuService.updateMenuItem(this.menuKey, this.itemDetail.jsonPath, updates).subscribe(response => {
      this.itemForm.markAsPristine();
      //this.successSnackBar(this.itemDetail.name);
      this.itemUpdated.emit(this.itemDetail.jsonPath);
      this.notificationService.success('Saved : ' + this.itemDetail.name);
    }, error => {
      this.notificationService.error('Could not save : ' + this.itemDetail.name);
    })
  }

  ngOnDestroy() {
  }

  addLocalAttribute($event) {
    let selectedAttribute = this.itemDetail.unassigned.splice($event.value, 1)[0];
    this.itemDetail.attributes.unshift(selectedAttribute);
    delete this.attributesRemoved[selectedAttribute.jsonProperty];
    let control = this.itemForm.get(selectedAttribute.jsonProperty);
    if (control) {
      control.patchValue(selectedAttribute.value);
      control.markAsDirty();
    }
    $event.source.value = '';
  }

  removeLocalAttribute(index) {
    let attribute = this.itemDetail.attributes[index];
    this.dialogService.openConfirmDialog('Are you sure you want to remove the attribute', attribute.name)
      .afterClosed().subscribe(res => {
      if (res) {
        this.itemDetail.attributes.splice(index, 1);
        this.itemDetail.unassigned.push(attribute);
        this.itemForm.controls[attribute.jsonProperty].setValue('');
        this.attributesRemoved[attribute.jsonProperty] = attribute;
        this.itemForm.markAsDirty();
        return true;
      }
    });

    return false;
  }

  dateUpdated($event, ctrlName) {
    if ($event.target.value == '') {
      let dateCtrl = this.itemForm.get(ctrlName);
      dateCtrl.setValue(null);
    }
  }
}

