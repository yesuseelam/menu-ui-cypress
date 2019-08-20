import { Component, Inject } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LocationSet } from 'app/services/location-set/location-set.model';
import { TreeNode } from 'angular-tree-component';
import { ItemService } from 'app/services/item/item.service';
import { MenuService } from 'app/services/menu/menu.service';
import { MenuKey } from 'app/services/menu/menu-key.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from 'app/shared/notification.service';

@Component({
    selector: 'delete-child-item',
    styleUrls: ['./delete-child-item-dialog.component.scss'],
    templateUrl: './delete-child-item-dialog.component.html'
})

export class DeleteChildItemDialogComponent {

    public options: LocationSet[];
    public deleteItemToggle = false;
    public input: FormControl = new FormControl();
    public subMenuOnly: FormControl = new FormControl();
    public parentDeletePath;
    public childDeletePath;

    public parent: TreeNode;
    public selectedChild;

    public isLinear = true;
    public firstFormGroup: FormGroup;
    public secondFormGroup: FormGroup;
    public menuKey: MenuKey;
    public parentCount: number;
    public childCount: number;
    public searched: boolean;

    public spinner = false;
    public color = '#e5173f';
    public mode = 'indeterminate';
    public diameter = 25;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<DeleteChildItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private itemService: ItemService,
        private menuService: MenuService,
        private notificationService: NotificationService) {

        this.input.valueChanges.subscribe((value: any) => {
                if (typeof value === 'string') {
                    if (!value || value.length < 2) {
                        this.options = [];
                        return;
                    }

                    itemService.filterItems(value, null, 25).subscribe((results) => {
                        const items = results.items;
                        const exactMatch = items.filter((i) => i.tag === value);
                        if (exactMatch.length > 0) {
                            this.options = exactMatch;
                        } else {
                            this.options = results.items;
                        }
                    });
                }
            }
        );

        this.parent = data.parent;
        this.menuKey = data.menuKey;

        this.firstFormGroup = this.formBuilder.group({
            subMenuOnly: new FormControl('', ),
        });
        this.secondFormGroup = this.formBuilder.group({
            input: new FormControl('', ),
        });

        const allPath = this.menuService.getParentCascadePathForAll(this.parent.data.data.tag);
        this.findParents(allPath);
        this.subMenuOnly.valueChanges.subscribe((value: any) => {
          this.input.setValue(null);
          this.searched = true;
          this.selectedChild = null;
          this.childCount = 0;
          if (value === true) {
            const subMenu = this.findSubMenuParent(this.parent, null);
            const subMenuDeletePath = this.menuService.getParentCascadePathForSubmenu(subMenu.data.data.jsonPath,
                this.parent.data.data.tag);
            this.findParents(subMenuDeletePath);
          } else {
            this.findParents(allPath);
          }
        });
    }

    private findSubMenuParent(parent: TreeNode, previousParent: TreeNode): TreeNode {
      const nextParent = parent.parent;
      if (nextParent === null) {
        return previousParent; // submenu is the last previous parent before reaching root which has no more parent
      }
      return this.findSubMenuParent(nextParent, parent);
    }

    public displayFn(option): string | undefined {
        return option ? option.name : undefined;
    }

    public onSave(): void {
      const result = {
        item: this.input.value,
        childPath: this.childDeletePath
      };
      this.dialogRef.close(result);
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public onChange() {
        this.selectedChild = null;
    }

    public onSelect(e: MatAutocompleteSelectedEvent) {
        this.searched = true;
        this.spinner = true;
        this.deleteItemToggle = false;
        this.selectedChild = e.option.value;

        const path = this.menuService.getDeleteCascadePath(this.parentDeletePath, e.option.value.tag);
        this.menuService.evaluateJsonPath(this.menuKey, path)
            .pipe(
                catchError((val) => {
                    const errorMessage = 'Error searching child nodes for parent';
                    this.notificationService.error(errorMessage);
                    return throwError(errorMessage);
                })
            )
            .subscribe((results) => {
                this.spinner = false;
                this.childCount = results.count;
                if (results.count > 0) {
                    this.deleteItemToggle = true;
                    this.childDeletePath = path;
                }
        });
    }

    public findParents(path) {
      this.parentDeletePath = path;
      this.spinner = true;
      this.menuService.evaluateJsonPath(this.menuKey, path)
        .pipe(
          catchError((val) => {
            const errorMessage = 'Error searching parent nodes';
            this.notificationService.error(errorMessage);
            return throwError(errorMessage);
          })
        )
        .subscribe((results) => {
          this.searched = true;
          this.spinner = false;
          this.parentCount = results.count;
        });
    }
}
