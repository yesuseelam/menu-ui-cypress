import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationStatus } from '../../enum/AuthenticationStatus';
import { AuthStatusService } from './authenticationStatusService';
import { TokenService } from '@cfa-angular/okta';
import { catchError } from 'rxjs/operators';

// Consider implementing global error handler for service calls so this interceptor can be removed and use default Okta interceptor instead
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private tokenHolder: TokenService,
              private authStatusService: AuthStatusService) {

  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(
        catchError((e: any) => this.errorHandler(e, req, next))
      );
  }

  public errorHandler(err: any, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (err.status === 0 ) {
      this.authStatusService.authStatusChanged.next(AuthenticationStatus.Error);
    } else if (err.status === 401) {
      this.tokenHolder.setTokenToInvalid();
      return; // the only reason this is needed is to stop the service catch blocks from showing error popups
    } else {
      return throwError(err);
    }

  }
}
