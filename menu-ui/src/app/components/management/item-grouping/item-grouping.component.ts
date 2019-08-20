import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ItemService} from 'app/services/item/item.service';
import {ItemTypeService} from 'app/services/item-type/item-type.service';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Item} from 'app/services/item/item.model';
import {of, throwError} from 'rxjs';
import {ItemGroupingService} from 'app/services/item-grouping/item-grouping.service';
import {ChildItem} from 'app/services/item-grouping/child-item.model';
import {AttributeService} from 'app/services/attribute/attribute.service';
import {KEYS, TREE_ACTIONS, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import {catchError, debounceTime, map, mergeMap} from 'rxjs/operators';
import {ItemSummary} from 'app/services/menu/item-summary.model';
import {ItemEditComponent} from '../item/item-edit/item-edit.component';
import {AddItemDialogComponent} from '../../shared/add-item-dialog/add-item-dialog.component';
import {DialogService} from 'app/shared/dialog.service';
import {NotificationService} from 'app/shared/notification.service';
import {ItemAddComponent} from '../item/item-add/item-add.component';
import {FormControl} from '@angular/forms';
import {UserService} from "app/shared/user.service";
import {IUser} from "app/models/IUser";
import {isUndefined} from "util";

@Component({
  selector: 'app-item-grouping',
  styleUrls: ['./item-grouping.component.scss'],
  templateUrl: './item-grouping.component.html'
})
export class ItemGroupingComponent implements OnInit {
  public spinner: boolean = true;
  public itemGroupings: Item[];
  public itemTypes;
  public search: string;
  public selected: string = 'name';
  public selectDropDown = [{tag: 'tag', value: 'Item Tag'}, {tag: 'name', value: 'Item Name'}]; // limit filter to just these fields
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
  public user: IUser;

  @ViewChild('tree', { static: true }) public tree: TreeComponent;
  @ViewChild('basicMenu', { static: false }) public basicMenu: ContextMenuComponent;
  @ViewChild(ItemEditComponent, { static: true }) public itemEdit: ItemEditComponent;

  public nodes = [];

  public options = {
    getChildren: (node: TreeNode) => {
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
    },
    actionMapping: {
      mouse: {
        click: (tree: TreeModel, node: TreeNode, $event) => {
          node.setActiveAndVisible(false);
          this.selectedItem = node.data.data;
        },
        drop: (tree, node, $event, {from, to}) => {

          const fromPath = from.data.id;
          const fromPathParentTag = from.parent.id;
          const toPath = to.parent.id;
          TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});
          // tree.update();
          this.itemGroupingService.moveItem(toPath, fromPath, fromPathParentTag).subscribe(result => {

          })

        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
      }
    },
    allowDrag: (node) => {
      return !this.isReadOnly() && !node.isRoot;
    }
  };

  constructor(private itemService: ItemService,
              private itemTypeService: ItemTypeService, private titleService: Title,
              public dialog: MatDialog, private attributeService: AttributeService,
              private itemGroupingService: ItemGroupingService, private matSnackBar: MatSnackBar, private dialogService: DialogService,
              private notificationService: NotificationService,
              private userService: UserService) {
  }

  public  isReadOnly(): any {

    if(isUndefined(this.user)) {
      this.userService.getUser().subscribe((user) => {

        console.log(user)
        this.user = user;

        return  this.user.isReadOnly
      });
    }

    return this.user.isReadOnly;

  }

  public mapItemToNode = (item: ItemSummary) => {
    return {
      id: item.tag,
      name: item.name,
      hasChildren: item.grouping,
      data: item
    };
  }

  public ngOnInit() {
    this.titleService.setTitle('Management - Item/Modifier Groupings');
    this.isLoading = true;
    this.nodes = [];

    // load item groupings
    this.getAllItemGroupings();



    // load global attributes for filter dropdown
    this.attributeService.getAllGlobalAttributes().subscribe((res) => {
      this.globalAttributes = res;
      this.addSpecialAttributes();
      // this.buildGlobalAttributes();
    });

    // load item types
    this.itemTypeService.getAllItemTypesByItemClass('ITEM_GROUPING').pipe(
      map((res) => this.itemTypes = res),
      mergeMap(() => this.itemTypeService.getAllItemTypesByItemClass('MODIFIER_GROUPING'))
    ).subscribe((res) => {
      res.forEach((itemType) => this.itemTypes.push(itemType));
    });

    // subscribe to search
    this.searchField = new FormControl();
    this.searchField.valueChanges
      .pipe(debounceTime(300))
      .subscribe((term) => {
        this.filterNodes(term, this.selected);
      });
  }

  // Remove support for filtering by attributes since these aren't really used much
  // public buildGlobalAttributes() {
  //     for (const attribute of this.globalAttributes) {
  //         this.selectDropDown.push({tag: attribute.tag, value: attribute.name});
  //     }
  // }

  public getAllItemGroupings() {
    this.isLoading = true;
    this.itemGroupingService.getItemGroupings()
      .pipe(
        map((items) => items.map(this.mapItemToNode)),
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
    if (!this.isChanges() || this.user.isReadOnly) {
      this.refreshItems(bold);
    } else {
      this.dialogService.openConfirmDialog('You have pending changes on ' + this.selectedItemGrouping.name + '. Data will be Lost.', null)
        .afterClosed().subscribe((res) => {
        if (res) {
          this.refreshItems(bold);

          // } else {
          //   bold.selected = false;
          // code to get back to old selected item grouping
          // } As angular material doesn't have any way to control accordion now, will do later
        }
      });
    }
  }

  public refreshItems(bold) {
    this.childItems = null;
    this.selectedItemGrouping = JSON.parse(JSON.stringify(bold));
    this.itemGroupingService.getAllChildItems(bold.tag).subscribe((res) => {
      this.childItems = res;
    });
  }

  // Open same add component as Add Item
  public openCreateItemGroupingDialog(): void {
    if (this.globalAttributes && this.itemTypes) {
      const dialogRef = this.dialog.open(ItemAddComponent, {
        width: '700px',
        data: {
          showCreateItem: true, itemTypes: this.itemTypes,
          globalAttributes: this.globalAttributes
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        // refresh list only when new item has been saved
        if (result !== null && result === 'save') {
          this.notificationService.success('Added successfully');
          this.getAllItemGroupings();
          this.selectedItemGrouping = null;
        }
      });
    }
  }

  public deleteItem(itemNode: TreeNode) {
    const item = itemNode.data.data;
    if (itemNode.isRoot) {
      this.dialogService.openConfirmDialog('Are you sure you want to delete', item.name)
        .afterClosed().subscribe((res) => {
        if (res) {
          this.itemService.deleteItem(item.tag).subscribe(() => {
            this.notificationService.success('Deleted successfully');
            this.getAllItemGroupings();
            this.selectedItemGrouping = null;
            this.itemEdit.item = null;

          });
        }
      });
    } else {
      const parent = itemNode.parent.data.data;

      this.dialogService.openConfirmDialog('Are you sure you want to delete', item.name)
        .afterClosed().subscribe((res) => {
        if (res) {
          this.itemGroupingService.removeChildItem(parent.tag, item.tag)
            .subscribe(() => {
              this.notificationService.success('Deleted successfully');
              this.getAllItemGroupings();
              this.selectedItemGrouping = null;
              this.itemEdit.item = null;
              itemNode.parent.loadNodeChildren().then(function() {
              });
            });
        }

      });
    }
  }

  public toggleEnabled(node: TreeNode) {
    const item = node.data.data;
    const enable = !item.enabled;
    this.dialogService.openConfirmDialog(`Are you sure you want to ${enable ? 'enable' : 'disable'}`, item.name )
      .afterClosed().subscribe((res) => {
      if (res) {
        this.itemService.setEnabled(item.tag, !item.enabled).subscribe((res) => {
          const title = enable ? 'Enabled' : 'Disabled';
          this.notificationService.success(`${title}: ${item.name}`);
        });
        item.enabled = enable;
        node.treeModel.update();
      }
      return true;
    });

    return false;
  }

  public isEnabled(node) {
    return node.data.data.enabled;
  }


  public addChildItem(parentNode: TreeNode) {

    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((newItem) => {
      if (newItem && newItem.tag) {
        this.itemGroupingService.addChildItem(parentNode.data.data.tag, newItem.tag)
          .subscribe(() => {
            parentNode.loadNodeChildren().then(function() {
            });
          });
      }
    });
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
      const stripped = node.data.tag.replace(/[_-]/g, ''); // remove underscores
      return node.data.tag.toLowerCase().includes(searchText) || stripped.toLowerCase().includes(searchText);
    } else if (searchType === 'name') {
      return node.data.name.toLowerCase().includes(searchText);
    }
  }

  private addSpecialAttributes() { // do this for now
    let posIdCan = null;
    let posIdIndex = 0;
    this.globalAttributes.forEach((attr, i) => {
      if (attr.tag === 'POS_ID') {
        posIdIndex = i;
        posIdCan = JSON.parse(JSON.stringify(attr));
        posIdCan['tag'] = posIdCan['tag'] + '|CAN';
        posIdCan['name'] = posIdCan['name'] + ' (CAN)';
      }
    });
    this.globalAttributes.splice(posIdIndex + 1, 0, posIdCan);
  }

  itemChange(itemGroup) {
    let itemIndex = this.nodes.findIndex(attr => attr.id == itemGroup.tag);
    const node = this.nodes[itemIndex];
    node.enabled = itemGroup.enabled;
    node.name = itemGroup.name;
    this.nodes[itemIndex] = node;
    this.tree.treeModel.update();
  }
}
