# Threat Center UX 

NextV813  
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Run on IntelliJ IDEA

To run **prod** environment via on IDEA we have two options.  
1. add `--prod` argument to `ng serve` command in the  start script in the package.json file.
2. add `-- --prog` argument to Angular CLI Server run configuration.

To set api proxy config pass `--proxy-config proxy.conf.json` argument same way as `--prod` argument.  

<img alt="Angular CLI Server run configuration" src="https://github.com/threatrix/threat-center-ux/blob/master/angular-cli-server.png">


## Dev/Prod config/environment

Dev and prod environments  hold in `src/environments/environment.ts` and `src/environments/environment.prod.ts` files accordingly.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.  
Use the `--prod` flag for a production build.

We use `--prod` build flag to apply prod settings and use prod API URLs. We don't need to change API URLs manually.  

We use environment config variables to get API URL in services. AuthenticationService line 31 for example (`const url = environment.apiUrl + '/user';`).  
And we pass `--proxy-config` argument to build command to set which proxy config we use.

We have two places were API URLs are featured: 
- `environment.ts (environment.prod.ts)` - responsible for environments
- `proxy.conf.json (proxy.conf.prod.json)` - responsible for API proxy

### Environments  
We have `src/environments` folder in the project. There we have two files `environment.ts` and `environment.prod.ts`.  
First file contains variables for **dev** environment, second for **prod**. Second file applied to project when we build project with `--prod` flag.

### API proxy  
To apply API proxy we pass `--proxy-config proxy.conf.json` argument to build (or serve) command. To build **prod** version we just pass prod version of proxy config `--proxy-config proxy.conf.prod.json`.  
If you would like to use Angular app as embedded into the Spring app then you **don't** need to pass `--proxy-config proxy.conf.prod.json` argument.

### Build summary  
We have two versions of each environment file and proxy config file for dev/local and for prod environments. We set variables in these files once and then just pass required arguments to build/serve command to build dev or prod.

### Build options  
Serve **dev** environment with API proxy  **_(this is how we run app locally)_**
  
    ng serve --proxy-config proxy.conf.json

Build for **prod** environment with API proxy  (this is how to build prod version that runs independently/standalone)
  
    ng build --prod --proxy-config proxy.conf.prod.json

Build for **prod** environment **without** API proxy  (this is how most probably we build the app to run as embedded in spring app)
  
    ng build --prod



## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
