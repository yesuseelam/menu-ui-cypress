import {Routes} from '@angular/router';
import {MenuComponent} from './components/menu/menu.component';
import {ReportComponent} from './components/report/report.component';
import {OktaAuthGuard} from './guards/activate/okta-guard.guard';
import {ConfirmItemDeactivateGuard} from './core/guards/management/item.guard';
import {ConfirmItemGDeactivateGuard} from './core/guards/management/item-g.guard';
import {ConfirmAttributeDeactivateGuard} from './core/guards/management/attribute.guard';
import {ConfirmItemTypeDeactivateGuard} from './core/guards/management/item-type.guard';
import {ConfirmLSTDeactivateGuard} from './core/guards/management/location-set-type.guard';
import {ConfirmLSDeactivateGuard} from './core/guards/management/location-set.guard';

import {ManagementComponent} from './components/management/management.component';
import {AttributeComponent} from './components/management/attribute/attribute.component';
import {ItemComponent} from './components/management/item/item.component';
import {ItemGroupingComponent} from './components/management/item-grouping/item-grouping.component';
import {ItemTypeComponent} from './components/management/item-type/item-type.component';
import {LocationSetComponent} from './components/management/location-set/location-set.component';
import {LocationSetTypeComponent} from './components/management/location-set-type/location-set-type.component';
import {EmergencyItemComponent} from "app/components/management/emergency-item/emergency-item.component";

export const ROUTES: Routes = [
   // {path: 'id_token', redirectTo: 'menu', pathMatch: 'full'},
    {path: '', redirectTo: 'menu', pathMatch: 'full'},
    {path: 'menu', component: MenuComponent, canActivate: [OktaAuthGuard]},
    {path: 'reports', component: ReportComponent},
    {
        path: 'management', component: ManagementComponent,
        children: [
            {path: '', redirectTo: 'items', pathMatch: 'full'},
            {path: 'items', component: ItemComponent, canDeactivate: [ConfirmItemDeactivateGuard], canActivate: [OktaAuthGuard]},
            {path: 'item-groupings', component: ItemGroupingComponent, canDeactivate: [ConfirmItemGDeactivateGuard], canActivate: [OktaAuthGuard]},
            {path: 'item-types', component: ItemTypeComponent, canDeactivate: [ConfirmItemTypeDeactivateGuard], canActivate: [OktaAuthGuard]},
            {
                path: 'location-set-types',
                component: LocationSetTypeComponent,
                canDeactivate: [ConfirmLSTDeactivateGuard], canActivate: [OktaAuthGuard]
            },
            {path: 'location-sets', component: LocationSetComponent, canDeactivate: [ConfirmLSDeactivateGuard], canActivate: [OktaAuthGuard]},
            {path: 'attributes', component: AttributeComponent, canDeactivate: [ConfirmAttributeDeactivateGuard], canActivate: [OktaAuthGuard]},
             {path: 'emergencyitems', component: EmergencyItemComponent,  canActivate: [OktaAuthGuard]}
        ]
    }
    //  { path: '**', component: NoContentComponent },
];
