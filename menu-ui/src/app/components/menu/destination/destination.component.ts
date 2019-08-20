import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DestinationService } from 'app/services/destination/destination.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Destination } from 'app/services/destination/destination.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DestinationModalComponent } from './destination-modal/destination-modal.component';
import { MenuCopyComponent } from '../menu-copy/menu-copy.component';

@Component({
  selector: 'app-destination',
  styleUrls: ['./destination.component.scss'],
  templateUrl: './destination.component.html'
})
export class DestinationComponent implements OnChanges {

  @Input()
  public locationSet;

  @Input()
  public locationSetType;

  public destinationMappings: Destination[];
  public showAllDestinations: boolean = true; // set to false for manually adding menus in local purposes only

  @Output()
  public selectedDestination: EventEmitter<Destination> = new EventEmitter();

  @ViewChild('basicMenu', { static: false }) public basicMenu: ContextMenuComponent;
  public config: MatDialogConfig;

  public isLoading: boolean;

  public showCopyMenu: boolean;

  constructor(
    private destinationService: DestinationService,
    public dialog: MatDialog) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['locationSet']) {
      if (!changes['locationSet'].firstChange && changes['locationSet'].currentValue) {
        this.showDestinations(this.locationSet.tag);
      } else if (!changes['locationSet'].currentValue && changes['locationSet'].previousValue) {
        this.destinationMappings = null;
      }
    }
    this.showCopyMenu = this.isChainMenu();
  }

  public getAllDestinations() {
    this.isLoading = true;
    this.destinationService.getAllDestinations().subscribe((res) => {
      this.destinationMappings = res;
      this.isLoading = false;
    });
  }

  public getDestinationsByLocation(tag) {
    this.isLoading = true;
    this.destinationService.getAllDestinationMappings(tag).subscribe((res) => {
      this.destinationMappings = res;
      this.isLoading = false;
    });
  }

  public showDestinations(tag) {
    if (this.showAllDestinations) {
      this.getAllDestinations();
    } else {
      this.getDestinationsByLocation(tag);
    }
  }

  public selectDestination(destination) {
    for (const d of this.destinationMappings) {
      if (d.selected) {
        d.selected = false;
      }
      if (d.tag === destination.tag) {
        destination.selected = true;
        this.selectedDestination.emit(destination);
      }
    }
  }

  public openCreateDestinationDialog() { // keeping this for local purposes
    if (this.destinationMappings) {
      const dialogRef = this.dialog.open(DestinationModalComponent, {
        width: '450px',
        data: {
          destinationMappings: this.destinationMappings,
          createNewDestination: true,
          locationSet: this.locationSet
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== null && result === 'save') {
          this.showDestinations(this.locationSet.tag);
        }
      });
    }
  }

  public openCopyMenuDialog() {
    if (this.destinationMappings) {
      const dialogRef = this.dialog.open(MenuCopyComponent, {
        width: '450px',
        data: {
          locationSet: this.locationSet
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== null && result === 'save') {
          this.showDestinations(this.locationSet.tag);
        }
      });
    }
  }

  private isChainMenu() {
    if ((this.locationSetType && this.locationSetType.tag === 'CHAIN') && (this.locationSet && this.locationSet.tag === 'CHAIN')) {
      return true;
    } else {
      return false;
    }
  }

}
