# litoria

[![Build Status](https://travis-ci.org/bucharest-gold/litoria.svg?branch=master)](https://travis-ci.org/bucharest-gold/litoria)

A command line tool simplifying the generation of the content created using Asciidoctor syntax.

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
    
    git clone the project
    Move to the cloned directory and execute in a terminal these commands
    npm install -g
    npm link
    
then you can execute the `litoria` commands in a terminal and continue to develop the project in parallel.
    
## Debug

To debug the project init command, use the following information:

* javascriptFile: `bin/litoria.js`
* application parameters : `init /Temp/litoria/blank`

## Build

`nvm use default 6 && make`
    
## Doc

Links to the projects used
 
* Inline Css : https://github.com/zurb/inline-css

