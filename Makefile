.PHONY: install lint test coverage ci clean

install: node_modules

node_modules: package.json package-lock.json
	npm ci

lint: install
	npm run lint

test: lint
	npm test

coverage: install
	npm run coverage

ci: test coverage

clean:
	rm -rf node_modules
