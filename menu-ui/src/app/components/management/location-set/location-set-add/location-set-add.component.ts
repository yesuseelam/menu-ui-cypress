import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { TagService } from '../../../../services/tag/tag.service';
import { LocationSetService } from '../../../../services/location-set/location-set.service';
import {UserService} from "app/shared/user.service";
import {IUser} from "app/models/IUser";

@Component({
    selector: 'location-set-add-component',
    templateUrl: './location-set-add.component.html',
    styleUrls: ['./location-set-add.component.scss'],

})
export class LocationSetAddComponent implements OnInit {
    public form: FormGroup;
    public name: string;
    public showCreateLocationSet: boolean = false;
    public cannotDeleteItem: boolean = false;
    public key = 'number';
    public display = 'name';
    public locationSetTypes = [];
    public locationSet = {tag: '', name: ''};
    public user:IUser;

    constructor(
        private userService: UserService,
        public dialogRef: MatDialogRef<LocationSetAddComponent>,
        public tagService: TagService,
        public locationSetService: LocationSetService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.showCreateLocationSet = this.data.showCreateLocationSet;
    }

    public ngOnInit() {
        if (this.showCreateLocationSet) {
            this.dialogRef.updatePosition({  top: '100px' });
            this.buildForm();
            this.locationSetTypes = this.data.locationSetTypes.filter((location) => !location.locked);
        }
      this.userService.getUser().subscribe((user) => {
        this.user = user;
      });
    }

    public closeAfterSubmit(): void {
        const result = [ 'save', this.form.controls['locationSetType'].value ];
        this.dialogRef.close(result);
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public buildForm() {
        this.form = new FormGroup({
            name: new FormControl('', ),
            tag: new FormControl('', ),
            locationSetType: new FormControl('', ),
            description: new FormControl('')
        });
    }

    public findTagExists() {
        if (this.form.controls['tag'].valid) {
            this.tagService.getLocationSetTags(this.form.get('tag').value).subscribe((res) => {
                if ( res.response === true) {
                    this.form.controls['tag'].setErrors({tagExists: true});
                }
            });
        }
    }

    public OnSubmit() {
        if (this.form.valid) {
            const locationSet = {
                name: this.form.controls['name'].value,
                tag: this.form.controls['tag'].value,
                locationSetType: this.form.controls['locationSetType'].value,
                description: this.form.controls['description'].value,
            };
            this.locationSetService.createLocationSet(locationSet).subscribe((res) => {
                this.closeAfterSubmit();
            });
        }
    }
}
