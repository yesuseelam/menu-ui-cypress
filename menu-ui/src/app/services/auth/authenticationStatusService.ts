import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationStatus } from '../../enum/AuthenticationStatus';

@Injectable()
export class AuthStatusService {
    public authStatusChanged: Subject<AuthenticationStatus> = new Subject<AuthenticationStatus>();
}

