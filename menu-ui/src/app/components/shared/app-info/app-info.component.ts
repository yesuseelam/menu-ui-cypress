import {Component} from "@angular/core";
import {AppInfoService} from "../../../services/app-info/appinfo.service";

@Component({
  selector: 'app-info',
  styleUrls: ['./app-info.component.scss'],
  templateUrl: './app-info.component.html'
})


export class AppInfoComponent {

  appVersion: string;

  buildTime: string;

  commit: string;

  branch: string;

  environment: string;

  commitToolTip: string;

  releaseNotesUrl: string;

  constructor(private appInfoService: AppInfoService) {
    appInfoService.getAppInfo().subscribe(info => {
      this.appVersion = info.version;
      this.buildTime = info.time;
      this.commit = info.git.commit;
      this.branch = info.git.branch;
      this.environment = info.environment;
      this.commitToolTip = `${info.git.message} |  ${info.git.user} | ${info.git.branch}`;
      this.releaseNotesUrl = "https://github.com/cfacorp/menu-api#version-" + info.version.replace('.', '').replace('.', '');
    })
  }


}
