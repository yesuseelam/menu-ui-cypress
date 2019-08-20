import { Component, DoCheck, Input,Output,EventEmitter, KeyValueDiffers, OnInit } from '@angular/core';
import { ItemType } from '../../../../services/item-type/item-type.model';
import { ItemTypeService } from '../../../../services/item-type/item-type.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NotificationService} from "../../../../shared/notification.service";
import {IUser} from "app/models/IUser";
import {UserService} from "app/shared/user.service";

@Component({
    selector: 'app-item-type-edit',
    styleUrls: ['./item-type-edit.component.scss'],
    templateUrl: './item-type-edit.component.html'
})
export class ItemTypeEditComponent implements OnInit, DoCheck {

    @Input()
    public inputItemType: ItemType;
    public itemType: ItemType;
    public form: FormGroup;
    public differ;
    public formChanged: boolean = false;
    @Input()
    public itemTypeClasses;
    @Output()
    selectedItemType = new EventEmitter();
    private snackBarRef: any;
    public  user:IUser;

    constructor(private itemTypeService: ItemTypeService, private differs: KeyValueDiffers,
                public matSnackBar: MatSnackBar,private notificationService: NotificationService,private  userService:UserService) {
        this.buildForm();
        this.differ = differs.find({}).create();
    }

    public ngOnInit() {
      this.userService.getUser().subscribe((user) => {
        this.user = user;
      });
    }

    public ngDoCheck() {
        const changes = this.differ.diff(this.inputItemType);
        if (changes && this.inputItemType) {
            this.itemTypeService.getItemType(this.inputItemType.tag).subscribe((res) => {
                this.itemType = res;
                this.patchForm();
                this.form.valueChanges.subscribe((res) => {
                    this.formChanged = true;
                });
            });
        } else if (changes && !this.inputItemType) {
            this.form.reset();
            this.itemType = null;
            this.form.controls['name'].disable();
            this.form.controls['description'].disable();
            this.formChanged = false;
        }
    }

    public buildForm() {
        this.form = new FormGroup({
            name: new FormControl({value: '', disabled: !this.itemType}),
            description: new FormControl({value: '', disabled: !this.itemType}),
            classTag: new FormControl({value: '', disabled: !this.itemType}),
        });
    }

    public patchForm() {
        this.form.reset();
        this.form.controls['name'].setValue(this.itemType.name);
        this.form.controls['name'].enable();
        this.form.controls['description'].setValue(this.itemType.description);
        this.form.controls['description'].enable();
        this.form.controls['classTag'].setValue(this.itemType.classTag);
        this.formChanged = false;
    }

    public OnSubmit() {
        this.itemType.name = this.form.controls['name'].value;
        this.itemType.description = this.form.controls['description'].value;
        this.selectedItemType.emit(this.itemType);
        this.itemTypeService.updateItemType(this.itemType.tag, this.itemType).subscribe((res) => {
            this.itemType = res;
            this.patchForm();
            this.notificationService.success('Saved : ' + this.itemType.name);
        }, (error) => {
            this.notificationService.error('Could not save : ' + this.itemType.name)
            ;        });
    }

    public OnCancel() {
        this.patchForm();
    }
}
