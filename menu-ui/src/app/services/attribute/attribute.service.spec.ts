// import { TestBed, async, inject } from '@angular/core/testing';
// import {
//     HttpModule,
//     Http, RequestOptions,
//     Response,
//     ResponseOptions,
//     BaseRequestOptions,
//     XHRBackend
// } from '@angular/http';
// import { SelectValue } from './selectValue.model';
// import { Observable, } from 'rxjs';
// import { tick, fakeAsync } from '@angular/core/testing';
// import { encodeTestToken } from 'angular2-jwt/angular2-jwt-test-helpers';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';
// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { AttributeService } from './attribute.service';
// // import { API_URL } from '../environment';
// import { Attribute } from './attribute.model';
// describe('AttributeService ', () => {
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 AttributeService,
//                 BaseRequestOptions,
//                 { provide: XHRBackend, useClass: MockBackend },
//                 {
//                     provide: AuthHttp,
//                     useFactory: (http) => {
//                         return new AuthHttp(new AuthConfig({
//                             tokenName: 'token',
//                             tokenGetter: (() => encodeTestToken(this)),
//                             globalHeaders: [{ 'Content-Type': 'application/json' }]
//                         }), http);
//                     },
//                     deps: [Http]
//                 },
//             ],
//             imports: [
//                 HttpModule
//             ],
//         });
//     });

//     describe('getAttributes()', () => {
//         it('should get attributes',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
//                 // let error: Response;
//                 // spyOn(attributeService, 'handleError').and.callFake(() => {
//                 //     let error: Response;
//                 //     return error});
//                 // // make call
//                 // attributeService.handleError(error);
//                 // tick();
//                 // expect(attributeService.handleError).toHaveBeenCalled();
//                 // first we register a mock response - when a connection 
//                 // comes in, we will respond by giving it an array of (one)
//                 // attribute entries
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 body: [{ "tag": "DESKTOP_IMAGE", "name": "Desktop Image", "objectName": "desktopImage", "scope": "GLOBAL", "description": "images in desktop resolution", "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "nathan.mcfarland", "lastupdatedate": "2017/02/16 04:53:05 AM" },
//                                 { "tag": "MOBILE_IMAGE", "name": "Mobile Image", "objectName": "mobileImage", "scope": "GLOBAL", "description": null, "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "nathan.mcfarland", "lastupdatedate": "2017/02/16 04:53:21 AM" },
//                                 { "tag": "UPSELL", "name": "Upsell", "objectName": "upsell", "scope": "LOCAL", "description": null, "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/02/23 09:37:51 AM" },
//                                 { "tag": "MEAL", "name": "Meal", "objectName": "meal", "scope": "GLOBAL", "description": "Boolean denoting if the item is a meal", "required": true, "typename": "True/False", "defaultValue": "false", "typetag": "BOOL", "lastupdatedby": "demo", "lastupdatedate": "2016/11/23 08:12:28 AM" },
//                                 { "tag": "TEMPERATURE", "name": "Temperature", "objectName": "temperature", "scope": "LOCAL", "description": null, "required": false, "typename": "Select List", "defaultValue": null, "typetag": "SELECT", "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/02/23 09:37:51 AM" },
//                                 { "tag": "QUANTITY_SELECTOR", "name": "Quantity Selector", "objectName": "quantitySelector", "scope": "LOCAL", "description": null, "required": false, "typename": "True/False", "defaultValue": "true", "typetag": "BOOL", "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/02/23 09:37:51 AM" }
//                                 ]
//                             }
//                             )));
//                     });
//                 // with our mock response configured, we now can 
//                 // ask the attribute service to get our attribute entries
//                 // and then test them
//                 attributeService.getAllAttributes().subscribe((attributes: Attribute[]) => {
//                     expect(attributes.length).toBe(6);
//                     expect(attributes[0].name).toEqual('Desktop Image');
//                 });
//             })));
//     });

//     describe('get an Attribute ', () => {
//         it('should get attribute',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 body: { "tag": "DESKTOP_IMAGE", "name": "Desktop Image", "objectName": "desktopImage", "scope": "GLOBAL", "description": "images in desktop resolution", "required": false, "typename": "Text", "defaultValue": null, "typetag": "TEXT", "lastupdatedby": "nathan.mcfarland", "lastupdatedate": "2017/02/16 04:53:05 AM" }
//                             }
//                             )));
//                     });
//                 attributeService.getAttribute('DESKTOP_IMAGE').subscribe((attribute: Attribute) => {
//                     expect(attribute.name).toEqual('Desktop Image');
//                 });
//             })));
//     });


//     describe('create Attribute', () => {
//         it('should create attribute',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({ status: 200 }
//                             )));
//                     });
//                 let attribute = { "tag": "MEAL", "name": "Meal", "objectName": "meal", "scope": "GLOBAL", "description": "Boolean denoting if the item is a meal", "required": true, "typename": "True/False", "defaultValue": "false", "typetag": "BOOL", "lastupdatedby": "demo", "lastupdatedate": "2016/11/23 08:12:28 AM" };
//                 attributeService.createAttribute(attribute).subscribe((successResult) => {
//                     expect(successResult).toBeDefined();
//                     expect(successResult.status).toBe(200);
//                 });
//             })));
//     });

//     describe('delete attribute', () => {
//         it('should delete attribute',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({ status: 200 }
//                             )));
//                     });
//                 let attribute = { "tag": "MEAL", "name": "Meal", "objectName": "meal", "scope": "GLOBAL", "description": "Boolean denoting if the item is a meal", "required": true, "typename": "True/False", "defaultValue": "false", "typetag": "BOOL", "lastupdatedby": "demo", "lastupdatedate": "2016/11/23 08:12:28 AM" };
//                 attributeService.deleteAttribute('MEAL').subscribe((successResult) => {
//                     expect(successResult).toBeDefined();
//                     expect(successResult.status).toBe(200);
//                 });
//             })));
//     });

//     describe('update attribute', () => {
//         it('should update attribute',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 status: 200
//                             })));
//                     });
//                 let attribute = { "tag": "MEAL", "name": "Meal", "objectName": "meal", "scope": "GLOBAL", "description": "Boolean denoting if the item is a meal", "required": true, "typename": "True/False", "defaultValue": "false", "typetag": "BOOL", "lastupdatedby": "demo", "lastupdatedate": "2016/11/23 08:12:28 AM" };
//                 attributeService.updateAttribute('MEAL', attribute).subscribe((successResult) => {
//                     expect(successResult.status).toBe(200);
//                     expect(successResult).toBeDefined();
//                 });

//             })));
//     });

//     describe('get select value for an attribute', () => {
//         it('should get attribute select values',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 body: [{ "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Other", "defaultValue": false, "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/10/17 15:05:01 PM" }
//                                     , { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Treat", "defaultValue": false, "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/10/24 16:44:00 PM" }
//                                     , { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Not Beverage", "defaultValue": false, "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/10/25 12:34:59 PM" },
//                                 { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Tea & Lemonade", "defaultValue": true, "lastupdatedby": "Prasanth Divyakolu", "lastupdatedate": "2017/10/25 14:37:38 PM" },
//                                 { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Soft Drink", "defaultValue": false, "lastupdatedby": "Prasanth Divyakolu", "lastupdatedate": "2017/10/25 14:38:26 PM" }]
//                             })));
//                     });
//                 attributeService.getSelectValueAttribute('MEAL').subscribe((selectValues: SelectValue[]) => {
//                     expect(selectValues.length).toBe(5);
//                     expect(selectValues[0].selectValue).toEqual('Other');
//                 });
//             })));
//     });

//     describe('create select value for an attribute', () => {
//         it('should create attribute select values',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 status: 200
//                             })));
//                     });
//                 let attributeSv = [{ "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Other", "defaultValue": false, "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/10/17 15:05:01 PM" }
//                     , { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Treat", "defaultValue": false, "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/10/24 16:44:00 PM" }
//                     , { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Not Beverage", "defaultValue": false, "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/10/25 12:34:59 PM" },
//                 { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Tea & Lemonade", "defaultValue": true, "lastupdatedby": "Prasanth Divyakolu", "lastupdatedate": "2017/10/25 14:37:38 PM" },
//                 { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Soft Drink", "defaultValue": false, "lastupdatedby": "Prasanth Divyakolu", "lastupdatedate": "2017/10/25 14:38:26 PM" }]
//                 attributeService.createAttributeSV('MEAL', attributeSv).subscribe((statusResult) => {
//                     expect(statusResult).toBeDefined();
//                     expect(statusResult.status).toBe(200);
//                 });
//             })));
//     });

//     describe('update select value for an attribute', () => {
//         it('should update attribute select values',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 status: 204
//                             })));
//                     });
//                 let attributeSv = [{ "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Other", "defaultValue": false, "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/10/17 15:05:01 PM" }
//                     , { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Treat", "defaultValue": false, "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/10/24 16:44:00 PM" }
//                     , { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Not Beverage", "defaultValue": false, "lastupdatedby": "rachel.skibicki", "lastupdatedate": "2017/10/25 12:34:59 PM" },
//                 { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Tea & Lemonade", "defaultValue": true, "lastupdatedby": "Prasanth Divyakolu", "lastupdatedate": "2017/10/25 14:37:38 PM" },
//                 { "tag": "BEVERAGE_TYPE_GROUPING", "selectValue": "Soft Drink", "defaultValue": false, "lastupdatedby": "Prasanth Divyakolu", "lastupdatedate": "2017/10/25 14:38:26 PM" }]
//                 attributeService.updateAttributeSV('MEAL', attributeSv).subscribe((statusResult) => {
//                     expect(statusResult).toBeDefined();
//                     expect(statusResult.status).toBe(204);
//                 });
//             })));
//     });
  
  
//     describe('Handle Error', () => {
//         it('should throw observable error',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
//                 let error = {
//                     status : 200,
//                     message: 'hello'
//                 };
//                 attributeService.handleError(error).subscribe( () =>{}, error =>{
//                     expect(error.status).toBe(200);
//                     expect(error.message).toBe('hello');                    
//                 });
//             })));

//             it('should throw observable error 2',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
        
//                     let error4 : Response = new Response(new ResponseOptions({
//                         status: 200,
//                         statusText : 'Gone Wrong'
//                     }));
//                 // make call
//                 attributeService.handleError(error4).subscribe(()=>{},
//                 error =>{
//                     expect(error.status).toBe(200);
//                 });
//             })));

//             it('should throw observable error 3',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
        
//                 let error = {
//                     status : 200,
//                 };
//                 attributeService.handleError(error).subscribe( () =>{}, error =>{
//                     expect(error.status).toBe(200);
//                     expect(error.message).toBeDefined();                    
//                 });
//             })));

//             it('should throw observable error 2',
//             inject([AttributeService, XHRBackend], fakeAsync((attributeService: AttributeService, mockBackend: MockBackend) => {
        
//                     let error4 : Response = new Response(new ResponseOptions({
//                         status: 200,
//                     }));
//                 // make call
//                 attributeService.handleError(error4).subscribe(()=>{},
//                 error =>{
//                     expect(error.status).toBe(200);
//                     expect(error.statusText).toBeUndefined();
//                 });
//             })));
//     });
// });

