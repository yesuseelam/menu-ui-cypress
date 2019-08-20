import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IUser } from '../models/IUser';
import { of } from 'rxjs';

@Injectable()
export class UserService {

  private user: IUser = null;

  private initialized: boolean = false;

  public getUser(forceRefresh?: boolean): Observable<IUser> {
    if(!this.initialized){
      const localStoreToken = localStorage.getItem('idToken');
      this.initUser(localStoreToken);
      this.initialized = true;
    }
    return of(this.user);
  }


  private initUser(token) {
    const jwt = new JwtHelperService();
    const decodedToken = jwt.decodeToken(token);
    try {
      this.user = {
        login: decodedToken.sub,
        firstName: decodedToken.nickname,
        lastName: decodedToken.family_name,
        email: decodedToken.email,
        isReadOnly:this.isReadOnly(decodedToken.cfa_perms)
      };
    } catch (e) {
      this.user = {
        login: 'lp@lp.com',
        firstName: 'Not',
        lastName: 'SignedIn',
        email: 'lp@lp.com',
        isReadOnly:false
      };
    }

  }

  private isReadOnly(cfa_perms): boolean {
    const emms = cfa_perms["EMM"] ;
    const readOnly = emms["READ_ONLY"];
    const keys = Object.keys(emms).length;

    // return true only if user has readonly role
    if(readOnly && keys ===1)  {
      return true
    }
    return false;
  }
}
