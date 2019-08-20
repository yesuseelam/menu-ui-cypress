import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Attribute } from 'app/services/attribute/attribute.model';
import { AttributeType } from 'app/services/attribute/attributeType.model';
import { AttributeService } from 'app/services/attribute/attribute.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AttributeAddComponent } from './attribute-add/attribute-add.component';
import { AttributeEditComponent } from './attribute-edit/attribute-edit.component';
import {DialogService} from "app/shared/dialog.service";
import {NotificationService} from "app/shared/notification.service";
import {UserService} from "app/shared/user.service";
import {IUser} from "app/models/IUser";

@Component({
  selector: 'app-attribute',
  styleUrls: ['./attribute.component.scss'],
  templateUrl: './attribute.component.html'
})
export class AttributeComponent implements OnInit {
  public attributes: Attribute[];
  public spinner: boolean = true;
  public color = '#e5173f';
  public mode = 'indeterminate';
  public diameter = 50;
  public search: string;
  public selected: string = 'name';
  public selectDropDown = [{ tag: 'name', value: 'Name' },
    { tag: 'typename', value: 'Attribute Type' },
    { tag: 'scope', value: 'Scope' },
    { tag: 'required', value: 'Required' },
    { tag: 'objectName', value: 'JSON Attribute Name'},
    { tag: 'defaultValue', value: 'Default Value'}];
  public config: MatDialogConfig;
  public selectedAttribute: Attribute;
  public attributeTypes: AttributeType[] = [];
  @ViewChild('basicMenu', { static: false }) public basicMenu: ContextMenuComponent;
  @ViewChild(AttributeEditComponent, { static: true }) public attributeEdit: AttributeEditComponent;
  public user: IUser;

  constructor(private attributeService: AttributeService,
              private titleService: Title, public dialog: MatDialog, private dialogService: DialogService,
              private notificationService: NotificationService,private userService: UserService) {

  }

  public ngOnInit() {
    this.titleService.setTitle('Management - Attributes');
    this.getAllAttributes();
    this.attributeService.getAllAttributeTypes().subscribe((res) => {
      this.attributeTypes = res;
    });

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  public getAllAttributes() {
    this.attributeService.getAllAttributes().subscribe((res) => {
      this.attributes = res;
      this.spinner = false;
    });
  }

  public openCreateAttributeDialog(): void {
    if (this.attributeTypes) {
      const dialogRef = this.dialog.open(AttributeAddComponent, {
        width: '600px',
        data: { createAttribute: true, attributeTypes : this.attributeTypes}
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result === 'submit') {
          this.spinner = true;
          this.notificationService.success('Created successfully');
          this.getAllAttributes();
          this.selectedAttribute = null;
        }
      });
    }
  }

  public openDeleteAttributeDialog(attribute): void {

    this.dialogService.openConfirmDialog('Are you sure you want to delete',attribute.name)
      .afterClosed().subscribe(res => {
      if (res) {
        this.attributeService.deleteAttribute(attribute.tag).subscribe((res)=>{
          this.notificationService.success('Deleted successfully' );
          this.spinner = true;
          this.getAllAttributes();
          this.attributeEdit.attribute = null;

        });
      }
    });
  }

  public removeAttribute(attribute, i) {
    this.openDeleteAttributeDialog(attribute);
  }

  public isChanges() {
    return this.attributeEdit.hasChanges;
  }

  public makeBold(bold) {
    if (!this.isChanges() || this.user.isReadOnly) {
      this.refreshItems(bold);
    } else {

      this.dialogService.openConfirmDialog('You have pending changes on ' + this.selectedAttribute.name + '. Data will be Lost.', null)
        .afterClosed().subscribe(res => {
        if (res) {
          this.refreshItems(bold);
        }
      });
    }
  }

  public refreshItems(bold) {
    this.attributes.forEach((attribute) => {
      if (attribute.tag === bold.tag) {
        attribute.selected = true;
        this.selectedAttribute = attribute;
      } else {
        attribute.selected = false;
      }
    });

  }
  attributeChange(attribute) {
    let itemIndex = this.attributes.findIndex(attr => attr.tag == attribute.tag);
    this.attributes[itemIndex] = attribute;
  }

}
