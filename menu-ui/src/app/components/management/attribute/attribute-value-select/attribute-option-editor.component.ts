import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AttributeAddComponent} from "../attribute-add/attribute-add.component";

@Component({
    selector: 'attribute-value-select-component',
    templateUrl: './attribute-option-editor.component.html',
    styleUrls: ['./attribute-option-editor.component.scss'],

})
export class AttributeOptionEditorComponent implements OnInit {
    form: FormGroup;
    title: string;
    allowMultipleDefaults: boolean;
    optionFormArray: FormArray;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AttributeAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.fb = fb;
        this.title = data.title;
        this.allowMultipleDefaults = data.allowMultipleDefaults;
        this.optionFormArray = data.optionFormArray;
    }

    ngOnInit() {
        this.form = this.fb.group({
            attributeOptions: this.optionFormArray
        });
    }

    dismiss() {
        this.dialogRef.close();
    }

    accept() {
/*        this.dialogRef.close({
            options: this.attributeOptions,
            isDirty: this.form.dirty
        });*/

        this.dialogRef.close({
            optionFormArray: this.optionFormArray,
            hasChanges: this.form.dirty
        });
    }

    get attributeOptions(): FormArray {
        return <FormArray>this.form.get('attributeOptions');
    }

    createFormGroupForOption(optionValue, isDefault) {
        return this.fb.group({
            option: [optionValue, Validators.required],
            isDefault: isDefault
        })
    }

    newSelectOption(bottom: any) {
        let formGroup = this.createFormGroupForOption('', false);
        this.attributeOptions.push(formGroup);
        bottom.scrollIntoView();
    }

    removeSelectOption(index: number) {
        this.attributeOptions.removeAt(index);
        this.form.markAsDirty();
    }

    defaultSelected(selectedIndex) {
        if (this.allowMultipleDefaults)
            return;
        this.attributeOptions.controls
            .filter((ctrl, i) => {
                return i !== selectedIndex
            })
            .forEach(ctrl => {
                ctrl.get('isDefault').setValue(false);
            });

    }

}



