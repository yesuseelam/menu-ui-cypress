
import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-management',
  styleUrls: ['./management.component.scss'],
  templateUrl: './management.component.html'
})
export class ManagementComponent implements OnInit {
  tabHeading: string = 'Items';
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        switch (event.url) {
          case '/management/items':
            {
              this.tabHeading = 'Items';
              break;
            }
          case '/management/item-types':
            {
              this.tabHeading = 'Item Types';
              break;
            }
          case '/management/item-groupings':
            {
              this.tabHeading = 'Item Groupings';
              break;
            }
          case '/management/location-set-types':
            {
              this.tabHeading = 'Location Set Types';
              break;
            }
          case '/management/location-sets':
            {
              this.tabHeading = 'Location Sets';
              break;
            }
          case '/management/attributes':
            {
              this.tabHeading = 'Attributes';
              break;
            }
          case '/management/emergencyitems':
          {
            this.tabHeading = 'Emergency Items';
            break;
          }
        }
      }
    });
  }

  ngOnInit() {

  }

}


