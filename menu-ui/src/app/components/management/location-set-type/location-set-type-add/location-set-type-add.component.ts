import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, AbstractControl, FormControl, FormArray, Validators } from '@angular/forms';
import { TagService } from '../../../../services/tag/tag.service';
import { LocationSetTypeService } from '../../../../services/location-set-type/location-set-type.service';
import {UserService} from "app/shared/user.service";
import {IUser} from "app/models/IUser";
@Component({
    selector: 'location-set-type-add-component',
    templateUrl: './location-set-type-add.component.html',
    styleUrls: ['./location-set-type-add.component.scss'],

})
export class LocationSetTypeAddComponent implements OnInit {
    form: FormGroup;
    name: string;
    hide: boolean = false;
    cannotDeleteItem:boolean = false;
    public user:IUser;
    constructor(
      private userService: UserService,
        public dialogRef: MatDialogRef<LocationSetTypeAddComponent>,
        public tagService: TagService,
        public locationSetTypeService: LocationSetTypeService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.hide = !this.data.showDelete;
        if (this.hide) {
            this.buildForm();
        }
    }

    ngOnInit() {
        this.dialogRef.updatePosition({  top: '100px' })
        this.userService.getUser().subscribe((user) => {
        this.user = user;
      });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    buildForm() {
        this.form = new FormGroup({
            name: new FormControl('', ),
            tag: new FormControl('', ),
            weight: new FormControl('', ),
            description: new FormControl(''),
            locked: new FormControl('')
        });
    }

    findTagExists() {
        if (this.form.controls['tag'].valid) {
            let tags;
            this.tagService.getLocationSetTypeTags(this.form.get('tag').value).subscribe((res)=>{
              tags = res;
                if (res.response === true) {
                  this.form.controls['tag'].setErrors({tagExists: true})
              }
            })
          }
    }

    OnSubmit() {
        if (this.form.valid) {
            const locationSetType = {
                name: this.form.controls['name'].value,
                tag: this.form.controls['tag'].value,
                weight: this.form.controls['weight'].value,
                description: this.form.controls['description'].value,
                locked: this.form.controls['locked'].value,
            }
            this.locationSetTypeService.createLocationSetType(locationSetType).subscribe((res) => {
                this.dialogRef.close('submit');
            })
        }
    }

    removeLocationSetType(): void {

    }

}
