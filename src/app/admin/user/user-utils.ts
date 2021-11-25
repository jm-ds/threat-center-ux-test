import {EntityConnection, Role} from "@app/models";
import {NavigationExtras, Router} from "@angular/router";

export class UserUtils {

    constructor(
        protected router: Router
    ) {
        this.router = router;
    }

    renderRoles(roles: Role[]) {
        return roles.map(role => {
            return role.roleId;
        }).sort().join(", ");
    }

    renderEntities(entities: EntityConnection) {
        if (entities) {
            return entities.edges.map(entity => {
                return entity.node.name;
            }).sort().join(", ");
        } else {
            return undefined;
        }
    }


    goToUserShow(username) {
        const target = (event.target || event.srcElement || event.currentTarget) as HTMLElement;
        const td = this.findAncestor(target, "td");
        if (td !== null && td.className.indexOf("skip-row-link") >= 0) {
            return false;
        }
        const navigationExtras: NavigationExtras = {
            queryParams: {
                "userName": username
            }
        };
        this.router.navigate(['/admin/user/show'], navigationExtras);
    }

    goToUserList() {
        this.router.navigateByUrl('admin/user/list');
    }

    goToAssignRoles(username) {
        this.router.navigateByUrl('admin/user/roles/' + encodeURIComponent(username));
    }

    private findAncestor(el, sel) {
        if (el === null) {
            return null;
        }
        while (el !== null && !(el.matches || el.matchesSelector).call(el, sel) ) {
            el = el.parentElement;
        }
        return el;
    }

    goToApiKeyShow(username, apiId) {
        this.router.navigateByUrl('admin/user/show/' + encodeURIComponent(username)+'/show/apikey/' + apiId);
    }


}
