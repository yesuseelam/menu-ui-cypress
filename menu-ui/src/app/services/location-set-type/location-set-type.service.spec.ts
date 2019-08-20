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
// import { LocationSetTypeService } from './location-set-type.service';
// import { LocationSetType } from './location-set-type.model';
// describe('LocationSetTypeService ', () => {
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 LocationSetTypeService,
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

//     describe('get All Location Set Types', () => {
//         it('should get locationSetTypes',
//             inject([LocationSetTypeService, XHRBackend], fakeAsync((locationSetTypeService: LocationSetTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 body: [{'tag':'CHAIN','name':'Chain','weight':1000,'lastupdatedby':'demo','lastupdatedate':'2016/12/01 05:37:16 PM'}
//                                 ,{'tag':'REGION','name':'Region','weight':800,'lastupdatedby':'nathan.mcfarland','lastupdatedate':'2016/12/12 05:09:20 PM'}
//                                 ,{'tag':'MARKET','name':'Market','weight':600,'lastupdatedby':'nathan.mcfarland','lastupdatedate':'2016/12/12 05:09:42 PM'}
//                                 ,{'tag':'PILOT','name':'Pilot','weight':400,'lastupdatedby':'nathan.mcfarland','lastupdatedate':'2016/12/12 05:09:34 PM'},
//                                 {'tag':'LOCATION','name':'Locations','weight':200,'lastupdatedby':'nathan.mcfarland','lastupdatedate':'2016/12/12 05:09:03 PM'}]                                
//                             }
//                             )));
//                     });
//                 locationSetTypeService.getAllLocationSetTypes().subscribe((locationSetTypes: LocationSetType[]) => {
//                     expect(locationSetTypes.length).toBe(5);
//                     expect(locationSetTypes[0].name).toEqual('Chain');
//                 });
//             })));
//     });

//     describe('get an LocationSetType ', () => {
//         it('should get locationSetType',
//             inject([LocationSetTypeService, XHRBackend], fakeAsync((locationSetTypeService: LocationSetTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 body: {'tag':'CHAIN','name':'Chain','weight':1000,'lastupdatedby':'demo','lastupdatedate':'2016/12/01 05:37:16 PM'}
//                             }
//                             )));
//                     });
//                 locationSetTypeService.getLocationSetType('CHAIN').subscribe((locationSetType: LocationSetType) => {
//                     expect(locationSetType.name).toEqual('Chain');
//                 });
//             })));
//     });


//     describe('create LocationSetType', () => {
//         it('should create locationSetType',
//             inject([LocationSetTypeService, XHRBackend], fakeAsync((locationSetTypeService: LocationSetTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({ status: 200 }
//                             )));
//                     });
//                 let locationSetType = {'tag':'CHAIN','name':'Chain','weight':1000,'lastupdatedby':'demo','lastupdatedate':'2016/12/01 05:37:16 PM'};
//                 locationSetTypeService.createLocationSetType(locationSetType).subscribe((successResult) => {
//                     expect(successResult).toBeDefined();
//                     expect(successResult.status).toBe(200);
//                 });
//             })));
//     });

//     describe('delete locationSetType', () => {
//         it('should delete locationSetType',
//             inject([LocationSetTypeService, XHRBackend], fakeAsync((locationSetTypeService: LocationSetTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({ status: 200 }
//                             )));
//                     });
//                     locationSetTypeService.deleteLocationSetType('CHAIN').subscribe((successResult) => {
//                     expect(successResult).toBeDefined();
//                     expect(successResult.status).toBe(200);
//                 });
//             })));
//     });

//     describe('update locationSetType', () => {
//         it('should update locationSetType',
//             inject([LocationSetTypeService, XHRBackend], fakeAsync((locationSetTypeService: LocationSetTypeService, mockBackend: MockBackend) => {
//                 mockBackend.connections.subscribe(
//                     (connection: MockConnection) => {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 status: 200
//                             })));
//                     });
//                     let locationSetType = {'tag':'CHAIN', 'name':'Chain','weight':1000,'lastupdatedby':'demo','lastupdatedate':'2016/12/01 05:37:16 PM'};
//                     locationSetTypeService.updateLocationSetType('CHAIN', locationSetType).subscribe((successResult) => {
//                     expect(successResult.status).toBe(200);
//                     expect(successResult).toBeDefined();
//                 });

//             })));
//     });

  
//     describe('Handle Error', () => {
//         it('should throw observable error',
//             inject([LocationSetTypeService, XHRBackend], fakeAsync((locationSetTypeService: LocationSetTypeService, mockBackend: MockBackend) => {
//                 let error = {
//                     status : 200,
//                     message: 'hello'
//                 };
//                 locationSetTypeService.handleError(error).subscribe( () =>{}, error =>{
//                     expect(error.status).toBe(200);
//                     expect(error.message).toBe('hello');                    
//                 });
//             })));

//             it('should throw observable error 2',
//             inject([LocationSetTypeService, XHRBackend], fakeAsync((locationSetTypeService: LocationSetTypeService, mockBackend: MockBackend) => {
        
//                     let error4 : Response = new Response(new ResponseOptions({
//                         status: 200,
//                         statusText : 'Gone Wrong'
//                     }));
//                 // make call
//                 locationSetTypeService.handleError(error4).subscribe(()=>{},
//                 error =>{
//                     expect(error.status).toBe(200);
//                 });
//             })));

//             it('should throw observable error 3',
//             inject([LocationSetTypeService, XHRBackend], fakeAsync((locationSetTypeService: LocationSetTypeService, mockBackend: MockBackend) => {
        
//                 let error = {
//                     status : 200,
//                 };
//                 locationSetTypeService.handleError(error).subscribe( () =>{}, error =>{
//                     expect(error.status).toBe(200);
//                     expect(error.message).toBeDefined();                    
//                 });
//             })));
//             it('should throw observable error 4',
//             inject([LocationSetTypeService, XHRBackend], fakeAsync((locationSetTypeService: LocationSetTypeService, mockBackend: MockBackend) => {
        
//                     let error4 : Response = new Response(new ResponseOptions({
//                         status: 200,
//                     }));
//                 locationSetTypeService.handleError(error4).subscribe(()=>{},
//                 error =>{
//                     expect(error.status).toBe(200);
//                     expect(error.statusText).toBeUndefined();
//                 });
//             })));
//     });
// });

