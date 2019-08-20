import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, retry} from 'rxjs/operators';
import {environment} from 'environments/environment';

// Statics

@Injectable()
export class ReportService {
  private readonly apiURL_V2: string = environment._API_URL_V2;

  constructor(private http: HttpClient) {
  }

  public getMenu(destinationTag, locationTag) {
    return this.http.get(`${this.apiURL_V2}/menu/${destinationTag}/${locationTag}`)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  public getGlobalMenu(destinationTag): Observable<any> {
    return this.getMenu(destinationTag, 'CHAIN');
  }

  public getLocationSpecificMenu(destinationTag, locationTag): Observable<any> {
    return this.getMenu(destinationTag, locationTag);
  }

  public getNutritionData(country): Observable<any> {
    return this.http.get(this.apiURL_V2 + '/nutrition?country=' + country)
      .pipe(
        retry(1), // retry a failed request up to 1 times
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
