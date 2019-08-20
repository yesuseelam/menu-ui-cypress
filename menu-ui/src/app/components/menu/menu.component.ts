import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {LocationSetTypeService} from 'app/services/location-set-type/location-set-type.service';
import {LocationSetType} from 'app/services/location-set-type/location-set-type.model';
import {LocationSet} from 'app/services/location-set/location-set.model';
import {LocationSetService} from 'app/services/location-set/location-set.service';
import {DestinationService} from 'app/services/destination/destination.service';
import {FormControl} from '@angular/forms';
import {DestinationMapping} from 'app/services/destination/destination-mapping.model';
import { MatDialog } from '@angular/material/dialog';
import {SignInWidget} from '@cfa-angular/okta';
import {Observable} from 'rxjs';
import {MenuTreeComponent} from './menu-tree/menu-tree.component';
import {MenuKey} from 'app/services/menu/menu-key.model';
import {MenuService} from 'app/services/menu/menu.service';
import {UserService} from "app/shared/user.service";
import {IUser} from "app/models/IUser";

@Component({
    selector: 'app-menu',
    styleUrls: ['./menu.component.scss'],
    templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
    @ViewChild(SignInWidget, { static: false }) cfaSignInWidget: SignInWidget;

    // heading
    public tabHeading: string;

    destinationMappings;

    // selected location set
    public selectedLocationSetType: LocationSetType;
    public isLocationSetTypeParent: boolean;
    public showLocationSets = true;
    public otherLabel;

    subMenuMappings;
    // selected location set
    public selectedLocationSet: LocationSet;

    // selected location set types
    public locationSetTypes$: Observable<Array<LocationSetType>>;

    private locationSetCache: {};

    // push menu toggle
    public pushMenuToggle = false;

    // location set field
    locationSetCtrl: FormControl;

    // location set parent field
    locationSetParentCtrl: FormControl;

    // location set type field
    locationSetTypeCtrl: FormControl;

    // filter location sets
    filteredLocationSets: Array<LocationSet>;
    parentLocationSets: Array<LocationSet>;

    selectedDestination: DestinationMapping;

    data: Object = {
        destination: null,
        locationSet: null,
        destinationSelected: false,
    };

    selectedItemPath: String;

    selectedMenu: MenuKey;

  reloadingFromProd = false;

  reloadButtonTextDefault = 'Reload Menu from Prod';
  reloadButtonText: string = this.reloadButtonTextDefault;

    @ViewChild(MenuTreeComponent, { static: true })
    menuTree: MenuTreeComponent;
     public user:IUser;
    constructor(private locationSetTypeService: LocationSetTypeService,
                private locationSetService: LocationSetService,
                private destinationService: DestinationService,
                private menuService: MenuService,
                private titleService: Title,
                public dialog: MatDialog, private userService:UserService) {
        this.locationSetTypeCtrl = new FormControl();
        this.locationSetParentCtrl = new FormControl();
        this.locationSetCtrl = new FormControl();
    }

    ngOnInit() {

        this.titleService.setTitle('Menu');
      this.userService.getUser().subscribe((user) => {
        this.user = user;
      });
        this.locationSetTypes$ = this.locationSetTypeService.getAllLocationSetTypes();
        this.locationSetTypes$.subscribe(resp => {
            this.locationSetCache = {};
            resp.map(l => l.tag).forEach(locationSetType => {
                this.locationSetService.getAllLocationSetsByTag(locationSetType).subscribe(locationSets => {
                    this.locationSetCache[locationSetType] = locationSets;
                });
            });
        });

        this.locationSetTypeCtrl.valueChanges.subscribe((res) => {
            this.selectedLocationSetType = res;
            this.locationSetCtrl.setValue(null);
            this.filteredLocationSets = [];

            this.locationSetParentCtrl.setValue(null);
            this.parentLocationSets = [];
            this.showLocationSets = true;
            this.isLocationSetTypeParent = false;
            this.resetLocationSetCntrl();

            if (res.childScope !== null) {
              this.showLocationSets = false;
              this.isLocationSetTypeParent = true;
              this.parentLocationSets = this.locationSetCache[res.tag];
            } else if (this.locationSetCache[res.tag] && res.tag !== 'LOCATION') {
                this.filteredLocationSets = this.locationSetCache[res.tag];
            }
        });

        this.locationSetParentCtrl.valueChanges.subscribe((res) => {
          if (res) {
            this.locationSetService.getLocationsByParent(res.tag).subscribe((response) => {
              this.filteredLocationSets = response;
              this.showLocationSets = true;
              this.resetLocationSetCntrl();
              this.otherLabel = response[0].scope;
            });
          }
        });

        this.locationSetCtrl.valueChanges.subscribe(value => {
                if (!value) {
                    return;
                }

                if (typeof value === 'object') {
                    this.changeHeadingForLocationSet(value);
                    this.selectedDestination = null;
                    this.selectedMenu = null;
                    this.selectedItemPath = null;
                    return;
                }
                this._filter(value);
            }
        );
    }

    private _filter(value: string) {
        if (!this.locationSetCache[this.locationSetTypeCtrl.value.tag]) {
            this.filteredLocationSets = [];
            return;
        }

        if (value) { value = value.toLowerCase(); }
        const filtered = this.filterLocationSets(value);
        this.filteredLocationSets = filtered.length < 25 ? filtered : [];
        this.filteredLocationSets.sort((val1, val2) => {
            if (val1.name < val2.name) { return -1; }
            if (val1.name > val2.name) { return 1; }
            return 0;
        });
    }

    private filterLocationSets(filter) {
        if (!filter) {
            return [];
        }
        const locationSets = this.locationSetCache[this.locationSetTypeCtrl.value.tag];
        if (isNaN(filter)) { // not numeric
            return locationSets
                .filter((locationSet) => locationSet.name.toLowerCase().includes(filter));
        }

        return locationSets
            .filter((locationSet) => locationSet.tag.includes(filter));
    }

    private get placeholderTextParent() {
        return 'Select a ' + this.locationSetTypeCtrl.value.name;
    }

    private get placeholderText() {
        const locationSetType = this.locationSetTypeCtrl.value;
        if (!locationSetType) {
            return 'Location Set';
        }
        if (locationSetType.tag === 'LOCATION') {
            return 'Type location name or number for selections';
        }
        const label = (locationSetType.childScope !== null) ? this.otherLabel : locationSetType.name;
        return 'Select a ' + label;
    }

    changeHeadingForLocationSet(locationSet) {
        this.selectedLocationSet = locationSet;
        this.tabHeading = ' | ' + this.selectedLocationSet.name;
        this.titleService.setTitle('Menu ' + this.tabHeading);
    }

    resetLocationSetCntrl() {
        this.locationSetCtrl.setValue('');
        this.selectedLocationSet = null;
        this.selectedDestination = null;
        this.selectedMenu = null;
        this.tabHeading = '';
        this.data = null;
        this.selectedItemPath = null;
        this.titleService.setTitle('Menu');
    }

    displayFn(locationSet): string {
        if (!locationSet) {
            return locationSet;
        }
        return locationSet.name;
    }

    selectDestination($event) {
        if (!$event) {
            this.changeHeadingForLocationSet(this.selectedLocationSet);
            this.selectedDestination = null;
            this.data = null;
        } else if (!this.selectedDestination || this.selectedDestination.dtag !== $event.tag) {
            this.selectedMenu = new MenuKey($event.tag, this.selectedLocationSet.tag);
            this.updateDestinationHeading($event);
        }
    }

  reloadFromProd(menuKey) {
    if (confirm('Are you sure you want to reload this menu from prod?  All changes will be lost.')) {
      this.reloadingFromProd = true;
      this.reloadButtonText = 'Reloading menu from prod...';
      this.menuService.resetMenu(menuKey).subscribe(result => {
        this.reloadingFromProd = false;
        this.reloadButtonText = this.reloadButtonTextDefault;
        this.menuTree.loadMenu(menuKey);
      });

      return true;
    }
    return false;
  }

  // destination click
    updateDestinationHeading($event) {
        this.selectedDestination = $event;
        this.data = {
            destination: $event,
            locationSet: this.selectedLocationSet,
            destinationSelected: true,
            submenuSelected: false
        };
        this.tabHeading = ' | ' + this.selectedLocationSet.name + ' | ' + this.selectedDestination.name;
    }

    itemSelected(jsonPath) {
        this.selectedItemPath = jsonPath;
    }

    itemUpdated(jsonPath: string) {
      let itemsIndex = jsonPath.lastIndexOf('.items');
      let parentPath = itemsIndex > 0 ? jsonPath.substring(0, itemsIndex) : null;
      this.menuTree.reloadItems(parentPath);
      this.menuTree.selectItem(jsonPath);
    }

    // submenu plus button
    openCreateSubMenu() {
        this.menuTree.addSubMenu();
    }

    public logout() {
        localStorage.clear();
        this.cfaSignInWidget.logout();
    }
}



