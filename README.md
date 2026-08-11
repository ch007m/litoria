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
* Management : a **minute** and **report** adoc example
* Lab : **Hands-on Lab** example
* Slideshow: RevealJS slideshow project
    
To use such type, pass the option `-t` or `--type` with the keywords `simple`, `management`, `lab` or `slideshow`. The default type is `simple`
    
    litoria init /path/to/project
    litoria init -t management /path/to/project
    litoria init -t lab /path/to/project

Each type generates a single `config.yaml` file with different sections:

| Section     | [simple](templates/config/simple.yaml) | [management](templates/config/management.yaml) | [lab](templates/config/lab.yaml) | [slideshow](templates/config/slideshow.yaml) |
|-------------|:------:|:----------:|:---:|:---------:|
| source      |   x    |     x      |  x  |     x     |
| destination |   x    |     x      |  x  |     x     |
| attributes  |   x    |     x      |  x  |     x     |
| options     |   x    |     x      |  x  |     x     |
| http        |   x    |     x      |  x  |     x     |
| pdf         |   x    |     x      |  x  |           |
| smtp        |        |     x      |     |           |
| mail        |        |     x      |     |           |

### generate

Render the Asciidoctor(s) file(s) part of the input directory **source** into an HTML file. The generated content is available within the **generated** folder.

If no config file is specified, litoria looks for `config.yaml` or `config.yml` in the current (or project) directory:
    
    litoria generate

To use a specific config file, pass it with `-c`:
    
    litoria generate -c my-config.yaml
    
By default, the rendering is `html`. To specify a different rendering type, use the `-r` option:
    
    litoria generate -r html -c config.yaml
    litoria generate -r pdf -c config.yaml

To run the generate command against a project located in a different directory, pass the project path as an argument:
    
    litoria generate ./report/quarkus
    litoria generate ./report/quarkus -c custom.yaml

A warning is displayed if the config file does not exist.

The source and destination folders can be changed within the yaml config file.

### slideshow 

Create a slideshow presentation using the template [slideshow](templates/slideshow.adoc)

    litoria init -t slideshow /path/to/project

Render the Asciidoctor(s) file(s) part of the input directory **source** into a RevealJS Slideshow. The generated content is available within the **generated** folder.
    
    litoria generate -c config.yaml
 
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

    litoria inline ./report/quarkus
    
### pdf
 
Convert an HTML file into a PDF file
    
    litoria generate -r pdf
       
### send

Send email to an SMTP server & embed the HTML generated within the Mail created
    
    litoria send ./report/quarkus
    
Configure the `smtp` and `mail` sections in your `config.yaml`:

```yaml
smtp:
  host: "smtp.gmail.com"
  port: 587
  secure: false
  requireTLS: true
  user: "your-email@gmail.com"
  # For App Password auth:
  pass: "your-app-password"
  # For OAuth2 auth (remove pass and use these instead):
  # clientId: "your-client-id"
  # clientSecret: "your-client-secret"
  # refreshToken: "your-refresh-token"

mail:
  from: "your-email@gmail.com"
  to: "recipient@domain.com"
  subject: "{author}'s weekly report : {date}"
  variables:
    author: "First & Last Name"
    email: "your-email@gmail.com"
```

**smtp fields:**

| Field         | Description                                       | Required |
|---------------|---------------------------------------------------|:--------:|
| host          | SMTP server hostname                              |    x     |
| port          | SMTP port (587 for TLS, 465 for SSL)              |    x     |
| secure        | `true` for port 465, `false` for 587              |    x     |
| requireTLS    | Force STARTTLS upgrade                            |          |
| tls           | TLS options (e.g., `rejectUnauthorized: false`)   |          |
| user          | Email account username                            |    x     |
| pass          | App Password (for App Password auth)              |          |
| clientId      | OAuth2 Client ID (for OAuth2 auth)                |          |
| clientSecret  | OAuth2 Client Secret (for OAuth2 auth)            |          |
| refreshToken  | OAuth2 Refresh Token (for OAuth2 auth)            |          |
| logger        | Enable SMTP logging (`true`/`false`)              |          |
| debug         | Enable debug output (`true`/`false`)              |          |

**mail fields:**

| Field     | Description                                                     | Required |
|-----------|-----------------------------------------------------------------|:--------:|
| from      | Sender email address                                            |    x     |
| to        | Recipient email address(es)                                     |    x     |
| subject   | Email subject (supports `{variable}` placeholders)              |    x     |
| body      | Email body as inline HTML (supports `{variable}` and `{break}`) |          |
| signature | Appended after the body (supports `{variable}` and `{break}`)  |          |
| variables | Key-value pairs for template placeholders                       |          |

If `body` is not set, the content of `file_inlined` is used as the email body.

The `{date}` variable is auto-filled with today's date if not explicitly defined. Use `{break}` for line breaks in the subject or body.

**Gmail authentication** (see [nodemailer Gmail guide](https://nodemailer.com/guides/using-gmail)):

* **App Password** (simpler): Enable 2-Step Verification, then generate an app password at https://myaccount.google.com/apppasswords. Set `user` and `pass`.
* **OAuth2** (recommended): Set `user`, `clientId`, `clientSecret`, and `refreshToken`.
 
### server

Start a local HTTP Server hosting the content generated & passed as parameter within the yaml config file. The default port of the server is `3000`
    
    litoria serve ./report/quarkus
    litoria serve -o ./report/quarkus  # to open the browser window
    
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
