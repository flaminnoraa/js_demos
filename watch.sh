fswatch -o source Makefile | xargs -n1 -I{} make
