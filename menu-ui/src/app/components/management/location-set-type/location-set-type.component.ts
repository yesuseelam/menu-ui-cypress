import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LocationSetType } from '../../../services/location-set-type/location-set-type.model';
import { LocationSetTypeService } from '../../../services/location-set-type/location-set-type.service';
import {ContextMenuComponent} from 'ngx-contextmenu';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocationSetTypeAddComponent } from './location-set-type-add/location-set-type-add.component';
import { LocationSetTypeEditComponent } from './location-set-type-edit/location-set-type-edit.component';
import {DialogService} from "../../../shared/dialog.service";
import {NotificationService} from "../../../shared/notification.service";
import {UserService} from "../../../shared/user.service";
import {IUser} from "../../../models/IUser";


@Component({
  selector: 'app-location-set-type',
  styleUrls: ['./location-set-type.component.scss'],
  templateUrl: './location-set-type.component.html'
})
export class LocationSetTypeComponent {

  locationSetTypes: LocationSetType[];
  spinner: boolean = true;
  color = '#e5173f';
  mode = 'indeterminate';
  diameter = 50;
  public search: string;
  public selectedDropDown: string = "name";
  public selected= { tag: "name", value: "Name", type: "string" };
  public selectDropDown = [{ tag: "name", value: "Name", type: "string" },
    { tag: "weight", value: "Weight", type: "number" }];
  config: MatDialogConfig;
  selectedLocationSetType: LocationSetType;
  @ViewChild('basicMenu', { static: false }) public basicMenu: ContextMenuComponent;
  @ViewChild(LocationSetTypeEditComponent, { static: true }) public locationSetTypeEdit: LocationSetTypeEditComponent;
  public user:IUser;
  constructor(private locationSetTypeService: LocationSetTypeService,
              public dialog: MatDialog, private titleService: Title, private dialogService: DialogService,
              private notificationService: NotificationService, private userService:UserService) {

  }


  ngOnInit() {
    this.titleService.setTitle("Management - Location Set Types");
    this.getAllLocationSetTypes();
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  getAllLocationSetTypes(){
    this.locationSetTypeService.getAllLocationSetTypes().subscribe(res => {
      this.locationSetTypes = res;
      this.spinner = false;
    })
  }

  changeDropDown(){
    for(let select of this.selectDropDown){
      if(this.selectedDropDown === select.tag){
        this.selected = select;
      }
    }
  }

  openCreateItemTypeDialog(): void {
    let dialogRef = this.dialog.open(LocationSetTypeAddComponent, {
      width: '600px',
      data: { showDelete: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === 'submit') {
        this.spinner = true;
        this.notificationService.success("Added Successfully")
        this.getAllLocationSetTypes();
        this.selectedLocationSetType = null;
      }
    });
  }


  openDeleteItemTypeDialog(locationSetType, i): void {

    this.dialogService.openConfirmDialog('Are you sure you want to delete',locationSetType.name)
      .afterClosed().subscribe(res => {
      if (res) {
        locationSetType.deleted = true;
        this.locationSetTypeService.deleteLocationSetType(locationSetType.tag).subscribe(() => {
          this.notificationService.success('Deleted successfully');
          this.spinner = true;
          this.getAllLocationSetTypes();
          this.locationSetTypeEdit.locationSetType = null;
          this.selectedLocationSetType = null;

        });
      };
    });
  }

  isChanges() {
    return this.locationSetTypeEdit.hasChanges;
  }

  makeBold(bold) {
    if(!this.isChanges() || this.user.isReadOnly){
      this.refreshItems(bold);
    }else {
      this.dialogService.openConfirmDialog('You have pending changes on ' + this.selectedLocationSetType.name + '. Data will be Lost.', null)
        .afterClosed().subscribe(res => {
        if (res){
          this.refreshItems(bold);
        }
      });
    }
  }

  refreshItems(bold){
    this.locationSetTypes.forEach(locationSet => {
      if (locationSet.tag === bold.tag) {
        locationSet.selected = true;
        this.selectedLocationSetType = JSON.parse(JSON.stringify(locationSet));
        this.locationSetTypeEdit.loadLocationSetType(locationSet.tag);
      } else {
        locationSet.selected = false;
      }
    });
  }

  locationSetTypeChange(attribute) {
    let itemIndex = this.locationSetTypes.findIndex(attr => attr.tag == attribute.tag);
    this.locationSetTypes[itemIndex] = attribute;
  }
}


