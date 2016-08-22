test: node_modules
	npm run test

clean:
	rm -rf node_modules

node_modules: package.json
	npm install

.PHONY: node_modules