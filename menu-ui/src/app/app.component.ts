import {  Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SignInWidget } from '@cfa-angular/okta';
import { AuthenticationStatus } from './enum/AuthenticationStatus';
import { AppState } from './app.service';
import { Router } from '@angular/router';
import {IUser} from "app/models/IUser";
import {UserService} from "app/shared/user.service";
import { environment } from 'environments/environment';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Menu Management';

  public url = 'https://www.Chick-Fil-A.com';

  public authStatus = AuthenticationStatus;
  public currentAuthStatus: AuthenticationStatus = this.authStatus.NotAuthorized;
  public authenticated = this.currentAuthStatus === this.authStatus.Authorized;
  @ViewChild(SignInWidget, { static: true })
  public cfaSignInWidget: SignInWidget;
  public user: IUser;

  constructor( private titleService: Title, private service: AppState, private route: Router, private userService: UserService) {}

  public ngOnInit() {
    if(environment) {
      if (environment._OKTA_DETAILS.uiRedirectUrl.includes('-test')) {
        require("style-loader!././styles-test.scss")
      }
      else if (environment._OKTA_DETAILS.uiRedirectUrl.includes('-dev')) {
        require("style-loader!././styles-dev.scss")
      }
      else if (environment._OKTA_DETAILS.uiRedirectUrl.includes('-uat')) {
        require("style-loader!././styles-uat.scss")
      }
      else if (environment._OKTA_DETAILS.uiRedirectUrl.includes('localhost')) {
        require("style-loader!././styles-local.scss")
      }
    }
    this.titleService.setTitle('Menu Management');
    this.currentAuthStatus = AuthenticationStatus.Authorizing;
    this.service.setCurrentAuthStatus = AuthenticationStatus.Authorizing;
    this.cfaSignInWidget.loginSuccess.subscribe(() => {
      this.currentAuthStatus = AuthenticationStatus.Authorized;
      this.service.setCurrentAuthStatus = AuthenticationStatus.Authorized;
      this.authenticated = true;
      this.route.navigate(['/']);
      this.userService.getUser().subscribe((user) => {
        this.user = user;
      });
    });
    this.cfaSignInWidget.initialize();
  }

  public appName = 'Menu Management Redesign';
  public shortName = 'Menu';

  public tabs = [
    { label: 'Menu', url: '/menu', isDisabled: false },
    { label: 'Management', url: '/management', isDisabled: false },
    { label: 'Reports', url: '/reports', isDisabled: false }
  ];


  public signOut() {
    // window['_keycloak'].logout();
    localStorage.clear();
    this.cfaSignInWidget.logout();
    window.location.reload(true);
  }
}
