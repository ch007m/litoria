# litoria

[![npm](https://img.shields.io/npm/v/litoria.svg?maxAge=2592000)](http://www.npmjs.com/package/litoria)
[![License](http://img.shields.io/npm/l/litoria.svg?style=flat-square)](http://opensource.org/licenses/https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://travis-ci.org/bucharest-gold/litoria.svg?branch=master)](https://travis-ci.org/bucharest-gold/litoria)

A command line tool simplifying the generation of the content created using Asciidoctor markdown.

> This project enhances what is not included within the asciidoctor command line tool. 
> It is a refactoring of the ruby [hyla tool](https://github.com/cmoulliard/hyla) which is currently used
> to create a project, add asciidoctor templates, generate courses, hands on lab content, slideshows for RevealJS presentations, ...

The project name corresponds to the frog genus name **Litoria** which contain many species like the Red Eye Tree Frog **Litoria Chloris** which is very valuable for the 
human due to his [medical capacities](http://www.kaieteurnewsonline.com/2012/06/03/the-red-eyed-tree-frog-litoria-chloris-2/)

<img src="https://raw.githubusercontent.com/bucharest-gold/litoria/master/templates/image/litoria-chloris.jpg" width="150" style="vertical-align: top;"> 

</br>

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

### init

Create a project containing a default config file and a **simple** adoc file
    
    ```litoria init /path/to/project```
    
    Many project type or category are supported as described here after :
    
    * Simple: project containing a simple adoc example
    * Management : project containing a **minute** and **report** adoc example
    * Lab : project containing a **Hands on Lab** adoc example
    * Slideshow: not yet implemented
    
    To use such type, pass the option +-c or --category+ with the keywords +simple+,+management+,+project+ or +slideshow+. The default category is +simple+
    
    ```litoria init /path/to/project```
    ```litoria init -c management /path/to/project``` 
    ```litoria init -c lab /path/to/project```
        
### generate

Generate from the asciidoctor(s) file(s) a HTML file contained within the input directory **source**. The generated content will be available within the **generated** folder
    
    ```litoria generate -r html config.yaml```
    
    or 
    
    ```litoria generate config.yaml``` as the default rendering is `html`

### inline
 
 The purpose of this command is to move the css styles from the css files or style tag and to inline them within the HTML tag of the document. This is required when you would like to send
 an email to by example the Gmail client as Google will escape the styles & css file before to display your mail and it HTML content within the browser.

    ```litoria inline config.yaml```
    
### pdf
 
Convert a HTML file into a PDF file
    
    ```litoria generate -r pdf config.yaml``` 
       
### send

Send an email to a SMTP server & embed the HTML generated within the Mail created
    
    ```litoria send config.yaml```        
    
The parameters as the subject, sender, recipient, SMTP Server, port number, security mode are defined within the config.yaml file.    
    
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

