PYTHON := .venv/bin/python3
MKDOCS := .venv/bin/mkdocs

.PHONY: install serve build clean

install:
	python3 -m venv .venv
	$(PYTHON) -m pip install -r requirements.txt -q

serve:
	$(PYTHON) scripts/build_docs.py && $(MKDOCS) serve

build:
	$(PYTHON) scripts/build_docs.py && $(MKDOCS) build --strict

clean:
	rm -rf site/ docs/tier-1-foundations/ docs/tier-2-mastery/ docs/tier-3-operations/
