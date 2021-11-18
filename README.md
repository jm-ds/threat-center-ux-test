# Threat Center UX 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Requirements

- NVM: Node Version Manager
- Node 8.9.4 **AND** 10.19.0
- Npm 5.6.0 **AND** 6.13.4
- Angular CLI 8.1.2 (8.1.3)  



## Setup and run Threat Center UX

### NVM: Node Version Manager

We need 2 versions of Node.  
So it's **strongly recommended** to install and use NVM. 
NVM used to manage Node version and quickly and smoothly switch between them.  
NVM: https://github.com/nvm-sh/nvm



### Installation

    # install NVM
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
    
    # install node 10.19.0
    nvm install 10.19.0
    
    # install node 8.9.4
    nvm install 8.9.4
    
    # set using node 8.9.4
    nvm use 8.9.4
    
    # go to threat-center-ux folder
    cd /path/to/threat-center-ux
    
    # set fontawesome pro npm token
    npm config set "@fortawesome:registry" https://npm.fontawesome.com/ && \
    npm config set "//npm.fontawesome.com/:_authToken" 835DE574-0FFE-40E6-8783-4B1CA13F230F
    
    # install fontawesome
    npm install --save @fortawesome/fontawesome-pro
    
    # install project packages
    npm install
    
    # install angular cli 8.1.3
    npm install -g @angular/cli@8.1.3
    
    # For Linux, Also run
    npm link @angular/cli

### Known issues:  

Build may be failed some day bcs of "gyp" error.  
To fix it run following:  

    npm cache clean --force
    rm -rf node_modules package-lock.json
    
    npm i node-gyp --save
    npm -g i node-gyp --save
    
    npm install

If there are errors in the console after `ng serve` like

    ERROR in ./node_modules/css-animator/builder/animation_builder.js
    "export '__spreadArray' was not found in 'tslib'

Run these commands:

    npm uninstall --save css-animator
    npm install --save css-animator@2.3.1

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.



## Run on IntelliJ IDEA

### Run Angular CLI Server configuration

Don't forget to change node version to 10.19.0 in the run configuration if you run Angular CLI Server configuration.

### Run PROD environment on IDEA

To run **prod** environment via on IDEA we have two options.  
1. add `--prod` argument to `ng serve` command in the  start script in the package.json file.
2. add `-- --prog` argument to Angular CLI Server run configuration.

<img alt="Angular CLI Server run configuration" src="https://github.com/threatrix/threat-center-ux/blob/master/angular-cli-server.png">

### Proxy config

To set api proxy config pass `--proxy-config proxy.conf.json` argument same way as `--prod` argument.  
For **PROD** version of proxy set `--proxy-config proxy.conf.prod.json`.

### IDEA run config with proxy config

<font color='red'>**It's importnant to set proxy config to you local installation run command/config so UX app access API properly.**</font>  

<img alt="Angular CLI Server run configuration" src="https://github.com/threatrix/threat-center-ux/blob/master/angular-proxy-settings.png">



## DEV/PROD config/environment

Dev and prod environments  hold in `src/environments/environment.ts` and `src/environments/environment.prod.ts` files accordingly.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build (different environments)

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

<font color='red'>Don't forget to apply proxy config for local development environment build.</font>

### Build summary  
We have two versions of each environment file and proxy config file for dev/local and for prod environments. We set variables in these files once and then just pass required arguments to build/serve command to build dev or prod.

### Build options  
Serve **dev** environment with API proxy  **_(this is how we run app locally)_**

<font color='red'>Don't forget to apply proxy config for local development environment build.</font>

    ng serve --proxy-config proxy.conf.json

Build for **prod** environment with API proxy  (this is how to build prod version that runs independently/standalone)

    ng build --prod --proxy-config proxy.conf.prod.json

Build for **prod** environment **without** API proxy  (this is how most probably we build the app to run as embedded in spring app)

    ng build --prod



## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Project Docs

[Threat Center UX developer docs](docs/README.md)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
