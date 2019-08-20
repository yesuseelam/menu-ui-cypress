// import { TestBed, async, inject } from '@angular/core/testing';
// import {
//     HttpModule,
//     Http, RequestOptions,
//     Response,
//     ResponseOptions,
//     BaseRequestOptions,
//     XHRBackend
// } from '@angular/http';
// import { Observable, } from 'rxjs';
// import { tick, fakeAsync } from '@angular/core/testing';
// import { encodeTestToken } from 'angular2-jwt/angular2-jwt-test-helpers';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';
// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { ItemTypeService } from './item-type.service';
// // import { API_URL } from '../environment';
// import { ItemType } from './item-type.model';
// describe('ItemTypeService ', () => {
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 ItemTypeService,
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

//     describe('getAllItemTypes()', () => {
//         it('should get itemtypes',
//             inject([ItemTypeService, XHRBackend], fakeAsync((itemTypeService: ItemTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 body: [{"tag":"MEALS_GROUP","name":"Meal Groupings","description":"Groups of related meals.","className":"Item Grouping","classTag":"ITEM_GROUPING","lastupdatedby":"nathan.mcfarland","lastupdatedate":"2016/11/09 08:45:33 AM"},
//                                 {"tag":"TRAYS_GROUP","name":"Tray Groupings","description":"Groups of related trays.","className":"Item Grouping","classTag":"ITEM_GROUPING","lastupdatedby":"nathan.mcfarland","lastupdatedate":"2016/11/09 08:45:33 AM"}
//                                 ,{"tag":"BEVERAGES_GROUP","name":"Beverage Groupings","description":"Groups of related beverages.","className":"Item Grouping","classTag":"ITEM_GROUPING","lastupdatedby":"nathan.mcfarland","lastupdatedate":"2016/11/09 08:45:33 AM"}]
//                             }
//                             )));
//                     });
//                 itemTypeService.getAllItemTypes().subscribe((itemTypes: ItemType[]) => {
//                     expect(itemTypes.length).toBe(3);
//                     expect(itemTypes[0].name).toEqual('Meal Groupings');
//                 });
//             })));
//     });

//     describe('get an ItemType ', () => {
//         it('should get itemType',
//             inject([ItemTypeService, XHRBackend], fakeAsync((itemTypeService: ItemTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 body: {"tag":"MEALS_GROUP","name":"Meal Groupings","description":"Groups of related meals.","className":"Item Grouping","classTag":"ITEM_GROUPING","lastupdatedby":"nathan.mcfarland","lastupdatedate":"2016/11/09 08:45:33 AM"}
//                             }
//                             )));
//                     });
//                 itemTypeService.getItemType('DESKTOP_IMAGE').subscribe((itemType: ItemType) => {
//                     expect(itemType.name).toEqual('Meal Groupings');
//                 });
//             })));
//     });


//     describe('create ItemType', () => {
//         it('should create itemType',
//             inject([ItemTypeService, XHRBackend], fakeAsync((itemTypeService: ItemTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({ status: 200 }
//                             )));
//                     });
//                 let itemType = {"tag":"MEALS_GROUP","name":"Meal Groupings","description":"Groups of related meals.","className":"Item Grouping","classTag":"ITEM_GROUPING","lastupdatedby":"nathan.mcfarland","lastupdatedate":"2016/11/09 08:45:33 AM"};
//                 itemTypeService.createItemType(itemType).subscribe((successResult) => {
//                     expect(successResult).toBeDefined();
//                     expect(successResult.status).toBe(200);
//                 });
//             })));
//     });

//     describe('delete itemType', () => {
//         it('should delete itemType',
//             inject([ItemTypeService, XHRBackend], fakeAsync((itemTypeService: ItemTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({ status: 200 }
//                             )));
//                     });
//                     let itemType = {"tag":"MEALS_GROUP","name":"Meal Groupings","description":"Groups of related meals.","className":"Item Grouping","classTag":"ITEM_GROUPING","lastupdatedby":"nathan.mcfarland","lastupdatedate":"2016/11/09 08:45:33 AM"};
//                     itemTypeService.deleteItemType('MEAL').subscribe((successResult) => {
//                     expect(successResult).toBeDefined();
//                     expect(successResult.status).toBe(200);
//                 });
//             })));
//     });

//     describe('update itemType', () => {
//         it('should update itemType',
//             inject([ItemTypeService, XHRBackend], fakeAsync((itemTypeService: ItemTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 status: 200
//                             })));
//                     });
//                     let itemType = {"tag":"MEALS_GROUP","name":"Meal Groupings","description":"Groups of related meals.","className":"Item Grouping","classTag":"ITEM_GROUPING","lastupdatedby":"nathan.mcfarland","lastupdatedate":"2016/11/09 08:45:33 AM"};
//                     itemTypeService.updateItemType('MEAL', itemType).subscribe((successResult) => {
//                     expect(successResult.status).toBe(200);
//                     expect(successResult).toBeDefined();
//                 });

//             })));
//     });

  
//     describe('Handle Error', () => {
//         it('should throw observable error',
//             inject([ItemTypeService, XHRBackend], fakeAsync((itemTypeService: ItemTypeService, mockBackend: MockBackend) => {
//                 let error = {
//                     status : 200,
//                     message: 'hello'
//                 };
//                 // expect(itemTypeService.handleError(error)).toThrow(Observable.throw(error));
//                 itemTypeService.handleError(error).subscribe( () =>{}, error =>{
//                     expect(error.status).toBe(200);
//                     expect(error.message).toBe('hello');                    
//                 });

//                 // let error2 = {
//                 //     status : 200,
//                 //     message : 'Gone Wrong'
//                 // };
//                 // expect(itemTypeService.handleError(error)).toThrow(Observable.throw(error));
//                 // itemTypeService.handleError(error2).subscribe( () =>{}, error =>{
//                 //     expect(error2.status).toBe(200);
//                 //     expect(error2.message).toEqual('Gone Wrong');                    
//                 // });
//                 //     let error4 : Response;
//                 // make call
//                 // itemTypeService.handleError(error4).subscribe(()=>{},
//                 // error =>{
//                 //     expect(error.status).toBe(200);
//                 // });
//                 // tick();
//                 // expect(itemTypeService.handleError).toHaveBeenCalled();
//             })));

//             it('should throw observable error 2',
//             inject([ItemTypeService, XHRBackend], fakeAsync((itemTypeService: ItemTypeService, mockBackend: MockBackend) => {
        
//                     let error4 : Response = new Response(new ResponseOptions({
//                         status: 200,
//                         statusText : 'Gone Wrong'
//                     }));
//                 // make call
//                 itemTypeService.handleError(error4).subscribe(()=>{},
//                 error =>{
//                     expect(error.status).toBe(200);
//                 });
//                 // tick();
//                 // expect(itemTypeService.handleError).toHaveBeenCalled();
//             })));

//             it('should throw observable error 3',
//             inject([ItemTypeService, XHRBackend], fakeAsync((itemTypeService: ItemTypeService, mockBackend: MockBackend) => {
        
//                 let error = {
//                     status : 200,
//                 };
//                 // expect(itemTypeService.handleError(error)).toThrow(Observable.throw(error));
//                 itemTypeService.handleError(error).subscribe( () =>{}, error =>{
//                     expect(error.status).toBe(200);
//                     expect(error.message).toBeDefined();                    
//                 });
//                 // tick();
//                 // expect(itemTypeService.handleError).toHaveBeenCalled();
//             })));
//             it('should throw observable error 4',
//             inject([ItemTypeService, XHRBackend], fakeAsync((itemTypeService: ItemTypeService, mockBackend: MockBackend) => {
        
//                     let error4 : Response = new Response(new ResponseOptions({
//                         status: 200,
//                     }));
//                 // make call
//                 itemTypeService.handleError(error4).subscribe(()=>{},
//                 error =>{
//                     expect(error.status).toBe(200);
//                     expect(error.statusText).toBeUndefined();
//                 });
//                 // tick();
//                 // expect(itemTypeService.handleError).toHaveBeenCalled();
//             })));
//     });
// });

