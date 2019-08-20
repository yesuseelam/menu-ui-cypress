
import { Component, Input } from '@angular/core';
import { ChildItem } from '../../../../services/item-grouping/child-item.model';

@Component({
  selector: 'app-child-item',
  styleUrls: ['./child-item.component.scss'],
  templateUrl: './child-item.component.html'
})
export class ChildItemComponent {
  @Input()
  childItems: ChildItem[];
  constructor() {
  }

}
