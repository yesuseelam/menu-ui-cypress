import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {TagService} from 'app/services/tag/tag.service';
import {Tag} from 'app/services/tag/tag.model';
import {concatAll, filter, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {SelectValue} from 'app/services/attribute/selectValue.model';
import {AttributeService} from 'app/services/attribute/attribute.service';
import {UserService} from "app/shared/user.service";
import {IUser} from "app/models/IUser";

@Component({
  selector: 'attribute-add-component',
  templateUrl: './attribute-add.component.html',
  styleUrls: ['./attribute-add.component.scss'],

})
export class AttributeAddComponent implements OnInit {
  form: FormGroup;
  selectForm: FormGroup;
  scopes = [{tag: 'GLOBAL', value: 'Global'}, {tag: 'LOCAL', value: 'Dynamic'}];
  attributeTypes;
  requiredTypes = [{tag: 'true', 'value': 'True'}, {tag: 'false', 'value': 'False'}];
  defaultRequiredTypes = [{tag: '', 'value': ''}, {tag: 'true', 'value': 'True'}, {tag: 'false', 'value': 'False'}];
  tags: Tag[];
  attributeType: String;
  name: string;
  showdefaultForm: boolean = true;
  allSelectValues: SelectValue[] = [];
  checkBoxValue = false;
  public user: IUser;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AttributeAddComponent>,
    public tagService: TagService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public attributeService: AttributeService
  ) {

  }

  ngOnInit() {
    this.dialogRef.updatePosition({top: '100px'});
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
    if (this.data.createAttribute) {
      this.buildForm();
      this.attributeTypes = this.data.attributeTypes;
    } else if (this.data.updateAttribute) {
      this.showdefaultForm = false;
      this.name = this.data.attribute.name;
      this.attributeType = this.data.attribute.typetag;
      this.patchSelectValueForm();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  buildForm() {
    this.form = new FormGroup({
      name: new FormControl('',),
      tag: new FormControl('',),
      objectName: new FormControl('',),
      scope: new FormControl('',),
      typetag: new FormControl('',),
      required: new FormControl('',),
      defaultValue: new FormControl(''),
      locked: new FormControl('',),
      description: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl('')
    });
    this.form.get('typetag').valueChanges.subscribe(() => this.form.get('defaultValue').reset());
  }

  findTagExists() {
    if (this.form.controls['tag'].valid) {
      this.tagService.getAttributeTags(this.form.get('tag').value).subscribe((res) => {
        if (res.response === true) {
          this.form.controls['tag'].setErrors({tagExists: true})
        }
      })
    }
  }

  buildSelectValForm() {
    this.selectForm = new FormGroup({
      'selectValues': new FormArray([this.addSelectValues()])
    });
    this.name = this.form.controls['name'].value;
  }

  patchSelectValueForm() {
    this.selectForm = new FormGroup({
      selectValues: new FormArray([])
    });
    this.patchSelectValues();
  }

  get selectValues(): FormArray {
    return this.selectForm.get('selectValues') as FormArray;
  }

  addSelectValues(): FormGroup {
    return new FormGroup({
      selectedValue: new FormControl('', Validators.required),
      checkBox: new FormControl(true),
    });
  }

  patchSelectValues() {
    const controlSV = this.selectValues;
    this.data.selectValues.forEach(x => { // iterate the array
      controlSV.push(this.patchSV(x.selectValue, x.defaultValue)) // push values
    });
    return controlSV;
  }

  patchSV(selectValue, defaultValue) {
    return new FormGroup({
      'selectedValue': new FormControl(selectValue, Validators.required),
      'checkBox': new FormControl(defaultValue),
    });
  }

  addSelectValues2(): FormGroup {
    return new FormGroup({
      'selectedValue': new FormControl('', Validators.required),
      'checkBox': new FormControl(false),
    });
  }

  addSelectedValues(i) {
    this.selectValues.push(this.addSelectValues2());
  }

  removeSelectedValues(i) {
    this.selectValues.removeAt(i);
  }

  valueExists(ip) {
    if (this.selectValues.controls.length > 1) {
      for (let i = 0; i < this.selectValues.controls.length; i++) {
        if (this.selectForm.get('selectValues').get('' + i).get('selectedValue').value) {
          this.selectForm.get('selectValues').get('' + i).get('selectedValue').setErrors(null);
        }
      }
      for (let i = 0; i < this.selectValues.controls.length; i++) {
        let dupSelectedValue = this.selectForm.get('selectValues').get('' + i).get('selectedValue').value;
        if (dupSelectedValue) {
          for (let j = i + 1; j < this.selectValues.controls.length; j++) {
            if (dupSelectedValue === this.selectForm.get('selectValues').get('' + j).get('selectedValue').value) {
              this.selectForm.get('selectValues').get('' + j).get('selectedValue').setErrors({duplicate: true})
              this.selectForm.get('selectValues').get('' + i).get('selectedValue').setErrors({duplicate: true});
            }
          }
        }
      }
    }
  }

  defaultValueExists(i) {
    if (this.attributeType === 'SELECT') {
      let defaultValue: boolean = this.selectForm.get('selectValues').get('' + i).get('checkBox').value;
      if (defaultValue) {
        this.checkBoxValue = false;
        for (let j = 0; j < this.selectValues.controls.length; j++) {
          if (i != j) {
            this.selectForm.get('selectValues').get('' + j).get('checkBox').patchValue(false);
          }
        }
      } else {
        this.checkBoxValue = true;
      }
    }
  }

  OnSubmit() {
    if (this.form.valid) {
      if (this.form.get('typetag').value === 'SELECT' || this.form.get('typetag').value === 'MULTI_SELECT') {
        this.attributeType = this.form.get('typetag').value;
        this.buildSelectValForm(); //intialize select form
        this.showdefaultForm = false;
      } else {
        this.createAttribute();
      }
    }
  }

  selectValuesSubmit() {
    if (!this.checkBoxValue && this.selectForm.valid) {
      this.saveAllSelectValues();
      if (this.data.createAttribute) {
        this.createAttribute();
      } else {
        this.updateAttribute();
      }
    }
  }

  public closeAfterSubmit(): void {
    this.dialogRef.close('submit');
  }

  createAttribute() {
    const attribute = {
      name: this.form.controls['name'].value,
      tag: this.form.controls['tag'].value,
      jsonProperty: this.form.controls['objectName'].value,
      description: this.form.controls['description'].value,
      scope: this.form.controls['scope'].value,
      typetag: this.form.controls['typetag'].value,
      required: this.form.controls['required'].value,
      locked: this.form.controls['locked'].value,
      lastupdatedby: 'test user',
      defaultValue : '',
      options: ''
    };
    if (this.showdefaultForm) {
      attribute['defaultValue'] = this.form.controls['defaultValue'].value;
    } else {
      attribute['defaultValue'] = this.findDefaultSelectValue();
      attribute['options'] = this.findAllSelectValues();
    }
    let typeTag = this.form.get('typetag').value;
    if (typeTag === 'DATE' && this.form.controls['date']) {
      attribute['defaultValue'] = new Date(this.form.controls['date'].value).toISOString().slice(0, 10);
    }

    this.attributeService.createAttribute(attribute).subscribe((res) => {
      this.closeAfterSubmit();
    })
  }

  updateAttribute() {
    const attribute = {
      ...this.data.attribute,
      options: this.findAllSelectValues(),
      lastupdatedby: window['_keycloak'].idTokenParsed.name
    };

    if (attribute.typetag === 'SELECT') {
      attribute.defaultValue = attribute.options.find((o) => o.defaultValue).selectValue;
    }

    this.attributeService.updateAttribute(this.data.attribute.tag, attribute)
      .subscribe((res) => {
        this.dialogRef.close(res);
      })
  }

  saveAllSelectValues() {
    of(this.selectValues.value).pipe(concatAll()
      , map(selectValue => this.convertListValue(selectValue)))
      .subscribe((res: any) => {
        (this.allSelectValues.push(res));
      });
  }

  findAllSelectValues(): string {
    let optionValues: string;
    of(this.selectValues.value).pipe(concatAll()
      , map((selectValue: any) => selectValue.selectedValue))
      .subscribe((res: any) => {
        optionValues = (optionValues != undefined) ? optionValues + "," + res : res;
      });
    return optionValues.trim();
  }


  findDefaultSelectValue(): string {
    let defaultValue: string;
    of(this.selectValues.value).pipe(
      concatAll()
      , filter((selectValue: any) => selectValue.checkBox)
      , map((selectValue: any) => selectValue.selectedValue))
      .subscribe(res => {
        defaultValue = (defaultValue != undefined) ? defaultValue + "," + res : res;
      });
    return defaultValue;
  }

  numberValidation() {
    if (this.form.controls['typetag'].value == 'NUM' && this.form.controls['defaultValue'].value) {
      var patt = new RegExp('^[0-9]+(\.[0-9]{1,2})?$');
      if (patt.test(this.form.controls['defaultValue'].value)) {
        this.form.controls['defaultValue'].setErrors(null);
      } else {
        this.form.controls['defaultValue'].setErrors({pattern: true})
      }
    }
  }


  convertListValue(selectValue) {
    let listValue = {};
    if (this.data.updateAttribute) {
      listValue['tag'] = this.data.attribute.tag;
    } else {
      listValue['label'] = this.form.controls['tag'].value;
    }
    listValue['value'] = selectValue.selectedValue;
    //listValue['defaultValue'] = selectValue.checkBox;
    //listValue['lastupdatedby'] = localStorage.getItem('username');//window['_keycloak'].idTokenParsed.name;
    //listValue['lastupdatedate'] = "2017/11/30 11:50:17 AM";
    return listValue;
  }

  dateRangeUpdated($event) {
    if($event.target.value == '')
      this.form.get('defaultValue').setValue(null);
  }
}
