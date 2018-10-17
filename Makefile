.PHONY: install clean serve build test

# Common variables
SRC_FOLDER=src
PUBLIC_FOLDER=_public
JAVASCRIPTS_LOC=src/javascripts
JSON_LOC=src/json
STYLESHEETS_LOC=src/stylesheets
IMAGES_LOC=src/images
REPORTS_FOLDER=reports

# Node module variables
NODE_MODULES=./node_modules
PUGIN=$(NODE_MODULES)/parliamentuk-pugin
ESLINT=$(PUGIN)/node_modules/.bin/eslint
IMAGEMIN=$(PUGIN)/node_modules/.bin/imagemin
NODE_SASS=$(PUGIN)/node_modules/.bin/node-sass
POSTCSS=$(PUGIN)/node_modules/.bin/postcss
PUG=$(PUGIN)/node_modules/.bin/pug
SVGO=$(PUGIN)/node_modules/.bin/svgo
UGLIFY_JS=$(PUGIN)/node_modules/.bin/uglifyjs
LEAFLET=$(PUGIN)/node_modules/leaflet/dist/leaflet.js
PRETTY_MINI_JSON=$(PUGIN)/node_modules/pretty-mini-json/pretty-mini-json.js

# Installs npm packages
install:
	make install -C $(PUGIN)

# Deletes the public folder
clean:
	@rm -rf $(PUBLIC_FOLDER)

# Deletes the public and node modules folder
clean_hard: clean
	@rm -rf $(NODE_MODULES)

# Compiles sass to css
css:
	@mkdir -p $(PUBLIC_FOLDER)/stylesheets
	@$(NODE_SASS) --output-style compressed -o $(PUBLIC_FOLDER)/stylesheets $(STYLESHEETS_LOC)
	@$(NODE_SASS) --output-style compressed -o $(PUBLIC_FOLDER)/stylesheets $(PUGIN)/$(STYLESHEETS_LOC)
	@$(POSTCSS) -u autoprefixer -r $(PUBLIC_FOLDER)/stylesheets/* --no-map

# Minifies javascript files
js:
	@mkdir -p $(PUBLIC_FOLDER)/javascripts
	@$(UGLIFY_JS) $(PUGIN)/$(JAVASCRIPTS_LOC)/*.js -m -o $(PUBLIC_FOLDER)/javascripts/main.js
	@$(UGLIFY_JS) $(JAVASCRIPTS_LOC)/overrides.js -m -o $(PUBLIC_FOLDER)/javascripts/overrides.js
	@$(UGLIFY_JS) $(JAVASCRIPTS_LOC)/form-validation.js -m -o $(PUBLIC_FOLDER)/javascripts/form-validation.js

# Minifies json file
json:
	@mkdir -p $(PUBLIC_FOLDER)/json
	@cp $(JSON_LOC)/sample.json $(PUBLIC_FOLDER)/json/sample.json
	@$(PRETTY_MINI_JSON) $(JSON_LOC)/sample.json -o $(PUBLIC_FOLDER)/json/sample.json

# Minifies images
images:
	@$(IMAGEMIN) $(PUGIN)/$(IMAGES_LOC)/* -o $(PUBLIC_FOLDER)/images

# Optimises SVGs
icons:
	@mkdir -p $(PUBLIC_FOLDER)/icons
	@$(SVGO) -f $(PUGIN)/$(SRC_FOLDER)/icons -o $(PUBLIC_FOLDER)/icons

# Outputs pug files to html within public folder
templates:
	@$(PUG) $(SRC_FOLDER)/templates -P --out $(PUBLIC_FOLDER)/templates

# Runs tests on javascript files
lint:
	# @$(ESLINT) $(JAVASCRIPTS_LOC)

# Launches a local server
serve: clean build
	@node server.js

# Watches project files for changes
watch:
	@node $(PUGIN)/scripts/watch.js $(STYLESHEETS_LOC)=css $(JAVASCRIPTS_LOC)=js $(IMAGES_LOC)=images $(SRC_FOLDER)/layouts=templates $(SRC_FOLDER)/elements=templates $(SRC_FOLDER)/components=templates $(SRC_FOLDER)/templates=templates

# Runs accessibility testing
test:
	@mkdir -p $(REPORTS_FOLDER)
	@rm -rf $(REPORTS_FOLDER)/*
	@node $(PUGIN)/scripts/pa11y.js
	@node $(PUGIN)/scripts/w3c.js

# Builds application
build: lint css js images icons templates json
