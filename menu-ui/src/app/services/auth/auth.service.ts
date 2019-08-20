import { Injectable } from '@angular/core';
@Injectable()
export class AuthService {
  public getToken(): string {
    return window['_keycloak'].token;
  }
  // public isAuthenticated(): boolean {
  //   // get the token
  //   const token = this.getToken();
  //   // return a boolean reflecting 
  //   // whether or not the token is expired
  //   return tokenNotExpired(null, token);
  // }
}