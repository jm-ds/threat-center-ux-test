import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUIMethodsDecorator } from '@app/core/decorators/common.decorator';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { AuthenticationService } from '@app/security/services';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})

@CommonUIMethodsDecorator()

export class NavRightComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private coreHelperService: CoreHelperService) { }

  ngOnInit() { }
}
