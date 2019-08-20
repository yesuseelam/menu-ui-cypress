import {Component, EventEmitter, Input, KeyValueDiffers, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Attribute} from 'app/services/attribute/attribute.model';
import {AttributeService} from 'app/services/attribute/attribute.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AttributeOptionEditorComponent} from '../attribute-value-select/attribute-option-editor.component';
import {NotificationService} from "app/shared/notification.service";
import {IUser} from "app/models/IUser";

@Component({
  selector: 'app-attribute-edit',
  styleUrls: ['./attribute-edit.component.scss'],
  templateUrl: './attribute-edit.component.html',

})
export class AttributeEditComponent implements OnInit, OnChanges {

  @Input()
  attributeTypes;

  @Input()
  selectedAttribute;

  @Input()
  user: IUser;

  @Output() attributeChanged = new EventEmitter();
  attribute: Attribute;
  form: FormGroup;

  formReady: boolean = false;

  constructor(private attributeService: AttributeService, private differs: KeyValueDiffers,
              public matSnackBar: MatSnackBar, public dialog: MatDialog, private fb: FormBuilder, private notificationService: NotificationService) {

  }

  ngOnInit() {

  }

  refreshForm(attribute) {
    this.formReady = false;
    this.attribute = attribute;
    this.buildForm(this.attribute);
    this.formReady = true;
  }

  buildForm(attribute) {
    let optionGroups = this.hasConfigurableOptions ? attribute.options.map(option => {
      return this.createFormGroupForOption(option.value, this.isDefaultOption(option));
    }) : [];

    this.form = this.fb.group({
      name: attribute.name,
      objectName: attribute.jsonProperty,
      description: attribute.description,
      scope: {value: attribute.scope, disabled: true},
      type: {value: attribute.type, disabled: true},
      required: attribute.required,
      locked: attribute.locked,
      options: this.fb.array(optionGroups),
      defaultValue: attribute.defaultValue
    });

  }

  get hasChanges() {
    return this.form && this.form.dirty;
  }

  isDefaultOption(option): boolean {
    if (!this.attribute.defaultValue)
      return false;
    if (this.attribute.defaultValue == option.value)
      return true;

    return Array.isArray(this.attribute.defaultValue) && this.attribute.defaultValue.indexOf(option.value) > -1;
  }


  get attributeOptions(): FormArray {
    return <FormArray>this.form.get('options');
  }

  get hasConfigurableOptions(): boolean {
    if (!this.attribute)
      return false;
    return this.attribute.type === "SELECT" || this.attribute.type === "MULTI_SELECT";
  }

  createFormGroupForOption(optionValue, isDefault) {
    return this.fb.group({
      option: [optionValue, Validators.required],
      isDefault: isDefault
    })
  }

  editOptions() {
    if (this.hasConfigurableOptions) {
      let dialogRef = this.dialog.open(AttributeOptionEditorComponent, {
        width: '600px',
        data: {
          title: this.attribute.name,
          optionFormArray: this.attributeOptions,
          allowMultipleDefaults: this.attribute.type === 'MULTI_SELECT'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.hasChanges) {
          this.form.setControl('options', result.optionFormArray);
          this.form.markAsDirty();
        }
      });
    }
  }

  OnSubmit() {

    if (!this.form.valid)
      return;

    let changes = this.form.value;

    let defaultValue = changes.defaultValue;
    if (this.hasConfigurableOptions) {
      defaultValue = changes.options.filter(o => o.isDefault).map(o => o.option);
      if (this.attribute.type === "SELECT")
        defaultValue = defaultValue.length > 0 ? defaultValue[0] : '';
    }

    let updatedAttribute = {
      ...this.attribute,
      name: changes.name,
      description: changes.description,
      jsonProperty: changes.objectName,
      required: changes.required,
      locked: changes.locked,
      options: changes.options != null ? changes.options.map(opt => opt.option) : null,
      defaultValue: defaultValue,
    };

    this.attributeService.updateAttribute(this.attribute.tag, updatedAttribute).subscribe(res => {
      this.attributeChanged.emit(updatedAttribute);
      this.refreshForm(res);
      this.notificationService.success('Saved : ' + this.attribute.name);
    }, error => {
      this.notificationService.error('Could not save : ' + this.attribute.name);
    })
  }

  OnCancel() {
    this.refreshForm(this.attribute);
  }

  dateRangeUpdated($event) {
    if ($event.target.value == '') {
      this.form.get('defaultValue').setValue(null);
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedAttribute && changes.selectedAttribute.currentValue) {
      let newAttribute = changes.selectedAttribute.currentValue;
      this.attributeService.getAttribute(newAttribute.tag).subscribe((res) => {
        this.refreshForm(res);
      });
    }
  }
}
