test: node_modules
	npm run test
	npm run coverage

clean:
	rm -rf node_modules

node_modules: package.json
	npm install

.PHONY: node_modules