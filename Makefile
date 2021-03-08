NAMES=points \
	closest_points \
	vectors \

all: html

html:
	rm -rf out/html && mkdir -p out/html
	cp -r include/. out/html
	python build.py source out/html $(NAMES)

