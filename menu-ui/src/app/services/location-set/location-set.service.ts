import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {environment} from 'environments/environment';

// Statics

@Injectable()
export class LocationSetService {
  private readonly apiURL_V2: string = environment._API_URL_V2;

  constructor(private http: HttpClient) {
  }

  public getAllLocationSets(): Observable<any> {
    return this.http.get(`${this.apiURL_V2}/locations?size=6000`)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getAllLocationSetsByTag(tag): Observable<any> {
    return this.http.get(`${this.apiURL_V2}/locations/search/findByScopeTag?scopeTag=${tag}&sort=name`)
      .pipe(
        map((response) => response['_embedded'].menuLocations),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getLocationsByParent(parentTag): Observable<any> {
    return this.http.get(`${this.apiURL_V2}/locations/search/findChildLocationsOfParent?tag=${parentTag}`)
      .pipe(
        map((response) => response['_embedded'].menuLocations),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error

      );
  }

  public searchLocationSets(tag, searchString): Observable<any> {
    return this.http.get(`${this.apiURL_V2}/locations/search/findByScopeTagAndNameContains?scopeTag=${tag}&name=${searchString}&sort=tag`)
      .pipe(
        map((response) => response['_embedded'].menuLocations),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public importLocations(): Observable<any> {
    return this.http.get(`${this.apiURL_V2}/import/locations`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  public createLocationSet(locationSet): Observable<any> {
    return this.http.post(this.apiURL_V2 + '/locationsets', locationSet, {responseType: 'text'})
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public updateLocationSet(locationSet) {
    return this.http.put(`${this.apiURL_V2}/locationsets/${locationSet.tag}`, locationSet)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  public deleteLocationSet(tag: string): Observable<any> {
    return this.http.delete(`${this.apiURL_V2}/locationsets/${tag}`)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public filterLocations(filter, size): Observable<any> {
    return this.http.get(`${this.apiURL_V2}/locations/search/filter?q=${filter}&projection=location-basics&sort=name&sort=tag&size=${size}`)
      .pipe(
        map((response) => response['_embedded']),
        catchError(this.handleError) // then handle the error
      );
  }

  public addChildLocation(parentTag, childTag): Observable<any> {
    return this.http.post(this.apiURL_V2 + `/locationsets/${parentTag}/${childTag}`, null)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public removeChildLocation(parentTag, childTag): Observable<any> {
    return this.http.delete(this.apiURL_V2 + `/locationsets/${parentTag}/${childTag}`)
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
