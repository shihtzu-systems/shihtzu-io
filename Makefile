version := $(shell cat app.version)
datestamp := $(shell cat app.datestamp)
timestamp := $(shell cat app.timestamp)

stamp: out-dir
	printf `/bin/date "+%Y%m%d"` > app.datestamp
	printf `/bin/date "+%H%M%S"` > app.timestamp
	printf "$(version)" > app.version

out-dir:
	mkdir -p out

yolo:
	pulumi up