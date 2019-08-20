import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';


import {environment} from 'environments/environment';


@Injectable()
export class ItemGroupingService {

  private readonly apiURL_V2: string = environment._API_URL_V2;

  constructor(private http: HttpClient) {
  }


  getItemGroupings(): Observable<any> {
    return this.http.get<any>(this.apiURL_V2 + '/items/groups')
      .pipe(
        map(i => i.items),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  getAllChildItems(tag): Observable<any> {
    return this.http.get<any>(this.apiURL_V2 + `/items/search/children?parent=${tag}&projection=groupingbasics`)
      .pipe(
        map(i => i._embedded.items),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  addChildItem(parentTag, childTag): Observable<any> {
    return this.http.post(this.apiURL_V2 + `/items/group/${parentTag}/${childTag}`, null)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  moveItem(parentTag, childTag, sourceNodeParentTag): Observable<any> {
    return this.http.post(this.apiURL_V2 + `/items/group/move/${childTag}?fromParent=${sourceNodeParentTag}&toParent=${parentTag}`, {})
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  removeChildItem(parentTag, childTag): Observable<any> {
    return this.http.delete(this.apiURL_V2 + `/items/group/${parentTag}/${childTag}`)
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
      window.alert(error.message + ". Please try again after sometime");
    } else {
      window.alert("Something went wrong in backend. Please try this feature after sometime");
    }
    // return an ErrorObservable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
