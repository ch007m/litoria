#!/usr/bin/env bash

rm -rf ~/Temp/litoria/t4/
node bin/litoria.js init -c slideshow ~/Temp/litoria/t4

cat <<EOF > /Users/chmoulli/Temp/litoria/t4/slideshow-cfg.yaml
source: /Users/chmoulli/Temp/litoria/t4/source/slideshow.adoc
destination: "/Users/chmoulli/Temp/litoria/t4/generated"

attributes:
  backend: 'revealjs'
  templatedir: '/Users/chmoulli/Temp/litoria/t4/_temp/revealjs-backend/' # /Users/chmoulli/Temp/asciidoctorjs-slide-templates-master
  nofooter: 'yes'
  icons: 'font'
  source-highlighter: 'highlight.js' # Attribute required to avoid Revealjs js issue when the syntax higlighter plugin is loaded

options:
  doctype: 'article'
  #to_dir: 'generated'
  #to_file: 'output.html'
  safe: 'unsafe' # Required to avoid that the file to process is not loaded
EOF

cp /Users/chmoulli/Temp/litoria/t4/_temp/revealjs-backend/revealjs/ruler.jade /Users/chmoulli/Temp/litoria/t4/_temp/revealjs-backend/revealjs/thematic_break.jade

node bin/litoria.js generate -r html /Users/chmoulli/Temp/litoria/t4/slideshow-cfg.yaml