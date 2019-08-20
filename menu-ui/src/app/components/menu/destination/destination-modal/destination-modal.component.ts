import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { DestinationService } from 'app/services/destination/destination.service';
import { Destination } from 'app/services/destination/destination.model';
import { TagService } from 'app/services/tag/tag.service';
import { MenuService } from '../../../../services/menu/menu.service';

@Component({
  selector: 'destination-modal',
  templateUrl: './destination-modal.component.html',
  styleUrls: ['./destination-modal.component.scss']
})
// Adding new destinations for specific locations is no longer supported by business
// Keeping this for local purposes only
export class DestinationModalComponent implements OnInit {

  public destinations: Destination[];
  public selectedDestination: string = '';
  public dropdownDestination: boolean = false;
  public createNewDestination: boolean = false;
  public form: FormGroup;
  public cannotDeleteItem: boolean;

  constructor(public dialogRef: MatDialogRef<DestinationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private destinationService: DestinationService,
              private menuService: MenuService,
              private tagService: TagService) {
    this.dropdownDestination = this.data.createNewDestination;
  }

  public ngOnInit() {
    this.dialogRef.updatePosition({ top: '100px' });
    if (this.dropdownDestination) {
      this.getAllDestinations();
    }
  }

  public getAllDestinations() {
    this.destinationService.getAllDestinations().subscribe((res) => {
      this.updateDestinations(res);
    });
  }

  // remove existing destination maps so user can't map existing destinations to this location set
  public updateDestinations(res) {
    this.destinations = res.filter((x) => {
      dr: for (const d of this.data.destinationMappings) {
        if (x.tag !== d.tag) {
          continue dr;
        }
        return false;
      }
      return true;
    });
  }

  // create new destination map
  public destinationMap() {
        this.menuService.createEmptyMenu(this.selectedDestination, this.data.locationSet.tag).subscribe((res) => {
      this.dialogRef.close('save');
    });
  }

  // create new destination form
  public createNew() {
    this.dropdownDestination = false;
    this.createNewDestination = true;
    this.form = new FormGroup({
      name: new FormControl('', ),
      tag: new FormControl('', ),
      description: new FormControl('')
    });
  }

  // Check Tag Exists
  public findTagExists() {
    if (this.form.controls['tag'].valid) {
      this.tagService.getDestinationTags(this.form.get('tag').value).subscribe((res) => {
        if (res.response) {
          this.form.controls['tag'].setErrors({tagExists: true});
        }
      });
    }
  }

  // Create new destination
  public OnSubmit() {
    if (this.form.valid) {
      const destination = {
        name: this.form.controls['name'].value,
        tag: this.form.controls['tag'].value,
        enabled: true
      };
      this.destinationService.saveDestination(destination)
        .subscribe((res) => {
          this.selectedDestination = this.form.controls['tag'].value;
          this.destinationMap();
        });
    }
  }

  // Close Modal
  public onNoClick(): void {
    this.dialogRef.close();
  }

}
