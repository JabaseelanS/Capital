# Packapill Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Powershell issue

If you encounter the following error when trying to execute a PowerShell script:

`ng.ps1 is not digitally signed. You cannot run this script on the current system. For more information about running scripts and setting execution policy, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.`

To rectify this error, you can set the execution policy to RemoteSigned for the current user. Open a PowerShell terminal and run the following command:

    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    

## Angular CLI Version 14.0.0

To ensure compatibility with your project, you need to install Angular CLI version 14.0.0. Follow these steps:

1.Open a terminal or command prompt.
2.Run the following command to install Angular CLI version 14.0.0 globally:

    npm install -g @angular/cli@14.0.0

## Node.js Version 14.17.0 (Required for Project)
  
To ensure compatibility with your project, you need to install Node.js version 14.17.0. Follow these steps:

1.Visit the Node.js website to download the installer for version 14.17.0 suitable for your operating system.
2.Follow the installation instructions provided for your operating system.
3.After installation, verify that Node.js and npm (Node Package Manager) are installed correctly by running the following commands in your terminal or command prompt: 
    
    node -v
This command should display the installed Node.js version, which should be v14.17.0.

    npm -v
This command should display the installed npm version.

## Installing Required NPM Packages

To add the necessary NPM packages required for your project, execute the following commands:

1.ngx-material-timepicker@5.2.3:

    npm install ngx-material-timepicker@5.2.3
2.@types/lodash@4.14.74 (Development Dependency):

    npm install --save-dev @types/lodash@4.14.74
3.@auth0/angular-jwt@5.0.2:

    npm install @auth0/angular-jwt@5.0.2
These commands will install the specified versions of the packages into your project, ensuring compatibility and functionality as required.