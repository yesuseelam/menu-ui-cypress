import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {Attribute} from './attribute.model';
import {AttributeType} from './attributeType.model';

import {environment} from 'environments/environment';

@Injectable()
export class AttributeService {
  private readonly apiURL_V2: string = environment._API_URL_V2;

  constructor(private http: HttpClient) {
  }

  // getAllAttributes(): Observable<Attribute[]> {
  //   return this.http.get(this.apiURL + 'attributes')
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  public getAllAttributes(detail = false): Observable<Attribute[]> {
    const projection = detail ? '&projection=details' : '';
    return this.http.get<Attribute[]>(this.apiURL_V2 + '/attributes?page=0&size=500&sort=sortOrder' + projection)
      .pipe(
        map((response) => response['_embedded'].attributes),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getAllGlobalAttributes(): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(this.apiURL_V2 + '/attributes/search/findAllByScope?scope=GLOBAL&projection=details&sort=sortOrder&sort=name')
      .pipe(
        map((response) => response['_embedded'].attributes),
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getAllLocalAttributes(): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(this.apiURL_V2 + '/attributes/search/findAllByScope?scope=LOCAL')
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getAttribute(attributeTag: string): Observable<Attribute> {
    return this.http.get<Attribute>(`${this.apiURL_V2}/attributes/${attributeTag}?projection=details`)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public updateAttribute(attributeTag: string, attribute: Attribute): Observable<any> {
    return this.http.put(`${this.apiURL_V2}/attributes/${attributeTag}`, attribute)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public createAttribute(attribute): Observable<any> {
    return this.http.post(this.apiURL_V2 + '/attributes/', attribute, {responseType: 'text'})
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public deleteAttribute(attributeTag): Observable<any> {
    return this.http.delete(this.apiURL_V2 + '/attributes/' + attributeTag)
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public getAllAttributeTypes(): Observable<AttributeType[]> {
    return this.http.get<AttributeType[]>(this.apiURL_V2 + '/attribute-types')
      .pipe(
        retry(1), // retry a failed request up to 1 time
        catchError(this.handleError) // then handle the error
      );
  }

  public resetAttributes(): Observable<any> {
    return this.http.get(`${this.apiURL_V2}/import/attributes`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  private extractData(res: Response) {
    const body = res.json();
    return body;
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` +
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
