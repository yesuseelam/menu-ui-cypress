import {Component, OnInit, Input, KeyValueDiffers, DoCheck, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { LocationSetType } from '../../../../services/location-set-type/location-set-type.model';
import { LocationSetTypeService } from '../../../../services/location-set-type/location-set-type.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NotificationService} from "../../../../shared/notification.service";
import {IUser} from "app/models/IUser";
import {UserService} from "app/shared/user.service";

@Component({
    selector: 'app-location-set-type-edit',
    styleUrls: ['./location-set-type-edit.component.scss'],
    templateUrl: './location-set-type-edit.component.html'
})
export class LocationSetTypeEditComponent implements OnInit, DoCheck {

    @Input()
    inputLocationSetType: LocationSetType;
    @Output()
    locationSetTypeChanged = new EventEmitter();
    locationSetType: LocationSetType;
    form: FormGroup;
    private snackBarRef: any;
    differ;
    lastupdatedate;
    formChanged : boolean = false;
    toggleDate: boolean = false;
    public  user:IUser;
    constructor(private locationSetTypeService: LocationSetTypeService, private differs: KeyValueDiffers,
                public matSnackBar: MatSnackBar,private notificationService: NotificationService, private fb: FormBuilder,private  userService:UserService) {
        this.differ = differs.find({}).create();
    }

    ngOnInit() {
      this.userService.getUser().subscribe((user) => {
        this.user = user;
      });
    }

    ngDoCheck() {
        var changes = this.differ.diff(this.inputLocationSetType);
        if (changes && this.inputLocationSetType) {
            this.locationSetTypeService.getLocationSetType(this.inputLocationSetType.tag).subscribe((res) => {
                this.locationSetType = res;
                this.patchForm();
                this.form.valueChanges.subscribe((res)=>{
                    this.formChanged = true;
                })
            })
        }else if(changes && !this.inputLocationSetType){
            this.form.reset();
            this.locationSetType = null;
            this.form.controls['name'].disable();
            // this.form.controls['description'].disable();
            this.form.controls['weight'].disable();
            this.formChanged = false;
        }
    }

    buildForm() {
        this.form = this.fb.group({
            name: this.locationSetType.name,
            description: this.locationSetType.description,
            weight: this.locationSetType.weight,
            locked: this.locationSetType.locked
        });
        this.form.markAsPristine();
    }


    get hasChanges() {
        return this.form && this.form.dirty;
    }

    public loadLocationSetType(tag) {
        this.locationSetTypeService.getLocationSetType(tag).subscribe((res) => {
            this.locationSetType = res;
            this.refreshForm();
        });
    }

    public refreshForm() {
        this.buildForm();
    }

    patchForm() {
        this.form.reset();
        this.toggleDate = true;
        this.form.controls['name'].setValue(
            this.locationSetType.name);

        this.form.controls['name'].enable();
        this.form.controls['description'].setValue(this.locationSetType.description);
        this.form.controls['description'].enable();
        this.form.controls['weight'].setValue(this.locationSetType.weight);
        this.form.controls['weight'].enable();
        this.lastupdatedate = this.locationSetType.lastupdatedate;
        this.form.controls['locked'].setValue(this.locationSetType.locked);
        this.form.controls['locked'].enable();

        this.formChanged = false;
    }



    OnSubmit() {
        this.locationSetType.name = this.form.controls['name'].value;
        this.locationSetType.description = this.form.controls['description'].value;
        this.locationSetType.weight = this.form.controls['weight'].value;
        this.locationSetType.locked = this.form.controls['locked'].value;
        this.locationSetTypeService.updateLocationSetType(this.locationSetType.tag, this.locationSetType).subscribe(res => {
          this.locationSetTypeChanged.emit(this.locationSetType);
            this.locationSetType = res;
            this.patchForm();
            this.lastupdatedate = Date.now().toString();
            this.toggleDate = false;
            this.notificationService.success('Saved : ' + this.locationSetType.name,)
        }, error => {
            this.notificationService.error('Could not save : ' + this.locationSetType.name);
        })
    }

    OnCancel() {
        this.patchForm();
    }
}


