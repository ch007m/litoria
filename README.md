# asciidoctor-nodejs

## TODO

- Review this doc as we have started to move the code to commands
- Find a project name and rename the command line tool 
- Setup test case for the commands
- What is the best way to log (ERR, INFO, ...) - see bunyan ()
- Review Node version required. Should be 4,5 & 6
- Merge common.js with functions.js

## Install package 

Version of node required : 6.3

    npm install

## Run

    node asciidoc.js
    
## Commands
    
1. Generate HTML content
    
    ```cmd generate config.yaml```

2. Inline css content (required for HTML email send to Gmail client)

    ```cmd inline config.yaml```

## To debug

    npm install -g node-debug
    
    node-debug asciidoc.js
    
## Doc

Links to the projects used
 
* Inline Css : https://github.com/zurb/inline-css

