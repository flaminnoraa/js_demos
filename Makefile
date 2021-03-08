NAMES=points \
	closest_points \
	vectors \
	line_intersection \
	line_seg_intersection \

all: html

html:
	rm -rf out/html && mkdir -p out/html
	cp -r include/. out/html
	python build.py source out/html $(NAMES)

