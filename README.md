# litoria

[![npm](https://img.shields.io/npm/v/litoria.svg?maxAge=2592000)](http://www.npmjs.com/package/litoria)
[![License](http://img.shields.io/npm/l/litoria.svg?style=flat-square)](http://opensource.org/licenses/https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://travis-ci.org/bucharest-gold/litoria.svg?branch=master)](https://travis-ci.org/bucharest-gold/litoria)

A command line tool simplifying the generation of the content created using Asciidoctor syntax.

> This project enhances what is not included within the asciidoctor command line tool. 
> It is a refactoring of the ruby [hyla tool](https://github.com/cmoulliard/hyla) which is currently used
> to create a project, add asciidoctor templates, generate courses, hands on lab content, slideshows for RevealJS presentations, ...

## Install package 
    
    git clone the project
    Move to the cloned directory and execute in a terminal these commands

    npm install
    
## Commands
    
1. Generate HTML content
    
    ```litoria generate config.yaml```

2. Inline css content (required for HTML email send to Gmail client)

    ```litoria inline config.yaml```
    
## To Develop
    
Git clone the project locally and move to the cloned directory. 

To install globally the commands, use these instructions:

```
npm install -g
npm link
```
        
then you can execute the `litoria` commands in a terminal and continue to develop the project in parallel.

Otherwise, you can run the different commands as such :

Execute in a terminal these commands :

```
node bin/litoria.js init /Users/chmoulli/Temp/litoria/blank
```
    
## Debug

To debug the project init command, use the following information:

* javascriptFile: `bin/litoria.js`
* application parameters : `init /Temp/litoria/blank`

> The command init means that a new project will be created within the directory passed as parameter, 
> next a yaml.config file is added, a github repo containing scss files is downloaded, unzipped and finally 
> node-sass is called.

## Build

`nvm use default 6 && make`
    
## Doc

Links to the projects used
 
* Inline Css : https://github.com/zurb/inline-css

