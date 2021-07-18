import {Component, ElementRef, OnInit} from '@angular/core';
import {Entity, EntityEdge, Message, Messages, Role, User} from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "@app/admin/services/user.service";
import {DualListComponent} from "angular-dual-listbox";
import {RoleService} from "@app/admin/services/role.service";
import {ApiService} from "@app/threat-center/shared/services";
import {IOption} from "ng-select";

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    newUser = true;
    user: User;
    messages: Messages;

    display: any;
    format: any = DualListComponent.DEFAULT_FORMAT;
    roles: Array<any>;
    selectedRoles: Array<any>;

    entities: Entity[];
    entitySelectItems: Array<IOption>;
    entitySelectSelectedItems: Array<string>;


    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private apiService: ApiService,
        protected router: Router,
        private route: ActivatedRoute,
        private el: ElementRef
    ) {
        this.messages = Messages.fromRouter(this.router);
    }


    ngOnInit() {
        const username = this.route.snapshot.paramMap.get('username');

        if (username !== null && username !== undefined) {
            this.userService.getUser(username).subscribe(
                data => {
                    this.user = data.data.user;
                    this.newUser = false;
                    this.selectedRoles = this.user.userRoles;
                    this.entitySelectSelectedItems = this.user.userEntities.edges.map(edge => edge.node.entityId);
                },
                error => {
                    console.error("UserEditComponent", error);
                }
            );
        } else {
            this.newUser = true;
            this.user = new User();
            this.selectedRoles = [];
        }

        this.roleService.getRoleList().subscribe(
            data => {
                if (this.selectedRoles !== undefined) {
                    this.roles = data.data.roles.filter(role => !this.selectedRoles.includes(role));
                }
                else {
                    this.roles = data.data.roles;
                }
            },
            error => {
                console.error("UserEditComponent", error);
            }
        );

        this.apiService.getEntityList().subscribe(data => {
            this.entities = data.data.entities.edges.map((e)=>e.node);
            this.entitySelectItems = this.getSelectItemsFromEntities(this.entities);
        }, error => {
            console.error("UserEditComponent", error);
        });

        this.display = this.roleDisplay;
    }

    save(form) {
        if (form.form.invalid) {
            form.form.markAllAsTouched();
            this.scrollToFirstInvalidControl();
        }
    }

    private roleDisplay(item: any) {
        return item.roleId + ' - ' + item.description;
    }

    private getSelectItemsFromEntities(entities: Array<Entity>): Array<IOption> {
        return entities.map(entity => {
            return {value: entity.entityId, label: entity.name} as IOption;
        });
    }

    private getEntitiesFromSelectedValues(values: Array<string>): Array<Entity> {
        return values.map(value => {
            for (const entity of this.entities) {
                if (entity.entityId === value) {
                    return entity;
                }
            }
            return null;
        });
    }


    private saveUser() {
        this.user.userRoles = this.selectedRoles;
        this.user.userEntities.edges = !!this.entitySelectSelectedItems && this.entitySelectSelectedItems.length >= 1 ? this.getEntitiesFromSelectedValues(this.entitySelectSelectedItems).map(entity=> new EntityEdge(entity, "")) : [];

        this.userService.saveUser(this.user, this.newUser)
            .subscribe(({data}) => {
                this.router.navigate(['/admin/user/show/' + this.user.email],
                    {state: {messages: [Message.success("User saved successfully.")]}});
            }, (error) => {
                console.error('User Saving', error);
                this.router.navigate([this.newUser ? '/admin/user/list' : '/admin/user/show/' + this.user.username],
                    {state: {messages: [Message.error("Unexpected error occurred while trying to save user.")]}});
            });
    }

    private scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
          "form .ng-invalid"
        );
        firstInvalidControl.focus(); //without smooth behavior
      }
}
