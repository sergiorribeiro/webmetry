#!/bin/bash

PRJ="webmetry"
ABS="."

JSOUT="output.js"
SSOUT="output.css"
JSSRC=(
  "$ABS/src/js/main.js"
)
SSSRC=(
  "$ABS/src/css/main.css"
)

JSOUTPATH="$ABS/$JSOUT"
SSOUTPATH="$ABS/$SSOUT"
echo "Compiling '$PRJ'"

echo "Merging JS"
rm -f $JSOUTPATH &> /dev/null
for OUTPATH in ${JSSRC[*]}
do 
  echo "> From '$OUTPATH'"
  cat $OUTPATH >> $JSOUTPATH
done

echo "Merging CSS"
rm $SSOUTPATH &> /dev/null
for OUTPATH in ${SSSRC[*]}
do 
  echo "> From '$OUTPATH'"
  cat $OUTPATH >> $SSOUTPATH
done

CSSCONTENT=`cat $SSOUTPATH`
FIND="%%CSS%%"
perl -pi -e "s/${FIND}/${CSSCONTENT}/g" $JSOUTPATH

rm -f $SSOUTPATH