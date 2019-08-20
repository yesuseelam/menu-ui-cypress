import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {ItemType} from './item-type.model';

import {environment} from 'environments/environment';

@Injectable()
export class ItemTypeService {

  private readonly apiURL_V2: string = environment._API_URL_V2;

  constructor(private http: HttpClient) {
  }

  public getAllItemTypes(): Observable<any> {
    return this.http.get<any>(this.apiURL_V2 + '/item-types?projection=details&page=0&sort=name&size=500')
      .pipe(
        map((i) => i._embedded.itemTypes),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  // Item Groupings Screen
  public getAllItemTypesByItemClass(itemClass): Observable<any> {
    return this.http.get<any>(this.apiURL_V2 + '/item-types/search/itemclass?itemClass=' + itemClass)
      .pipe(
        map((i) => i._embedded.itemTypes),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  // Items Screen
  public getAllItemTypesForItems(): Observable<any> {
    return this.http.get<any>(this.apiURL_V2 + '/item-types/search/itemclass?itemClass=ITEM')
      .pipe(
        map((i) => i._embedded.itemTypes),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getItemType(itemTypeTag: string): Observable<any> {
    return this.http.get(this.apiURL_V2 + '/item-types/' + itemTypeTag + '?projection=details')
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public updateItemType(itemTypeTag: string, itemType: ItemType): Observable<any> {
    return this.http.put(this.apiURL_V2 + '/item-types/' + itemTypeTag, itemType)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public createItemType(itemType): Observable<any> {
    return this.http.post(this.apiURL_V2 + '/item-types', itemType, {responseType: 'text'})
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public deleteItemType(itemTypeTag): Observable<any> {
    return this.http.delete(this.apiURL_V2 + '/item-types/' + itemTypeTag)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error}`);
    }
    if (error.status > 499) {
      window.alert(error.message + '. Please try again after sometime');
    } else {
      window.alert('Something went wrong in backend. Please try this feature after sometime');
    }
    // return an ErrorObservable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
