# <img src="https://raw.githubusercontent.com/bucharest-gold/litoria/master/templates/image/litoria-chloris.jpg"> litoria

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/litoria/badge.svg?branch=master)](https://coveralls.io/github/bucharest-gold/litoria?branch=master)
[![Build Status](https://travis-ci.org/bucharest-gold/litoria.svg?branch=master)](https://travis-ci.org/bucharest-gold/litoria) 
[![Known Vulnerabilities](https://snyk.io/test/npm/litoria/badge.svg)](https://snyk.io/test/npm/litoria) 
[![dependencies Status](https://david-dm.org/bucharest-gold/litoria/status.svg)](https://david-dm.org/bucharest-gold/litoria)

[![NPM](https://nodei.co/npm/litoria.png)](https://npmjs.org/package/litoria)


Command Line Tool to manage asciidoc projet (create, watch content), convert adoc into html, pdf & epub3 for doc, reports, revealjs slideshow, hands on lab & more

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache-2.0  |
| Build:          | make  |
| Documentation:  | N/A  |
| Issue tracker:  | https://github.com/bucharest-gold/litoria/issues  |
| Engines:        | Node.js 4.x, 5.x, 6.x

## Installation

    $ npm install litoria -g

## Usage

    $ litoria <cmd> <option> <yaml_config_file>

where `<cmd>` corresponds to one of the command available: init, generate, inline, pdf and the options to the rendering required; html, pdf, ... 

The asciidoctor attributes and the options like the source and destination folders can be defined using a yaml config file

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
    
## Commands

### init

Create a project containing a default config file and a **simple** adoc file
    
    litoria init /path/to/project
    
Many project type or category are supported as described here after :
    
* Simple: project containing a simple adoc example
* Management : project containing a **minute** and **report** adoc example
* Lab : project containing a **Hands on Lab** adoc example
* Slideshow: not yet implemented
    
To use such type, pass the option `-c` or `--category` with the keywords `simple`, `management`, `project` or `slideshow`. The default category is `simple`
    
    litoria init /path/to/project
    litoria init -c management /path/to/project
    litoria init -c lab /path/to/project
        
### generate

Render the asciidoctor(s) file(s) part of the input directory **source** into a HTML file. The generated content is available within the **generated** folder.
    
    litoria generate -r html config.yaml
    
or 
    
    litoria generate config.yaml as the default rendering is `html`
    
The source and destination folders can be changed within the yaml config file.    

### inline
 
 The purpose of this command is to move the css styles from the css files or style tag and to inline them within the HTML tag of the document. This is required when you would like to send
 an email to by example the Gmail client as Google will escape the styles & css file before to display your mail and its HTML content within the browser.

    litoria inline config.yaml
    
### pdf
 
Convert a HTML file into a PDF file
    
    litoria generate -r pdf config.yaml 
       
### send

Send an email to a SMTP server & embed the HTML generated within the Mail created
    
    litoria send config.yaml        
    
The parameters as the subject, sender, recipient, SMTP Server, port number, security mode are defined within the config.yaml file.   
 
### server

Start a local HTTP Server hosting the content generated & passed as parameter within the yaml config file. The default port of the server is `3000`
    
    litoria serve config.yaml  
    litoria serve -o config.yaml  # to open the browser window using the Server URI http://localhost:port/
    
## For the developer only
    
Git clone the project locally and move to the cloned directory. 

To install globally the commands, use these instructions:

    npm install -g
    npm link
    
then you can execute the `litoria` commands in a terminal and continue to develop the project in parallel.

Otherwise, you can run the different commands as such :

Execute in a terminal this command by example to create a new project :

    node bin/litoria.js init /path/to/project

## Debug

To debug the project and the different commands, use the following information to configure the debugger (Eclipse, IntelliJ, ...) :

* javascriptFile: `bin/litoria-init.js`
* application parameters : `/Temp/litoria/blank`

> The litoria.js script file contains all the commands which are defined within their corresponding file `litoria-<cmd>.js` under the `bin` directory. 
> Each command, as described previously, is configured differently. Please refer to the Command section to see which parameters you can use.
> Don't try to debug the `litoria.js` script as it spawns another child process and your Debugger will report a Network Address Port error as it can't access the port !

## Extra information

> This project enhances what is not included within the asciidoctor command line tool. 
> It is a refactoring of the ruby [hyla tool](https://github.com/cmoulliard/hyla) which is currently used
> to create a project, add asciidoctor templates, generate courses, hands on lab content, slideshows for RevealJS presentations, ...

The project name corresponds to the frog genus name **Litoria** which contain many species like the Red Eye Tree Frog **Litoria Chloris** which is very valuable for the 
human due to his [medical capacities](http://www.kaieteurnewsonline.com/2012/06/03/the-red-eyed-tree-frog-litoria-chloris-2/)

## References of interesting projects used

Links to the projects
 
* Inline Css                  : https://github.com/zurb/inline-css
* Send Email                  : https://github.com/nodemailer/nodemailer
* Generate pdf                : https://github.com/marcbachmann/node-html-pdf
* Headless webkit with JS API : https://github.com/Medium/phantomjs
* Command Line Tool           : https://github.com/tj/commander.js

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)
