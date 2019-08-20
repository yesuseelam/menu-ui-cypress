// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import {
//   inject,
//   async,
//   TestBed,
//   ComponentFixture
// } from '@angular/core/testing';
// import { Observable, } from 'rxjs';
// import {
//   HttpModule,
//   Http, RequestOptions,
//   Response,
//   ResponseOptions,
//   BaseRequestOptions,
//   XHRBackend
// } from '@angular/http';
// import { encodeTestToken } from 'angular2-jwt/angular2-jwt-test-helpers';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {
//   MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule,
//   MatInputModule, MatSidenavModule, MatCardModule, MatProgressSpinnerModule,
//   MatSnackBarModule, MatSelectModule, MatTooltipModule,
//   MatStepperModule, MatCheckboxModule, MatDialog
// } from '@angular/material';
// import { ContextMenuModule } from 'ngx-contextmenu';

// /**
//  * Load the implementations that should be tested
//  */
// import { AttributeComponent } from './attribute.component';
// import { AttributeService } from '../../../services/attribute/attribute.service';
// import { HighLightModule } from '../../../core/pipes/highlight.module';
// import { SearchFilterModule } from '../../../core/pipes/search.module';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';

// describe(`Attribute`, () => {
//   let comp: AttributeComponent;
//   let fixture: ComponentFixture<AttributeComponent>;
//   let attributeService: AttributeService;
//   /**
//    * async beforeEach
//    */
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HighLightModule, SearchFilterModule, FormsModule, ReactiveFormsModule,
//         MatIconModule, MatProgressSpinnerModule, ContextMenuModule, HttpModule, MatDialogModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [AttributeComponent],
//       providers: [AttributeService, MatDialog,
//         {
//           provide: AuthHttp,
//           useFactory: (http) => {
//             return new AuthHttp(new AuthConfig({
//               tokenName: 'token',
//               tokenGetter: (() => encodeTestToken(this)),
//               globalHeaders: [{ 'Content-Type': 'application/json' }]
//             }), http);
//           },
//           deps: [Http]
//         },]
//     })
//       /**
//        * Compile template and css
//        */
//       .compileComponents();
//   });


//   it(`should be readly initialized`, () => {
//     fixture = TestBed.createComponent(AttributeComponent);
//     comp = fixture.debugElement.componentInstance;
//     fixture.detectChanges();
//     expect(fixture).toBeDefined();
//     expect(comp).toBeDefined();
//   });

//   it(`should test make Bold`, () => {
//     fixture = TestBed.createComponent(AttributeComponent);
//     comp = fixture.debugElement.componentInstance;
//     comp.attributes = [{ "tag": "DESKTOP_IMAGE", "name": "Desktop Image", "objectName": "desktopImage", "scope": "GLOBAL", "description": "images in desktop resolution", "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "nathan.mcfarland", "lastupdatedate": "2017/02/16 04:53:05 AM" },
//     { "tag": "MOBILE_IMAGE", "name": "Mobile Image", "objectName": "mobileImage", "scope": "GLOBAL", "description": null, "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "nathan.mcfarland", "lastupdatedate": "2017/02/16 04:53:21 AM" },
//     { "tag": "UPSELL", "name": "Upsell", "objectName": "upsell", "scope": "LOCAL", "description": null, "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/02/23 09:37:51 AM" },
//     { "tag": "MEAL", "name": "Meal", "objectName": "meal", "scope": "GLOBAL", "description": "Boolean denoting if the item is a meal", "required": true, "typename": "True/False", "defaultValue": "false", "typetag": "BOOL", "lastupdatedby": "demo", "lastupdatedate": "2016/11/23 08:12:28 AM" },
//     { "tag": "TEMPERATURE", "name": "Temperature", "objectName": "temperature", "scope": "LOCAL", "description": null, "required": false, "typename": "Select List", "defaultValue": null, "typetag": "SELECT", "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/02/23 09:37:51 AM" },
//     { "tag": "QUANTITY_SELECTOR", "name": "Quantity Selector", "objectName": "quantitySelector", "scope": "LOCAL", "description": null, "required": false, "typename": "True/False", "defaultValue": "true", "typetag": "BOOL", "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/02/23 09:37:51 AM" }
//     ];
//     let attribute = { "tag": "MOBILE_IMAGE", "name": "Mobile Image", "objectName": "mobileImage", "scope": "GLOBAL", "description": null, "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "nathan.mcfarland", "lastupdatedate": "2017/02/16 04:53:21 AM" };
//     comp.makeBold(attribute);
//     fixture.detectChanges();
//     expect(comp.selectedAttribute.name).toEqual("Mobile Image");
//   });

//   it(`should test get all Attribute service`, () => {
//     fixture = TestBed.createComponent(AttributeComponent);
//     comp = fixture.debugElement.componentInstance;
//     attributeService = fixture.debugElement.injector.get(AttributeService);
//     const data = [{ "tag": "DESKTOP_IMAGE", "name": "Desktop Image", "objectName": "desktopImage", "scope": "GLOBAL", "description": "images in desktop resolution", "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "nathan.mcfarland", "lastupdatedate": "2017/02/16 04:53:05 AM" },
//     { "tag": "MOBILE_IMAGE", "name": "Mobile Image", "objectName": "mobileImage", "scope": "GLOBAL", "description": null, "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "nathan.mcfarland", "lastupdatedate": "2017/02/16 04:53:21 AM" }
//     , { "tag": "UPSELL", "name": "Upsell", "objectName": "upsell", "scope": "LOCAL", "description": null, "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/02/23 09:37:51 AM" },
//     { "tag": "MEAL", "name": "Meal", "objectName": "meal", "scope": "GLOBAL", "description": "Boolean denoting if the item is a meal", "required": true, "typename": "True/False", "defaultValue": "false", "typetag": "BOOL", "lastupdatedby": "demo", "lastupdatedate": "2016/11/23 08:12:28 AM" },
//     { "tag": "TEMPERATURE", "name": "Temperature", "objectName": "temperature", "scope": "LOCAL", "description": null, "required": false, "typename": "Select List", "defaultValue": null, "typetag": "SELECT", "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/02/23 09:37:51 AM" },
//     { "tag": "QUANTITY_SELECTOR", "name": "Quantity Selector", "objectName": "quantitySelector", "scope": "LOCAL", "description": null, "required": false, "typename": "True/False", "defaultValue": "true", "typetag": "BOOL", "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/02/23 09:37:51 AM" }
//     ]
//     spyOn(attributeService, 'getAllAttributes').and.returnValue(Observable.of(data));
//     fixture.detectChanges();
//     expect(comp.attributes.length).toEqual(6);
//   });

//   // it(`should test get all Attribute service`, () => {
//   //   fixture = TestBed.createComponent(AttributeComponent);
//   //   comp = fixture.debugElement.componentInstance;
//   //   // attributeService = fixture.debugElement.injector.get(AttributeService);
//   //   const attribute = { "tag": "DESKTOP_IMAGE", "name": "Desktop Image", "objectName": "desktopImage", "scope": "GLOBAL", "description": "images in desktop resolution", "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "nathan.mcfarland", "lastupdatedate": "2017/02/16 04:53:05 AM" },
    
//   //   // spyOn(attributeService, 'getAllAttributes').and.returnValue(Observable.of(data));
//   //   // fixture.detectChanges();
//   //   expect(comp.openDeleteAttributeDialog(attribute)).();
//   // });


// });