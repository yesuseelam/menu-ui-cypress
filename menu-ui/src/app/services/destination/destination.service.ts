import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {environment} from 'environments/environment';
import {Destination} from './destination.model';

// Statics

@Injectable()
export class DestinationService {
  private readonly apiURL_V2: string = environment._API_URL_V2;

  constructor(private http: HttpClient) {
  }

  public getAllDestinationMappings(locationSetTag): Observable<Destination[]> {
    return this.http.get(`${this.apiURL_V2}/destinations/search/findByLocation?locationTag=${locationSetTag}`)
      .pipe(
        map((response) => response['_embedded'].menuDestinations),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getDestination(destination, scope): Observable<any> {
    return this.http.get(`${this.apiURL_V2}/menu/${destination}/${scope}/info`)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getAllDestinations(): Observable<any> {
    return this.http.get(this.apiURL_V2 + '/destinations?sort=name')
      .pipe(
        map((response) => response['_embedded'].menuDestinations),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getAllDestinationsByLocationSetTag(locationTag): Observable<any> {
    return this.http.get(this.apiURL_V2 + '/menus/search/findByLocationTag?projection=destination-basics&locationTag=' + locationTag)
      .pipe(
        map((response) => response['_embedded'].menus),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getAllDestinationsForGlobalMenu(): Observable<any> {
    return this.getAllDestinationsByLocationSetTag('CHAIN');
  }

  public saveDestination(destination): Observable<any> {
    return this.http.post(this.apiURL_V2 + '/destinations', destination, {responseType: 'text'})
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getDestinationTypes(): Observable<any> {
    return this.http.get(this.apiURL_V2 + '/destination-types')
      .pipe(
        map((response) => response['_embedded'].destinationTypes),
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
