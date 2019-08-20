import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Item} from '../../../services/item/item.model';
import {of, throwError} from 'rxjs';
import {ItemGroupingService} from '../../../services/item-grouping/item-grouping.service';
import {ChildItem} from '../../../services/item-grouping/child-item.model';
import {KEYS, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import {catchError, debounceTime, map} from 'rxjs/operators';
import {ItemEditComponent} from '../item/item-edit/item-edit.component';
import {DialogService} from '../../../shared/dialog.service';
import {FormControl, FormGroup} from '@angular/forms';
import {EmergencyItemService} from "../../../services/emergency-item/emergency-item.service";
import {EmergencyItem} from "../../../services/emergency-item/emergency-item.model";

@Component({
  selector: 'app-emergency-item',
  styleUrls: ['./emergency-item.component.scss'],
  templateUrl: './emergency-item.component.html'
})
export class EmergencyItemComponent implements OnInit {
  public spinner: boolean = true;
  public itemGroupings: Item[];
  public itemTypes;
  public search: string;
  public selected: string = 'name';
  public selectDropDown = [{tag: 'name', value: 'Item Name'}, {tag: 'tag', value: 'Item Tag'}]; // limit filter to just these fields
  public selectedItemGrouping: Item;
  public globalAttributes;
  public color = '#e5173f';
  public mode = 'indeterminate';
  public diameter = 50;
  public childItems: ChildItem[];
  public config: MatDialogConfig;
  public selectedItem: Item;
  public isLoading: boolean = false;
  public searchField;
  public nodesCache;
  public form: FormGroup;

  @ViewChild('tree', { static: true }) public tree: TreeComponent;
  @ViewChild(ItemEditComponent, { static: true }) public itemEdit: ItemEditComponent;

  public nodes = [];

  public options = {
    getChildren: (node: TreeNode) => {
      if( node.data.data.tag === null) {
        return this.emergencyItemService.getEmergencyFeatureItems(node.data.name)
          .pipe(
            map((items) => items.map(this.mapItemToNode)),
            catchError((val) => {
              const errorMessage = `Server side error expanding ${node.data.name}`;
              this.matSnackBar.open(errorMessage, 'Error', {
                duration: 3000
              });
              node.collapse();
              return of(errorMessage);
            })
          )
          .toPromise();
      } else {
        return this.itemGroupingService.getAllChildItems(node.id)
          .pipe(
            map((items) => items.map(this.mapItemToNode)),
            catchError((val) => {
              const errorMessage = `Server side error expanding ${node.data.name}`;
              this.matSnackBar.open(errorMessage, 'Error', {
                duration: 3000
              });
              node.collapse();
              return of(errorMessage);
            })
          )
          .toPromise();
      }
    },
    actionMapping: {
      mouse: {
        click: (tree: TreeModel, node: TreeNode, $event) => {
          node.setActiveAndVisible(false);
          this.selectedItem = node.data.data;
        },
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
      }
    },
    allowDrag: true
  };

  constructor(private emergencyItemService: EmergencyItemService, private titleService: Title,
              public dialog: MatDialog, private matSnackBar: MatSnackBar, private dialogService: DialogService,
              private itemGroupingService: ItemGroupingService) {

  }

  public mapItemToNode = (item: EmergencyItem) => {
    return {
      id: item.tag,
      name: item.name ,
      hasChildren: item.grouping,
      data: item
    };
  }

  public mapEmergencyToNode = (item: EmergencyItem) => {
    return {
      id: item.emergency,
      name: item.emergency ,
      hasChildren: item.grouping,
      data: item
    };
  }

  public ngOnInit() {
    this.titleService.setTitle('Management - Emergency/Item Groupings');
    this.isLoading = true;
    this.nodes = [];
    this.form = this.createFormGroup();



    // load Emergency Items
    this.getAllEmergencyFeatures();

    // subscribe to search
    this.searchField = new FormControl();
    this.searchField.valueChanges
      .pipe(debounceTime(300))
      .subscribe((term) => {
        this.filterNodes(term, this.selected);
      });
  }


  public getAllEmergencyFeatures() {
    this.isLoading = true;
    this.emergencyItemService.getEmergencyFeatures()
      .pipe(

        map((emergencies) => emergencies.map(this.mapEmergencyToNode)),
        catchError((val) => {
          const errorMessage = `Server side error loading menu. `;
          this.matSnackBar.open(errorMessage, 'Error', {
            duration: 3000
          });
          this.isLoading = false;
          return throwError(errorMessage);
        })
      )
      .subscribe((items) => {
        this.nodes = items;
        this.nodesCache = items;
        this.isLoading = false;
      });
  }

  public isChanges() {
    return this.itemEdit.form.dirty;
  }

  public makeBold(bold) {
    if (!this.selectedItemGrouping || this.selectedItemGrouping.tag !== bold.tag) {
      this.setBoldStatus(bold);
    }
  }

  public setBoldStatus(bold) {
    if (!this.isChanges()) {
      this.refreshItems(bold);
    } else {
      this.dialogService.openConfirmDialog('You have pending changes on ' + this.selectedItemGrouping.name + '. Data will be Lost.', null)
        .afterClosed().subscribe((res) => {
        if (res) {
          this.refreshItems(bold);

        }
      });
    }
  }

  public refreshItems(bold) {
    this.childItems = null;
    this.selectedItemGrouping = JSON.parse(JSON.stringify(bold));
    this.emergencyItemService.getEmergencyFeatureItems(bold.tag).subscribe((res) => {
      this.childItems = res;
    });
  }

  public isEnabled(node) {
    return node.data.enabled;
  }

  // Filter by directly manipulating source nodes list instead of traversing tree model (e.g. filterNodes2 below)
  public filterNodes(value: string, selected: string) {
    if (value !== undefined) {
      if (value.trim().length > 0) {
        this.nodes = [];
        this.nodesCache.forEach((node) => {
          const match = this.filter(value, selected, node);
          if (match) { this.nodes.push(node); }
        });
      } else {
        this.nodes = this.nodesCache;
      }
    }
  }

  // For reference only. Using the TreeModel API for filtering is extremely slow
  public filterNodes2(value: string, selected: string) {
    const treeModel = this.tree.treeModel;
    if (treeModel.roots && value !== undefined) {
      if (value.trim().length > 0) {
        treeModel.roots.forEach((node) => {
          const match = this.filter(value, selected, node);
          if (match) {
            node.show();
          } else {
            node.hide();
          }
        });
      } else {
        treeModel.clearFilter();
      }
    }
  }

  public filter(searchText, searchType, node: TreeNode) {
    if (searchText) {
      searchText = searchText.toLowerCase();
    }
    if (searchType === 'tag') {
      const stripped = node.data.id.replace(/[_-]/g, ''); // remove underscores
      return node.data.id.toLowerCase().includes(searchText) || stripped.toLowerCase().includes(searchText);
    } else if (searchType === 'name') {
      return node.data.name.toLowerCase().includes(searchText);
    }
  }


  public createFormGroup() {
    return new FormGroup({
    });
  }

}
