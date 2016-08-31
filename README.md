# litoria

[![npm](https://img.shields.io/npm/v/litoria.svg?maxAge=2592000)](http://www.npmjs.com/package/litoria)
[![License](http://img.shields.io/npm/l/litoria.svg?style=flat-square)](http://opensource.org/licenses/https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://travis-ci.org/bucharest-gold/litoria.svg?branch=master)](https://travis-ci.org/bucharest-gold/litoria)

A command line tool simplifying the generation of the content created using Asciidoctor syntax.

> This project enhances what is not included within the asciidoctor command line tool. 
> It is a refactoring of the ruby [hyla tool](https://github.com/cmoulliard/hyla) which is currently used
> to create a project, add asciidoctor templates, generate courses, hands on lab content, slideshows for RevealJS presentations, ...

## Installation

Install the `litoria` command line tool via [npm](http://npmjs.org/):

```
$ npm install -g litoria
```

## Command-line

```
$ litoria <cmd> <option> <yaml_config_file>
```    

where `<cmd>` corresponds to one of the command available: init, generate, inline, pdf and the options to the rendering required; html, pdf, ... 

The asciidoctor attributes and the options like the source and destination folders can be defined using a yaml config file

```
source: "./source" # or could be a directory eg. ./examples
file_to_inline: "./generated/output.html"
file_inlined: "./generated/output-inlined.html"

attributes:  # Asciidoctor attributes
  stylesheet: 'foundation.css' # asciidoctor, foundation
  stylesdir: 'css' # directory defined within the source folder and containing the css styles
  nofooter: 'yes'
  icons: 'font'
  # linkcss: 'true' # Don't use this option if you want to embed the CSS

options:  # Asciidoctor options
  doctype: 'article'
  to_dir: 'generated'
  # to_file: 'output.html'
  safe: 'unsafe' # Required to avoid that the file to process is not loaded

```
    
## Commands

1. Create a project
    
    ```litoria init /path/to/project```
        
2. Generate HTML content
    
    ```litoria generate -r html config.yaml```
    
    or 
    
    ```litoria generate config.yaml``` as the default rendering is `html`

3. Inline css content (required for HTML email send to Gmail client)

    ```litoria inline config.yaml```
    
4. Convert the HTML file into a PDF file
    
    ```litoria generate -r pdf config.yaml``` 
       
4. Send email to a SMTP server & embed the HTML generated within the Mail 
    
    ```litoria send config.yaml```        
    
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

