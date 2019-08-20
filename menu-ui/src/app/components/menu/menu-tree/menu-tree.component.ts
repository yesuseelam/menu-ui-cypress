import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from "@angular/core";
import {MenuService} from "app/services/menu/menu.service";
import {ItemSummary} from "app/services/menu/item-summary.model";
import {MenuKey} from "app/services/menu/menu-key.model";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {KEYS, TreeComponent, TreeModel, TreeNode} from "angular-tree-component";
import {catchError, map} from "rxjs/operators";
import {of, throwError} from "rxjs";
import {ContextMenuComponent} from "ngx-contextmenu";
import {AddItemDialogComponent} from "../../shared/add-item-dialog/add-item-dialog.component";
import {AddChildItemDialogComponent} from '../../shared/add-child-item-dialog/add-child-item-dialog.component';
import {NotificationService} from "app/shared/notification.service";
import {DialogService} from "app/shared/dialog.service";
import {MenuEditComponent} from "../menu-edit/menu-edit.component";
import {DeleteChildItemDialogComponent} from '../../shared/delete-child-item-dialog/delete-child-item-dialog.component';
import {UserService} from "app/shared/user.service";
import {IUser} from "app/models/IUser";


@Component({
  selector: 'app-menu-tree',
  styleUrls: ['./menu-tree.component.scss'],
  templateUrl: './menu-tree.component.html'
})

export class MenuTreeComponent implements OnInit, OnChanges {

  @Input()
  public menuKey: MenuKey;

  @Output()
  public selectedItem: EventEmitter<string> = new EventEmitter();

  public spinner: boolean = true;

  public isLoading: boolean = false;

  private dragAndDropDefaultButtonText: string = 'Enable Drag & Drop';
  private dragAndDropButtonText: string = this.dragAndDropDefaultButtonText;

  private isDragAndDropEnabled = false;

  public isEmpty: boolean = false;
  public user: IUser;

  @ViewChild(TreeComponent, {static: false}) public menuTree: TreeComponent;

  @ViewChild(MenuEditComponent, {static: false}) public menuEditComponent: MenuEditComponent;

  @ViewChild(ContextMenuComponent, {static: false}) public contextMenu: ContextMenuComponent;

  public nodes = [];

  public options = {
    getChildren: (node: TreeNode) => {
      return this.menuService.getMenuItems(this.menuKey, node.data.data.jsonPath + '.items[*]')
        .pipe(
          map((items) => items.map(this.mapItemToNode)),
          catchError((val) => {
            const errorMessage = `Server side error expanding ${node.data.name}`;
            this.notificationService.error(`Server side error expanding ${node.data.name}`);
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
          this.selectedItem.emit(node.data.data.jsonPath);
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
      }
    },
    allowDrag: (node) => {
      return this.isDragAndDropEnabled;
    },
    allowDrop: (node) => {
      return this.isDragAndDropEnabled;
    }
  };

  constructor(private menuService: MenuService, private matSnackBar: MatSnackBar, private dialog: MatDialog, private dialogService: DialogService,
              private notificationService: NotificationService,
              private userService: UserService) {
  }

  public ngOnInit(): void {

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  public onMoveNode($event) {
    const dragNode = $event.node;
    const targetParent = $event.to.parent;
    const treeModel = this.menuTree.treeModel;
    const parentNode: TreeNode = treeModel.getNodeById(targetParent.id);
    let fromPath = dragNode.data.path;
    let toPath = targetParent.data ? `${targetParent.data.path}/items/${$event.to.index}` : `/categories/${$event.to.index}`;

    this.menuService.moveMenuItem(this.menuKey, fromPath, toPath).subscribe(response => {
      if (parentNode) {
        parentNode.loadNodeChildren().then(function () {
        });
      } else {
        this.reloadMenu();
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.menuKey) {
      return;
    }
    this.loadMenu(this.menuKey);
  }

  get isMenuSelected(): boolean{
    return this.menuKey != null;
  }

  public loadMenu(menuKey) {
    this.isLoading = true;
    this.isEmpty = false;
    this.nodes = [];
    if (this.menuTree) {
      this.menuTree.treeModel.collapseAll();
      this.menuTree.treeModel.setState({expandedNodeIds: {}});
    }
    this.menuService.getMenuItems(menuKey)
      .pipe(
        map((items) => items.map(this.mapItemToNode)),
        catchError((val) => {
          const errorMessage = `Server side error loading menu. `;
          this.notificationService.error('Server side error loading menu. ');
          const message = val.error.message ? val.error.message : val.error;
          // Reuse Confirm dialog for now. Consider replacing with another dialog with just OK button
          this.dialogService.openConfirmDialog(message, null);
          this.isLoading = false;
          return throwError(errorMessage);
        })
      )
      .subscribe((items) => {
        this.nodes = items;
        this.isLoading = false;
        if (this.nodes.length === 0) {
          this.isEmpty = true;
        }
      });
  }

  private reloadMenu() {
    this.loadMenu(this.menuKey);
  }

  public mapItemToNode = (item: ItemSummary) => {
    return {
      id: item.id,
      name: item.name,
      hasChildren: item.childCount > 0,
      data: item
    };
  };

  public toggleEnabled(itemNode: TreeNode) {
    const item = itemNode.data.data;
    const action = !item.disabled ? 'disable' : 'enable';
    this.dialogService.openConfirmDialog(`Are you sure you want to ${action} ${item.name}?`, null)
      .afterClosed().subscribe((res) => {
      if (res) {
        this.spinner = true;
        this.menuService.updateMenuItem(this.menuKey, item.jsonPath, {disabled: !item.disabled}).subscribe((result) => {
          item.disabled = !item.disabled;
          this.spinner = false;
          const title = item.disabled ? 'Disabled' : 'Enabled';
          this.notificationService.success(`${title}: ${item.name}` + 'Success');
          itemNode.loadNodeChildren().then(function () {
          });
        });
        return true;
      }
      return false;
    });
  }

  public deleteItem(itemNode: TreeNode) {
    const item = itemNode.data.data;
    this.dialogService.openConfirmDialog("Are you sure you want to delete '" + item.name + "' and all items under it?", null)
      .afterClosed().subscribe((res) => {
      if (res) {

        this.menuService.deleteMenuItem(this.menuKey, item).subscribe((result) => {
          if (!itemNode.isRoot) {
            const parentNode = itemNode.parent;
            parentNode.loadNodeChildren().then(function () {
            });
          } else {
            this.loadMenu(this.menuKey);
          }

          this.notificationService.success('Deleted : ' + item.name);
          this.selectedItem.emit(null);

          //
        });
        return true;
      }
    });

    return false;
  }

  public deleteItemCascade(parentNode: TreeNode) {

    const dialogRef = this.dialog.open(DeleteChildItemDialogComponent, {
      width: '700px',
      height: '370px',
      data: {
        parent: parentNode,
        menuKey: this.menuKey
      }
    });

    dialogRef.afterClosed().subscribe((deleteResult) => {
      const child = deleteResult ? deleteResult.item : null;
      if (child && parentNode) {
        this.isLoading = true;
        console.log('Delete cascade child ' + child.tag + ' under parent ' + parentNode.data.data.tag);
        console.log('Delete path: ' + deleteResult.childPath);
        this.menuService.deleteMenuItemCascade(this.menuKey, deleteResult.childPath)
          .subscribe((result) => {
            this.loadMenu(this.menuKey); // load entire tree since deleted children/descendants may be multiple levels down from parent
            this.notificationService.success('Deleted Successfully');
            this.isLoading = false;
          });
        return true;
      }
    });
  }

  public reloadItems(jsonPath: string) {
    if (jsonPath) {
      let node: TreeNode = this.menuTree.treeModel.getNodeById(jsonPath);
      node.loadNodeChildren().then(function () {

      });
    } else {
      this.loadMenu(this.menuKey);
    }
  }

  public selectItem(jsonPath: string) {
    let node: TreeNode = this.menuTree.treeModel.getNodeById(jsonPath);
    node.setIsActive(true);
  }

  public addItem(parentNode: TreeNode, itemTypeFilter: string = null) {

    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width: '600px',
      data: {
        itemTypeFilter: itemTypeFilter
      }
    });

    dialogRef.afterClosed().subscribe((newItem) => {
      if (newItem) {
        this.isLoading = true;
        if (parentNode) {
          this.isLoading = true;
          this.menuService.addMenuItem(this.menuKey, parentNode.data.data, newItem).subscribe((response) => {
            this.isLoading = false;
            this.notificationService.success('Added Successfully');
            parentNode.loadNodeChildren().then(function () {

            });

          });
        } else {
          this.isLoading = true;
          this.menuService.addMenuItem(this.menuKey, null, newItem).subscribe((response) => {
            this.isLoading = false;
            this.notificationService.success('Added Successfully');
            this.loadMenu(this.menuKey);
          });
        }
      }
    });
  }

  public addItemCascade(parentNode: TreeNode) {

    const dialogRef = this.dialog.open(AddChildItemDialogComponent, {
      width: '700px',
      height: '370px',
      data: {
        parent: parentNode,
        menuKey: this.menuKey
      }
    });

    dialogRef.afterClosed().subscribe((addResult) => {
      const child = addResult ? addResult.item : null;
      if (child && parentNode) {
        this.isLoading = true;
        console.log('Add cascade child ' + child.tag + ' under parent ' + parentNode.data.data.tag);
        console.log('Add path: ' + addResult.parentPath);
        this.menuService.addMenuItemCascade(this.menuKey, addResult.parentPath, child.tag)
          .subscribe((result) => {
            this.loadMenu(this.menuKey); // load entire tree since there may be multiple parents from root
            this.notificationService.success('Added Successfully');
            this.isLoading = false;
          });
        return true;
      }
    });
  }

  public addSubMenu() {
    this.addItem(null, 'SUBMENU');
  }

  public isSubmenu(itemNode: TreeNode) {
    return itemNode.parent === null || itemNode.parent.parent === null; // submenu > root > null
  }

  toggleDragAndDrop(){
    this.isDragAndDropEnabled = !this.isDragAndDropEnabled;
    if(this.isDragAndDropEnabled){
      this.dragAndDropButtonText = 'Disable Drag & Drop';
    } else {
      this.dragAndDropButtonText = this.dragAndDropDefaultButtonText;
    }
  }
}
