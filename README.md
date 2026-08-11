# <img src="https://raw.githubusercontent.com/ch007m/litoria/main/templates/image/litoria-chloris.jpg"> litoria

[![Known Vulnerabilities](https://snyk.io/test/npm/litoria/badge.svg)](https://snyk.io/test/npm/litoria)
[![NPM](https://nodei.co/npm/litoria.png)](https://npmjs.org/package/litoria)

Command Line Tool to manage AsciiDoc projects (create, watch content), convert adoc into HTML, PDF & epub3 for documents, reports, RevealJS slideshows, hands-on labs & more

|                 | Project Info                             |
| --------------- |------------------------------------------|
| License:        | Apache-2.0                               |
| Build:          | make                                     |
| Documentation:  | N/A                                      |
| Issue tracker:  | https://github.com/ch007m/litoria/issues |
| Engines:        | Node.js >= 22.x                          |

## Installation

    $ npm install litoria -g

## Usage

    $ litoria <cmd> [options]

where `<cmd>` corresponds to one of the commands available: `init`, `generate`, `inline`, `pdf`, `send`, `serve`.

The Asciidoctor attributes and the options like the source and destination folders can be defined using a YAML config file

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
    
Many project's types are supported as described hereafter :
    
* Simple: simple adoc example
* Management : folder containing a **minute** and **report** adoc example
* Lab : **Hands-on Lab** example
* Slideshow: RevealJS slideshow project
    
To use such type, pass the option `-t` or `--type` with the keywords `simple`, `management`, `lab` or `slideshow`. The default type is `simple`
    
    litoria init /path/to/project
    litoria init -t management /path/to/project
    litoria init -t lab /path/to/project
        
### generate

Render the Asciidoctor(s) file(s) part of the input directory **source** into an HTML file. The generated content is available within the **generated** folder.

If no config file is specified, litoria looks for `config.yaml` or `config.yml` in the current (or project) directory:
    
    litoria generate

To use a specific config file, pass it with `-c`:
    
    litoria generate -c html-cfg.yaml
    
By default, the rendering is `html`. To specify a different rendering type, use the `-r` option:
    
    litoria generate -r html -c config.yaml
    litoria generate -r pdf -c config.yaml

To run the generate command against a project located in a different directory, use the `-p` or `--path` option. The config file paths (source, destination) will be resolved relative to the specified project path:
    
    litoria generate -p /path/to/project
    litoria generate --path ./report/quarkus -c html-cfg.yaml

A warning is displayed if the config file does not exist.

The source and destination folders can be changed within the yaml config file.

### slideshow 

Create a slideshow presentation using the template [slideshow](templates/slideshow.adoc)

    litoria init -t slideshow /path/to/project

Render the Asciidoctor(s) file(s) part of the input directory **source** into a RevealJS Slideshow. The generated content is available within the **generated** folder.
    
    litoria generate -c slideshow-cfg.yaml
 
**IMPORTANT** : Copy your own resources such as `image`, `css` folders under the **generated** folder and start a local http server using the `serve` command.
    
**NOTE** : To configure RevealJS [parameters](https://docs.asciidoctor.org/reveal.js-converter/latest/converter/revealjs-options/) such as theme, transition, css, etc. simply add them under the section `attributes` of the cfg file

```bash
E.g.

attributes:
  backend: 'revealjs'
  icons: font
  revealjs_theme: white 
```

### inline
 
 The purpose of this command is to move the CSS styles from the CSS files or style tag and to inline them within the HTML tag of the document. This is required when you would like to email by example the Gmail client as Google will escape the styles & CSS file before to display your mail and its HTML content within the browser.

    litoria inline config.yaml
    
### pdf
 
Convert an HTML file into a PDF file
    
    litoria generate -r pdf -c config.yaml
       
### send

Send email to an SMTP server & embed the HTML generated within the Mail created
    
    litoria send config.yaml        
    
The parameters as the subject, sender, recipient, SMTP Server, port number, security mode are defined within the config.yaml file.  

**Note** :  To generate your ClientId, Secret, Access and RefreshToken for Gmail's OAuth2, read the following [blog](http://masashi-k.blogspot.com/2013/06/sending-mail-with-gmail-using-xoauth2.html)
 
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
> It is a refactoring of the ruby [hyla tool](https://github.com/ch007m/hyla) which is currently used
> to create a project, add asciidoctor templates, generate courses, hands on lab content, slideshows for RevealJS presentations, ...

The project name corresponds to the frog genus name **Litoria** which contains many species like the Red Eye Tree Frog **Litoria Chloris** which is very valuable for 
humans due to its [medical capacities](http://www.kaieteurnewsonline.com/2012/06/03/the-red-eyed-tree-frog-litoria-chloris-2/)

## References of interesting projects used

Links to the projects
 
* AsciiDoc processor          : https://github.com/asciidoctor/asciidoctor.js
* RevealJS converter          : https://github.com/asciidoctor/asciidoctor-reveal.js
* HTTP server                 : https://github.com/hapijs/hapi
* Inline CSS                  : https://github.com/jonkemp/inline-css
* Send email                  : https://github.com/nodemailer/nodemailer
* Generate PDF                : https://github.com/puppeteer/puppeteer
* Command line tool           : https://github.com/tj/commander.js

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)
