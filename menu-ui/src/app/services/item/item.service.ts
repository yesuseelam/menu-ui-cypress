import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {environment} from 'environments/environment';

// Statics

@Injectable()
export class ItemService {

  private readonly apiURL_V2: string = environment._API_URL_V2;

  constructor(private http: HttpClient) {
  }

  public getItemsBySize(size): Observable<any> {
    return this.http.get(this.apiURL_V2 + '/items?size=' + size)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getAllItems(): Observable<any> {
    return this.http.get(this.apiURL_V2 + '/items')
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public filterItems(filter, itemTypeFilter, size): Observable<any> {
    let itemType = itemTypeFilter ? itemTypeFilter : '';
    return this.http.get(`${this.apiURL_V2}/items/search/filter?q=${filter}&itemType=${itemType}&projection=search&sort=name&sort=tag&size=${size}`)
      .pipe(
        map((response) => response['_embedded']),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public saveItem(item): Observable<any> {
    return this.http.post(this.apiURL_V2 + '/items', item, {responseType: 'text'})
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public setEnabled(tag, enabled): Observable<any> {
    return this.http.put(this.apiURL_V2 + `/items/${tag}`, {
      'DISABLED|US': !enabled
    })
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getItem(tag): Observable<any> {
    return this.http.get(this.apiURL_V2 + '/items/' + tag + '?projection=details')
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public updateItem(tag, item): Observable<any> {
    return this.http.put(this.apiURL_V2 + '/items/' + tag, item)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public deleteItem(tag: string): Observable<any> {
    return this.http.delete(`${this.apiURL_V2}/items/${tag}`)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public resetItems(): Observable<any> {
    // return this.http.get(`${this.apiURL_V2}/import/items?override=false&source=onemenu`) // remove when no longer needed
    return this.http.get(`${this.apiURL_V2}/import/items?source=emm`)
      .pipe(
        catchError((error) => throwError(error)) // then handle the error
      );
  }

  public getEnv(): Observable<any> {
    // return this.http.get(`${this.apiURL_V2}/import-env?source=onemenu`) // remove when no longer needed
    return this.http.get(`${this.apiURL_V2}/import-env?source=emm`)
      .pipe(
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
