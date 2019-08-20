// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';

// Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import 'hammerjs';

// 3rd Party
import { ContextMenuModule } from 'ngx-contextmenu';
import { TreeModule } from 'angular-tree-component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

// CFA Shared
import { CfaOktaModule } from '@cfa-angular/okta';
import { CfaNavigationModule } from '@cfa-angular/nav';

// APP
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppState } from './app.service';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';

// components
import { MenuComponent } from './components/menu/menu.component';
import { MenuTreeComponent} from './components/menu/menu-tree/menu-tree.component';
import { AddItemDialogComponent} from './components/shared/add-item-dialog/add-item-dialog.component';
import { AppInfoComponent} from './components/shared/app-info/app-info.component';
import { DestinationComponent } from './components/menu/destination/destination.component';
import { MenuCopyComponent } from './components/menu/menu-copy/menu-copy.component';
import { DestinationModalComponent } from './components/menu/destination/destination-modal/destination-modal.component';
import { MenuEditComponent } from './components/menu/menu-edit/menu-edit.component';
import { ReportComponent } from './components/report/report.component';
import { ManagementComponent } from './components/management/management.component';
import { AttributeComponent } from './components/management/attribute/attribute.component';
import { AttributeEditComponent } from './components/management/attribute/attribute-edit/attribute-edit.component';
import { AttributeAddComponent } from './components/management/attribute/attribute-add/attribute-add.component';
import { AttributeDeleteComponent } from './components/management/attribute/attribute-delete/attribute-delete.component';
import { ItemComponent } from './components/management/item/item.component';
import { ItemAddComponent } from './components/management/item/item-add/item-add.component';
import { ItemEditComponent } from './components/management/item/item-edit/item-edit.component';
import { ItemGroupingComponent } from './components/management/item-grouping/item-grouping.component';
import { ChildItemComponent } from './components/management/item-grouping/child-item/child-item.component';
import { ItemTypeComponent } from './components/management/item-type/item-type.component';
import { ItemTypeEditComponent } from './components/management/item-type/item-type-edit/item-type-edit.component';
import { ItemTypeAddComponent } from './components/management/item-type/item-type-add/item-type-add.component';
import { LocationSetComponent } from './components/management/location-set/location-set.component';
import { LocationSetAddComponent } from './components/management/location-set/location-set-add/location-set-add.component';
import { LocationSetEditComponent } from './components/management/location-set/location-set-edit/location-set-edit.component';
import { LocationSetTypeComponent } from './components/management/location-set-type/location-set-type.component';
import { LocationSetTypeEditComponent } from './components/management/location-set-type/location-set-type-edit/location-set-type-edit.component';
import { LocationSetTypeAddComponent } from './components/management/location-set-type/location-set-type-add/location-set-type-add.component';
import { MatConfirmDialogComponent} from './components/management/mat-confirm-dialog/mat-confirm-dialog.component';
import { DeleteChildItemDialogComponent } from './components/shared/delete-child-item-dialog/delete-child-item-dialog.component';
import { AddLocationDialogComponent } from 'app/components/shared/add-location-dialog/add-location-dialog.component';
import { AddChildItemDialogComponent } from 'app/components/shared/add-child-item-dialog/add-child-item-dialog.component';

// services
import { AttributeService } from './services/attribute/attribute.service';
import { TagService } from './services/tag/tag.service';
import { ItemTypeService } from './services/item-type/item-type.service';
import { LocationSetTypeService } from './services/location-set-type/location-set-type.service';
import { ItemService } from './services/item/item.service';
import { ItemGroupingService } from './services/item-grouping/item-grouping.service';
import { LocationSetService } from './services/location-set/location-set.service';
import { ItemTypeClassService } from './services/item-type-class/item-type-class.service';
import { DestinationService } from './services/destination/destination.service';
import { SubMenuService } from './services/submenu/submenu.service';
import { MenuService } from './services/menu/menu.service';
import { ReportService } from './services/report/report-service';
import { AppInfoService } from './services/app-info/appinfo.service';
import { UserService } from './shared/user.service';
// import { TokenInterceptor } from './services/auth/token.interceptor';
// import { AuthService } from './services/auth/auth.service';
import { HttpRequestInterceptor } from './services/auth/httpRequestInterceptor';
import { AuthStatusService } from './services/auth/authenticationStatusService';

// guard
import { OktaAuthGuard } from './guards/activate/okta-guard.guard';
import { ConfirmItemDeactivateGuard } from './core/guards/management/item.guard';
import { ConfirmItemGDeactivateGuard } from './core/guards/management/item-g.guard';
import { ConfirmAttributeDeactivateGuard } from './core/guards/management/attribute.guard';
import { ConfirmItemTypeDeactivateGuard } from './core/guards/management/item-type.guard';
import { ConfirmLSTDeactivateGuard } from './core/guards/management/location-set-type.guard';
import { ConfirmLSDeactivateGuard } from './core/guards/management/location-set.guard';
import { AttributeOptionEditorComponent } from './components/management/attribute/attribute-value-select/attribute-option-editor.component';

// pipes
import { DateFormatPipe } from './shared/pipes/dateformat.pipe';
import { DateTimeFormatPipe } from './shared/pipes/datetimeformat.pipe';
import { HighLightModule } from './core/pipes/highlight/highlight.module';
import { SearchFilterModule } from './core/pipes/search/search.module';
import { MenuLocationSetTypeFilterModule } from './core/pipes/menu-location-set-type/menu-location-set-type.module';
import { ItemSearchFilterModule } from './core/pipes/item-search/item-search.module';
import {EmergencyItemComponent} from "app/components/management/emergency-item/emergency-item.component";
import {EmergencyItemService} from "app/services/emergency-item/emergency-item.service";

const config = {
  appName: environment._OKTA_DETAILS.appName,
  redirectUrl: environment._OKTA_DETAILS.uiRedirectUrl, // for local testing use 'http://localhost:4200',
  idmUrl: environment._OKTA_DETAILS.idmUrl,
  clientId: environment._OKTA_DETAILS.clientId, // replace this with your app's client id
  oktaIssuerUrl: environment._OKTA_DETAILS.oktaIssuerUrl,
  oktaUrl: environment._OKTA_DETAILS.oktaUrl,
  urlsForAuthHeader: [environment._API_URL_V2]
};

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  AttributeService,
  TagService,
  ItemTypeService,
  LocationSetTypeService,
  ItemService,
  ItemGroupingService,
  EmergencyItemService,
  LocationSetService,
  ItemTypeClassService,
  DestinationService,
  SubMenuService,
  MenuService,
  AppInfoService,
  AuthStatusService,
  UserService,
  ReportService// ,
  // TokenInterceptor,
  // AuthService
];

@NgModule({
  declarations: [
    AppComponent,
    DestinationComponent,
    DestinationModalComponent,
    MenuCopyComponent,
    MenuEditComponent,
    MenuComponent,
    MenuTreeComponent,
    AddItemDialogComponent,
    AppInfoComponent,
    ReportComponent,
    DateFormatPipe,
    DateTimeFormatPipe,
    DeleteChildItemDialogComponent,
    AttributeComponent,
    ManagementComponent,
    AttributeEditComponent,
    AttributeAddComponent,
    AttributeDeleteComponent,
    AttributeOptionEditorComponent,
    ItemComponent,
    ItemEditComponent,
    ItemAddComponent,
    ItemGroupingComponent,
    EmergencyItemComponent,
    ChildItemComponent,
    ItemTypeComponent,
    ItemTypeEditComponent,
    ItemTypeAddComponent,
    LocationSetComponent,
    LocationSetAddComponent,
    LocationSetEditComponent,
    LocationSetTypeComponent,
    LocationSetTypeAddComponent,
    LocationSetTypeEditComponent,
    MatConfirmDialogComponent,
    AddLocationDialogComponent,
    AddChildItemDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
      // useHash: true
    }),
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSelectModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ContextMenuModule.forRoot(),
    CfaNavigationModule,
    CfaOktaModule.setOktaDetails(config),
    HighLightModule.forRoot(),
    SearchFilterModule.forRoot(),
    MenuLocationSetTypeFilterModule.forRoot(),
    ItemSearchFilterModule,
    TreeModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ],
  entryComponents: [
    DestinationModalComponent, MenuCopyComponent,
    AttributeAddComponent, AttributeOptionEditorComponent, AttributeDeleteComponent, ItemTypeAddComponent,
    ItemAddComponent, LocationSetTypeAddComponent, LocationSetAddComponent,
    AddItemDialogComponent, AddLocationDialogComponent, DeleteChildItemDialogComponent, AddChildItemDialogComponent,
    MatConfirmDialogComponent
  ],
  providers: [
    APP_PROVIDERS,
    OktaAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
    ConfirmItemDeactivateGuard, ConfirmItemGDeactivateGuard, ConfirmAttributeDeactivateGuard,
    ConfirmItemTypeDeactivateGuard, ConfirmLSTDeactivateGuard, ConfirmLSDeactivateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
