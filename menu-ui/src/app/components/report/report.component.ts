import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ReportService } from 'app/services/report/report-service';
import { DestinationService } from 'app/services/destination/destination.service';
import { FormControl } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { LocationSetService } from 'app/services/location-set/location-set.service';

@Component({
  selector: 'app-report',
  styleUrls: ['./report.component.scss'],
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  public screens = [
    { name: 'Nutrition', selected: true },
    { name: 'Global Menus', selected: false },
    { name: 'Location Specific Menus', selected: false }
  ];
  public destinations;
  public destinationHeading = 'Nutrition';
  public pushMenuToggle: boolean;
  public selectedDestination;
  public filteredLocations;
  public heading;
  public disableBtnClick: boolean;
  public errorDisplay: boolean;
  public errorMessage: string;
  public color = '#e5173f';
  public mode = 'indeterminate';
  public diameter = 50;
  public locationCtrl: FormControl;
  public selectedCountry;
  public countries = [
    { name: 'US', code: 'US' },
    { name: 'Canada', code: 'CAN' }
  ];
  private locationSetCache: {};

  constructor(private sanitizer: DomSanitizer,
              private destinationService: DestinationService,
              private locationSetService: LocationSetService,
              private titleService: Title,
              private reportService: ReportService) {
    this.locationCtrl = new FormControl();

  }

  public ngOnInit() {
    this.titleService.setTitle('Reports | Nutrition');
    this.locationSetCache = {};
    this.getLocations();
    this.locationCtrl.valueChanges.subscribe((value) => {
          if (!value || typeof value === 'object') {
            return;
          }
          this._filter(value);
        }
    );
  }

  public selectedScreen(screen) {
    if (screen.name !== this.destinationHeading) {
      this.setSelectedFalse();
      this.selectedDestination = null;
      this.destinationHeading = screen.name;
      screen.selected = true;
      this.resetLocationSetCntrl();
    }
    if (screen.name === 'Global Menus') {
      this.getAllDestinationsForGlobalMenu();
    }
    this.titleService.setTitle('Reports | ' + this.destinationHeading);
  }

  public getAllDestinationsForGlobalMenu() {
    this.destinationService.getAllDestinationsForGlobalMenu().subscribe((res) => {
      this.destinations = res;
    });
  }

  public setSelectedFalse() {
    for (const screen of this.screens) {
      screen.selected = false;
    }
  }

  public getDestinationsByLocation(location) {
    this.destinationService.getAllDestinationsByLocationSetTag(location.tag).subscribe((res) => {
      this.destinations = res;
    });
  }

  public getLocations() {
    this.locationSetService.getAllLocationSetsByTag('LOCATION').subscribe((res) => {
      this.filteredLocations = [];
      this.locationSetCache['LOCATION'] = res;
    });
  }

  public getGlobalMenu() {
    this.disableBtnClick = true;
    this.reportService.getGlobalMenu(this.selectedDestination).subscribe((res) => {
      this.generateDownloadFile(res, 'Global-Menu for ' + this.findNameofDestination(this.selectedDestination));
      this.disableBtnClick = false;
      this.errorDisplay = false;
    }, (error) => {
      this.handleError(error);
    });
  }

  public handleError(error) {
    this.disableBtnClick = false;
    this.errorDisplay = true;
    this.errorMessage = error.message;
  }

  public findNameofDestination(tag) {
    return this.destinations.filter((destination) => destination.tag === tag)[0].name;
  }

  public getNutrition() {
    this.disableBtnClick = true;
    this.reportService.getNutritionData(this.selectedCountry).subscribe((res) => {
      this.generateDownloadFile(res, 'Nutrition Data for ' + this.selectedCountry);
      this.disableBtnClick = false;
    });
  }

  public getLocationSpecificMenu() {
    this.disableBtnClick = true;
    this.reportService.getLocationSpecificMenu(this.selectedDestination, this.locationCtrl.value.tag)
      .subscribe((res) => {
        this.generateDownloadFile(res, 'LOC_' + this.locationCtrl.value.tag
          + '_' + this.selectedDestination);
        this.disableBtnClick = false;
      });
  }

  public generateDownloadFile(res, heading) {
    this.heading = heading + '.json';
    const blob = new Blob([JSON.stringify(res)], { type: 'text/json;charset=utf-8' });
    FileSaver.saveAs(blob, this.heading);
  }

  public displayFn(locationSet): string {
    if (!locationSet) {
      return locationSet;
    }
    return locationSet.name;
  }

  public resetLocationSetCntrl() {
    this.locationCtrl.patchValue(null);
  }

  private _filter(value: string) {
    if (value) { value = value.toLowerCase(); }
    const filtered = this.locationSetCache['LOCATION'].filter((location) => location.name.toLowerCase().includes(value) || location.tag.includes(value));
    this.filteredLocations = filtered.length < 500 ? filtered : [];
    this.filteredLocations.sort((val1, val2) => {
      if (val1.name < val2.name) { return -1; }
      if (val1.name > val2.name) { return 1; }
      return 0;
    });
  }

}
