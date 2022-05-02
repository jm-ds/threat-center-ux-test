import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'git-hub-error',
    templateUrl: './github-error-page.component.html',
    styleUrls: ['./github-error-page.component.scss']
})

export class GithubErrorComponent implements OnInit {
  gitHubErrorMessage: any;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.route.queryParams
            .subscribe(params => {
                if (!!params) {
                    this.gitHubErrorMessage = params;
                }
            });
    }
    ngOnInit(): void {

    }
    goBack() {
        this.router.navigate(['/login']);
    }
}