# How-to use/apply authorization



## How to apply authorization to routes

In the **`app-routing.module.ts`** or **any other** routing module we could set AuthGuard (**`auth.guard.ts`**) to **canActivate** and/or **canActivateChild**.

And to set which permissiaons required to access the route we shoud add **"data"** object with **"auth"** property to the route definition in the couting module. The auth property can be of type string or array of strings. Single permissions or list of permissions respectively.

```
const routes: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
            },
            {
                path: 'list',
                component: UserListComponent,
                data: {auth: "USER_VIEW"}
            },
            {
                path: 'show/:username',
                component: UserShowComponent,
                data: {auth: ["USER_VIEW", "USER_EDIT"]}
            }
        ]
    }
];
```

Difference between canActivate and canActivateChild is that if only canActivate set then only current route would be checked for authorization. Whereas if canActivateChild set then all children routes would be checked as well.

Note that if canActivateChild set then all **intermediate** children route would be checked.
For example if we set canActivateChild to root path in the **`app-routing.module.ts`** and trying to access **`/admin/user/list`** then AuthGuard.canActivateChild method would be called for following routes:

1. `admin` path in the `app-routing.module.ts`
2. root path (empty string) in the `admin-routing.module.ts`
3. `user` path in the `admin-routing.module.ts`
4. root path in the `user-routing.module.ts`
5. `list` path in the `user-routing.module.ts` *(this is target/final route in this case)*

So in case of setting canActivateChild for routes higher in the hierarchy we have to remember to set proper permissions to all intermediate routes.



## How to disable/hide/remove elements depending on permissions

To disable, hide or remove elements or components use following custom directives:

- disableIfUnauthorized
- hideIfUnauthorized
- removeIfUnauthorized

Pass single permission of array of permissions to these directives.

**Examples:**

```html
<div [hideIfUnauthorized]="'USER_DELETE'">This block would be hidden if user have no USER_DELETE permission.</div>
```

```html
<input [disableIfUnauthorized]="['USER_DELETE', 'ROLE_DELETE']" type="text" value="This input would be disabled if user does not have USER_DELETE or ROLE_DELETE permission." />
```

```html
<button onclick="alert('button clicked');" [disableIfUnauthorized]="['USER_DELETE', 'ROLE_DELETE']" class="btn btn-info">Button disabled</button>
```

```html
<a href="javascript: alert('button clicked');" [disableIfUnauthorized]="['USER_DELETE', 'ROLE_DELETE']" class="btn btn-info">Link button disabled</a>
```

```html
<div [removeIfUnauthorized]="'USER_DELETE'">This block would be removed from DOM if user have no USER_DELETE permission.</div>
```

```html
<app-user-card [hideIfUnauthorized]="'USER_DELETE'" [user]="user" [showMenu]="true"></app-user-card>
```



## References

https://timdeschryver.dev/blog/the-difference-between-the-canactivate-and-canactivatechild-guards

https://scotch.io/courses/routing-angular-applications/canactivate-and-canactivatechild

https://angular.io/api/router/CanActivate

https://angular.io/api/router/CanActivateChild

https://devblogs.microsoft.com/premier-developer/angular-how-to-implement-role-based-security/





