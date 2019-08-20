import { Injectable } from '@angular/core';
import { AuthenticationStatus } from './enum/AuthenticationStatus';

export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppState {

  public _state: InternalStateType = { };
  public authStatus = AuthenticationStatus;
  public currentAuthStatus: AuthenticationStatus = this.authStatus.NotAuthorized;

  get getCurrentAuthStatus() {
    return this.currentAuthStatus;
  }

  set setCurrentAuthStatus(authentication: AuthenticationStatus) {
    this.currentAuthStatus = authentication;
  }

  /**
   * Already return a clone of the current state.
   */
  public get state() {
    return this._state = this._clone(this._state);
  }
  /**
   * Never allow mutation
   */
  public set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  public get(prop?: any) {
    /**
     * Use our state getter for the clone.
     */
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  public set(prop: string, value: any) {
    /**
     * Internally mutate our state.
     */
    return this._state[prop] = value;
  }

  private _clone(object: InternalStateType) {
    /**
     * Simple object clone.
     */
    return JSON.parse(JSON.stringify( object ));
  }
}
