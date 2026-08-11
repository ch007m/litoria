.PHONY: ci clean install lint test coverage

ci: clean lint test coverage

clean:
	rm -rf node_modules

install: node_modules

node_modules: package.json package-lock.json
	npm ci

lint: install
	npm run lint

test: install
	npm test

coverage: install
	npm run coverage
