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
    selector: 'add-child-item',
    styleUrls: ['./add-child-item-dialog.component.scss'],
    templateUrl: './add-child-item-dialog.component.html'
})

export class AddChildItemDialogComponent {

    public options: LocationSet[];
    public input: FormControl = new FormControl();
    public subMenuOnly: FormControl = new FormControl();
    public parentAddPath;

    public parent: TreeNode;
    public selectedChild;

    public isLinear = true;
    public firstFormGroup: FormGroup;
    public secondFormGroup: FormGroup;
    public menuKey: MenuKey;
    public matchCount: number;
    public searched: boolean;

    public spinner = false;
    public color = '#e5173f';
    public mode = 'indeterminate';
    public diameter = 25;
    public response;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<AddChildItemDialogComponent>,
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
          if (value === true) {
            const subMenu = this.findSubMenuParent(this.parent, null);
            const subMenuAddPath = this.menuService.getParentCascadePathForSubmenu(subMenu.data.data.jsonPath, this.parent.data.data.tag);
            this.findParents(subMenuAddPath);
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

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public onSave(): void {
      const result = {
          item: this.input.value,
          parentPath: this.parentAddPath
      };
      this.dialogRef.close(result);
    }

    public onChange() {
        this.selectedChild = null;
    }

    public onSelect(e: MatAutocompleteSelectedEvent) {
        this.selectedChild = e.option.value;
    }

    public findParents(path) {
        this.parentAddPath = path;
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
                this.matchCount = results.count;
        });
    }
}
