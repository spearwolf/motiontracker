#!/bin/bash
root=`dirname $0`
#cd $root
rsync -rvuz $root/Build/ dunkelmagie.info:/home/spw/dunkelmagie.info/html/mt/
