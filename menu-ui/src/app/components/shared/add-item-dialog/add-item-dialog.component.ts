import {Component, Inject} from "@angular/core";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ItemService} from "../../../services/item/item.service";
import {FormControl} from "@angular/forms";
import {Item} from "../../../services/item/item.model";
import {IUser} from "app/models/IUser";
import {UserService} from "app/shared/user.service";

@Component({
  selector: 'add-item',
  styleUrls: ['./add-item-dialog.component.scss'],
  templateUrl: './add-item-dialog.component.html'
})


export class AddItemDialogComponent {

  options: Array<Item>;

  public isItemSelected: boolean = false;

  input: FormControl = new FormControl();

  public user:IUser;

  constructor(
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private itemService: ItemService,readonly  userService:UserService) {

    let itemTypeFilter = data.itemTypeFilter;

    this.input.valueChanges.subscribe((value: any) => {
        this.isItemSelected = false;
        if (typeof value === "string") {
          if (!value || value.length < 2 || value == 'input') {
            this.options = [];
            return;
          }

          itemService.filterItems(value, itemTypeFilter, 25).subscribe(results => {
            let items = results.items;
            let exactMatch = items.filter(i => i.tag == value || i.name == value);
            if (exactMatch.length > 0) {
              this.options = [];
              this.input.setValue(exactMatch[0]);
              this.isItemSelected = true;
            } else {
              this.options = results.items;
            }
          });
        }
      }
    );

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });


  }

  displayFn(option): string | undefined {
    return option ? option.name : undefined;
  }

  cancelAddItem(): void {
    this.dialogRef.close();
  }

  public itemSelected(e: MatAutocompleteSelectedEvent) {
    this.isItemSelected = true;
  }


}
