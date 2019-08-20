import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Injectable} from "@angular/core";

@Injectable()
export class AppInfoService {
    private readonly apiURL_V2: string = environment._API_URL_V2;

    constructor(private http: HttpClient) {
    }

    public getAppInfo(): Observable<any> {
        return this.http.get(this.apiURL_V2 + '/info');
    }
}