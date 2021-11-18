import { Component, OnInit } from '@angular/core';
import { CoreHelperService } from '@app/services/core/core-helper.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private _coreHelperService: CoreHelperService) {
  }

  ngOnInit() {
    //removing darlk theme class from body if available.
    this._coreHelperService.removeNextDarkClassFormBody();
  }

}