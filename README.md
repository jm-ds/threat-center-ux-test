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

### Build PROD

If you would like to build separate Angular app for production environment 
then don't forget to pass `--prod` and `--proxy-config proxy.conf.prod.json` arguments.

    ng build --prod --proxy-config proxy.conf.prod.json
    
If you would like to use Angular app as embedded into the Spring app then you don't need to pass `--proxy-config proxy.conf.prod.json` argument.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
