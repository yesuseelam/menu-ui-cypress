import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {ItemTypeClass} from './item-type-class.model';
import {environment} from 'environments/environment';

// Statics

@Injectable()
export class ItemTypeClassService {

  private readonly apiURL_V2: string = environment._API_URL_V2;

  constructor(private http: HttpClient) {
  }

  public getAllItemTypeClasses(): Observable<ItemTypeClass[]> {
    return this.http.get<ItemTypeClass[]>(this.apiURL_V2 + '/item-types/item-type-class')
      .pipe(
        map((response) => response['itemTypeClasses']),
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
