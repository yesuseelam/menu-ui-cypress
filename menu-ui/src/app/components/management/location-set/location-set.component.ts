import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LocationSet } from '../../../services/location-set/location-set.model';
import { LocationSetType } from '../../../services/location-set-type/location-set-type.model';
import { LocationSetService } from '../../../services/location-set/location-set.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocationSetAddComponent } from './location-set-add/location-set-add.component';
import { LocationSetEditComponent } from './location-set-edit/location-set-edit.component';
import { LocationSetTypeService } from '../../../services/location-set-type/location-set-type.service';
import { DialogService } from '../../../shared/dialog.service';
import { NotificationService } from '../../../shared/notification.service';
import { KEYS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { AddLocationDialogComponent } from '../../shared/add-location-dialog/add-location-dialog.component';
import {IUser} from "../../../models/IUser";
import {UserService} from "../../../shared/user.service";

@Component({
  selector: 'app-location-set',
  styleUrls: ['./location-set.component.scss'],
  templateUrl: './location-set.component.html'
})
export class LocationSetComponent {

  public locationSetTypes: LocationSetType[] = [];a
  public selectedLocationSetType: LocationSetType;
  public spinner: boolean = false;
  public color = '#e5173f';
  public mode = 'indeterminate';
  public diameter = 50;
  public importingLocations = false;
  public importedLocationsMessage = '';
  public search: string;
  public selected: string = 'type';
  public config: MatDialogConfig;
  public selectedLocationSet: LocationSet;

  @ViewChild('tree', { static: true }) public tree: TreeComponent;
  @ViewChild('basicMenu', { static: false }) public basicMenu: ContextMenuComponent;
  @ViewChild(LocationSetEditComponent, { static: true }) public locationSetEdit: LocationSetEditComponent;

  public nodes = [];

  public options = {
    getChildren: (node: TreeNode) => {
      return this.locationSetService.getLocationsByParent(node.id)
        .pipe(
          map((locations) => {
            if (locations.length === 0) {
              this.notificationService.error('No locations found for ' + node.data.name);
            }
            return locations.map(this.mapLocationToNode);
          }),
          catchError((val) => {
            const errorMessage = `Server side error expanding ${node.data.name}`;
            this.notificationService.error(errorMessage);
            node.collapse();
            return of(errorMessage);
          })
        )
        .toPromise();
    },
    actionMapping: {
      mouse: {
        click: (tree: TreeModel, node: TreeNode, $event) => {
          node.setActiveAndVisible(false);
          this.selectedLocationSet = node.data.data;
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
      }
    }
  };

  public user:IUser;

  constructor(private locationSetService: LocationSetService,
              private locationSetTypeService: LocationSetTypeService,
              public dialog: MatDialog, private titleService: Title, private dialogService: DialogService,
              private notificationService: NotificationService,private userService:UserService) {
  }

  public mapLocationSetToNode = (locationSet: LocationSet) => {
    return {
      id: locationSet.tag,
      name: locationSet.name,
      hasChildren: true, // level 1 - location sets can have 0 or more child locations
      data: locationSet
    };
  }

  public mapLocationToNode = (location: LocationSet) => {
    return {
      id: location.tag,
      name: location.name,
      hasChildren: false, // level 2 - locations cannot have children
      data: location
    };
  }

  public ngOnInit() {
    this.titleService.setTitle('Management - Location Sets');
    this.locationSetTypeService.getAllLocationSetTypesForEdit().subscribe((res) => {
      this.locationSetTypes = res;
    });
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  public openCreateLocationSetDialog(): void {
    const dialogRef = this.dialog.open(LocationSetAddComponent, {
      width: '600px',
      data: {showCreateLocationSet: true, locationSetTypes: this.locationSetTypes}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result[0] === 'save') {
        this.notificationService.success('Added successfully');
        this.selectedLocationSet = null;
        if (this.selectedLocationSetType !== undefined && this.selectedLocationSetType.tag === result[1]) {
          this.locationSetTypeChanged(this.selectedLocationSetType);
        }
      }
    });
  }

  public isChanges() {}

  public importLocations() {
    this.dialogService.openConfirmDialog('Are you sure you want to import location data from the locations file?', null)
      .afterClosed().subscribe((res) => {
      if (res) {
        this.importingLocations = true;
        this.locationSetService.importLocations().subscribe((result) => {
          this.importingLocations = false;
          if (result.added.length > 0 || result.updated.length > 0 || result.deleted.length > 0) {
            const added = result.added.length > 0 ? `Added (${result.added})` : '';
            const updated = result.updated.length > 0 ? `Updated (${result.updated})` : '';
            const deleted = result.deleted.length > 0 ? `Removed (${result.deleted})` : '';
            this.importedLocationsMessage = `Locations Imported : ${added} ${updated} ${deleted}`;
          } else {
            this.importedLocationsMessage = 'No changes detected in locations file.';
          }
        }, (error) => {
          this.importingLocations = false;
          this.notificationService.error('Failed to import locations.');
        });
        return true;
      }
      return false;
    });
  }

  public locationSetTypeChanged(locationSetType) {
    this.spinner = true;
    this.locationSetService.getAllLocationSetsByTag(locationSetType.tag)
      .pipe(
        map((locationSets) => locationSets.map(this.mapLocationSetToNode)),
        catchError((val) => {
          const errorMessage = `Server side error loading location sets. `;
          this.notificationService.error(errorMessage);
          return throwError(errorMessage);
        })
      )
      .subscribe((locationSets) => {
        this.selectedLocationSet = null;
        this.nodes = locationSets;
        this.tree.treeModel.collapseAll();
        this.spinner = false;
        if (this.nodes.length === 0) {
          this.notificationService.error('No location sets found for ' +  locationSetType.name);
        }
      });
  }

  public locationSetChange(locationSet) {
    console.log('locationSetChange: ' + locationSet); // TODO finalize
    // let itemIndex = this.attributes.findIndex(attr => attr.tag == attribute
    //     .tag);
    // this.attributes[itemIndex] = attribute;
  }

  public deleteLocation(locationNode: TreeNode) {
    const location = locationNode.data.data;
    if (locationNode.isRoot) {
      this.dialogService.openConfirmDialog('Are you sure you want to delete', location.name)
        .afterClosed().subscribe((res) => {
        if (res) {
          this.locationSetService.deleteLocationSet(location.tag).subscribe(() => {
            this.notificationService.success('Deleted successfully');
            this.selectedLocationSet = null;
            this.locationSetTypeChanged(this.selectedLocationSetType);
          });
        }
      });
    } else {
      const parent = locationNode.parent.data.data;
      this.dialogService.openConfirmDialog('Are you sure you want to remove', location.name)
        .afterClosed().subscribe((res) => {
        if (res) {
          this.locationSetService.removeChildLocation(parent.tag, location.tag)
            .subscribe(() => {
              this.notificationService.success('Deleted successfully');
              this.selectedLocationSet = null;
              locationNode.parent.loadNodeChildren().then(function() {});
            });
        }
      });
    }
  }

  public addChildLocation(parentNode: TreeNode) {
    const dialogRef = this.dialog.open(AddLocationDialogComponent, {
      width: '600px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((newLocation) => {
      if (newLocation) {
        this.locationSetService.addChildLocation(parentNode.data.data.tag, newLocation.tag)
          .subscribe(() => {
            parentNode.loadNodeChildren().then(function() {});
          });
      }
    });
  }
}
