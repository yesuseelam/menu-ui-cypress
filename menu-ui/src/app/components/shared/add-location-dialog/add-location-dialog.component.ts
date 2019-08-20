import { Component, Inject } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { LocationSetService } from '../../../services/location-set/location-set.service';
import { LocationSet } from '../../../services/location-set/location-set.model';

@Component({
    selector: 'add-location',
    styleUrls: ['./add-location-dialog.component.scss'],
    templateUrl: './add-location-dialog.component.html'
})

export class AddLocationDialogComponent {

    public options: LocationSet[];

    public addItemToggle: boolean = false;

    public input: FormControl = new FormControl();

    constructor(
        public dialogRef: MatDialogRef<AddLocationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private locationSetService: LocationSetService) {

        this.input.valueChanges.subscribe((value: any) => {
                if (typeof value === 'string') {
                    if (!value || value.length < 2) {
                        this.options = [];
                        return;
                    }

                    locationSetService.filterLocations(value, 25).subscribe((results) => {
                        this.options = results.menuLocations;
                    });
                }
            }
        );

    }

    public displayFn(option): string | undefined {
        return option ? option.name : undefined;
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public doStuff(e: MatAutocompleteSelectedEvent) {
        this.addItemToggle = true;
    }

}
