import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { DestinationService } from 'app/services/destination/destination.service';
import { Destination } from 'app/services/destination/destination.model';
import { DestinationType } from 'app/services/destination/destination-type.model';
import { TagService } from 'app/services/tag/tag.service';
import { MenuService } from 'app/services/menu/menu.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from 'app/shared/notification.service';
import { IUser } from 'app/models/IUser';
import { UserService } from 'app/shared/user.service';

@Component({
  selector: 'menu-copy',
  templateUrl: './menu-copy.component.html',
  styleUrls: ['./menu-copy.component.scss']
})
export class MenuCopyComponent implements OnInit {

  public destinations: Destination[];
  public destinationTypes: DestinationType[];
  public form: FormGroup;
  public user: IUser;

  constructor(public dialogRef: MatDialogRef<MenuCopyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private destinationService: DestinationService,
              private menuService: MenuService,
              private tagService: TagService,
              private notificationService: NotificationService,
              private userService: UserService) {
  }

  public ngOnInit() {
    this.dialogRef.updatePosition({ top: '100px' });
    this.createCopyForm();
    this.getAllDestinations();
    this.getDestinationTypes();
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  public createCopyForm() {
    this.form = new FormGroup({
      name: new FormControl('', ),
      tag: new FormControl('', ),
      destinationType: new FormControl(''),
      copyFrom: new FormControl('')
    });
  }

  public getAllDestinations() {
    this.destinationService.getAllDestinations().subscribe((res) => {
      this.destinations = res;
    });
  }

  public getDestinationTypes() {
    this.destinationService.getDestinationTypes().subscribe((res) => {
      this.destinationTypes = res;
    });
  }

  public findTagExists() {
    if (this.form.controls.tag.valid) {
      this.tagService.getDestinationTags(this.form.get('tag').value).subscribe((res) => {
        if (res.response) {
          this.form.controls.tag.setErrors({tagExists: true});
        }
      });
    }
  }

  public OnSubmit() {
    if (this.form.valid) {
      this.copyMenu();
    }
  }

  public copyMenu() {
    const locationTag = this.data.locationSet.tag;
    const menuCopy = {
      destinationFromTag: this.form.controls.copyFrom.value,
      locationFromTag: locationTag,
      destinationToName: this.form.controls.name.value,
      destinationToTag: this.form.controls.tag.value,
      locationToTag: locationTag,
      destinationTypeToTag: this.form.controls.destinationType.value,
    };
    this.menuService.copyMenu(menuCopy)
      .pipe(
        catchError((val) => {
          const errorMessage = val.error.message ? val.error.message : val.error;
          this.notificationService.error(errorMessage);
          return throwError(errorMessage);
        })
      )
      .subscribe((res) => {
        this.dialogRef.close('save');
      });
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

}
