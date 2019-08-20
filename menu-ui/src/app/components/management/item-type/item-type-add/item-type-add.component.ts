import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { TagService } from '../../../../services/tag/tag.service';
import { ItemTypeService } from '../../../../services/item-type/item-type.service';
import {UserService} from "app/shared/user.service";
import {IUser} from "app/models/IUser";

@Component({
    selector: 'item-type-add-component',
    templateUrl: './item-type-add.component.html',
    styleUrls: ['./item-type-add.component.scss'],

})
export class ItemTypeAddComponent implements OnInit {
    public form: FormGroup;
    public name: string;
    public cannotDeleteItem: boolean = false;
    public hide: boolean = false;
    public itemTypeClasses;
    public user:IUser;

    constructor(
        private userService: UserService,
        public dialogRef: MatDialogRef<ItemTypeAddComponent>,
        public tagService: TagService,
        public itemTypeService: ItemTypeService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.hide = !this.data.showDelete;
        if (this.hide) {
            this.buildForm();
            this.itemTypeClasses = this.data.itemTypeClasses;
        }
    }

    public ngOnInit() {
        this.dialogRef.updatePosition({top: '100px'});
        this.userService.getUser().subscribe((user) => {
        this.user = user;
      });
    }

    public closeAfterSubmit(): void {
        this.dialogRef.close('submit');
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public buildForm() {
        this.form = new FormGroup({
            name: new FormControl('', ),
            tag: new FormControl('', ),
            classTag: new FormControl('', ),
            description: new FormControl('')
        });
    }

    public findTagExists() {
        if (this.form.controls['tag'].valid) {
            this.tagService.getItemTypeTags(this.form.get('tag').value).subscribe((res) => {
                if (res.response) {
                    this.form.controls['tag'].setErrors({tagExists: true});
                }
            });
        }
    }

    public OnSubmit() {
        if (this.form.valid) {
            const itemType = {
                name: this.form.controls['name'].value,
                tag: this.form.controls['tag'].value,
                classTag: this.form.controls['classTag'].value,
                description: this.form.controls['description'].value,
            };
            this.itemTypeService.createItemType(itemType).subscribe((res) => {
                this.closeAfterSubmit();
            });
        }
    }

    public removeItemType(): void {
        this.itemTypeService.deleteItemType(this.data.itemType.tag).subscribe((res) => {
            if (res.status) {
                this.closeAfterSubmit();
            } else {
                this.cannotDeleteItem = true;
            }
        });
    }

}
