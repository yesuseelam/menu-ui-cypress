import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {TagService} from 'app/services/tag/tag.service';
import {Attribute} from 'app/services/attribute/attribute.model';
import {ItemService} from 'app/services/item/item.service';
import {UserService} from "app/shared/user.service";
import {IUser} from "app/models/IUser";

@Component({
  selector: 'item-add-component',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.scss'],

})
export class ItemAddComponent implements OnInit {
  public isLinear: boolean = true;
  public firstFormGroup: FormGroup;
  public itemTypes;
  public item = {tag: '', name: ''};
  public key = 'tag';
  public display = 'name';
  public disableItem: boolean = false;
  public showDeleteItem: boolean = false;
  public showCreateItem: boolean = false;
  public cannotDeleteItem: boolean = false;
  public globalAttributes: Attribute[];
  public secondFormGroup: FormGroup;
  public user: IUser;

  constructor(private _formBuilder: FormBuilder,
              private tagService: TagService,
              private itemService: ItemService,
              private userService: UserService,
              public dialogRef: MatDialogRef<ItemAddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.showCreateItem = this.data.showCreateItem;
    this.showDeleteItem = this.data.showDeleteItem;
  }

  // This add component is now reused by 2 business functions (Add Item and Add Item Grouping) which have different data sets for item types
  public ngOnInit() {
    this.dialogRef.updatePosition({top: '100px'});
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    if (this.showCreateItem) {
      this.itemTypes = this.data.itemTypes;
      this.firstFormGroup = this._formBuilder.group({
        tag: new FormControl('',),
        itemType: new FormControl('',),
        locked: new FormControl('',),
      });
      this.globalAttributes = this.data.globalAttributes;
      this.buildGlobalAttributes();

    } else {
      this.item.tag = this.data.item.tag;
    }
  }

  public buildGlobalAttributes() {
    const formGroup = {};
    for (const prop in this.globalAttributes) {
      if (this.globalAttributes[prop].type === 'BOOL') {
        // do this since data type changed from string ('true') to boolean (true)
        formGroup[this.globalAttributes[prop].tag] = new FormControl(this.globalAttributes[prop].defaultValue);
      } else if (this.globalAttributes[prop].type === 'MULTI_SELECT') {
        // no default value for multi-select
        formGroup[this.globalAttributes[prop].tag] = new FormControl();
      } else {
        formGroup[this.globalAttributes[prop].tag] = new FormControl(this.globalAttributes[prop].defaultValue || '');
      }
    }
    this.secondFormGroup = this._formBuilder.group(formGroup);
  }

  public findTagExists() {
    if (this.firstFormGroup.controls['tag'].valid) {
      this.tagService.getItemTags(this.firstFormGroup.get('tag').value).subscribe((res) => {
        if (res.response === true) {
          this.firstFormGroup.controls['tag'].setErrors({tagExists: true});
        }
      });
    }
  }

  public numberValidation(defaultValue) {
    if (this.secondFormGroup.controls[defaultValue].value && this.secondFormGroup.controls[defaultValue].value !== 'null') {
      const patt = new RegExp('^[0-9]+(\.[0-9]{1,2})?$');
      if (patt.test(this.secondFormGroup.controls[defaultValue].value)) {
        this.secondFormGroup.controls[defaultValue].setErrors(null);
      } else {
        this.secondFormGroup.controls[defaultValue].setErrors({pattern: true});
      }
    }
  }

  public closeAfterSave(): void {
    this.dialogRef.close('save');
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    if (this.firstFormGroup.valid) {
      this.dialogRef.updatePosition({top: '50px'});
    }
  }

  public onSubmit2() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      let item = {
        tag: this.firstFormGroup.controls['tag'].value,
        itemType: this.firstFormGroup.controls['itemType'].value,
        locked: this.firstFormGroup.controls['locked'].value,
        attributes: this.getAttributeModifications()
      };
      this.itemService.saveItem(item).subscribe((res) => {
        this.closeAfterSave();
      });
    }
  }

  // save global attributes
  public getAttributeModifications() {
    const globalAttributes = [];
    for (const attribute of this.globalAttributes) {

      const ga = {}; // itemAttribute

      let formValue = this.secondFormGroup.get(attribute.tag).value;
      if(!formValue || formValue === 'null')
        continue;

      // limit request to only these fields instead of the entire nested objects
      const tagSplit = attribute.tag.split('|');
      ga['tag'] = tagSplit[0];
      ga['countryCode'] = tagSplit.length > 1 ? tagSplit[1] : 'US'; // do this for now
      ga['value'] = formValue;
      globalAttributes.push(ga);
    }
    return globalAttributes;
  }

  public removeItem() {
    this.itemService.deleteItem(this.item.tag).subscribe((res) => {
      if (res.status) {
        this.onNoClick();
      } else {
        this.cannotDeleteItem = true;
      }
    });
  }

}
