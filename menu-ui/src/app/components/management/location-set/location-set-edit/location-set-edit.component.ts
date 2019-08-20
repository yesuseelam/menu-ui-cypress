import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { LocationSet } from '../../../../services/location-set/location-set.model';
import { LocationSetService } from '../../../../services/location-set/location-set.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {IUser} from "app/models/IUser";
import {UserService} from "app/shared/user.service";


@Component({
    selector: 'app-location-set-edit',
    styleUrls: ['./location-set-edit.component.scss'],
    templateUrl: './location-set-edit.component.html'
})
export class LocationSetEditComponent implements OnInit, OnChanges {

    @Input()
    public locationSet: LocationSet;

    @Output()
    public locationSetChanged = new EventEmitter();

    public form: FormGroup;

    private snackBarRef: any;
    public  user:IUser;

    constructor(private locationSetService: LocationSetService,
                public matSnackBar: MatSnackBar, public dialog: MatDialog,private  userService:UserService) {
    }

    public ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(''),
            description: new FormControl(''),
        });
        this.userService.getUser().subscribe((user) => {
        this.user = user;
        });
    }

    public OnSubmit() {
        if (this.form.invalid) {
            return;
        }

        this.locationSetService.updateLocationSet({
            tag: this.locationSet.tag,
            name: this.form.controls['name'].value,
            description: this.form.controls['description'].value
        }).subscribe((updatedLocationSet: any) => {
            this.locationSetChanged.emit(updatedLocationSet);
            this.locationSet.name = updatedLocationSet.name;
            this.locationSet.description = updatedLocationSet.description;
            this.initForm(this.locationSet);
            this.snackBar('Success', `Saved location set ${this.locationSet.tag} successfully.`);
        }, (error) => {
            this.snackBar('Failure', `Failed to save ${this.locationSet.tag}.` + error);
        });

    }

    public snackBar(action, message) {
        this.snackBarRef = this.matSnackBar.open(message, action, {
            duration: 3000
        });
        this.snackBarRef.instance = this.snackBarRef;
    }

    public initForm(locationSet) {
        this.form.reset();
        this.form.controls['name'].setValue(locationSet.name);
        this.form.controls['description'].setValue(locationSet.description);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.form && this.locationSet !== null) {
            this.initForm(this.locationSet);
        }
    }

    public onCancel() {
        this.initForm(this.locationSet);
    }
}
