.PHONY: ci clean install lint test coverage

ci: clean lint test coverage

clean:
	@echo "== Cleaning node_modules =="
	rm -rf node_modules

install: node_modules

node_modules: package.json package-lock.json
	@echo "== Installing dependencies =="
	npm ci

lint: install
	@echo "== Linting =="
	npm run lint

test: install
	@echo "== Running tests =="
	npm test

coverage: install
	@echo "== Running coverage =="
	npm run coverage
