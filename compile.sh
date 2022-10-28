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
NEEDSMASKING=(
  "wmtry-overlay"
  "wmtry-grid-break"
  "wmtry-grid"
  "wmtry-measurement-tape"
  "v-visible"
  "wmtry-axle"
  "o-horizontal"
  "o-vertical"
  "wmtry-marker"
  "wmtry-grip"
  "a-piece"
  "b-piece"
  "wmtry-position-label"
  "s-dragging"
  "t-fixed"
  "t-oriented"
  "wmtry-level-base"
  "wmtry-level"
  "wmtry-connector"
  "wmtry-info"
  "wmtry-gutter"
  "wmtry-column"
)

JSOUTPATH="$ABS/$JSOUT"
SSOUTPATH="$ABS/$SSOUT"
echo "Compiling '$PRJ'"

echo "Merging JS"
rm -f $JSOUTPATH &> /dev/null
for OUTPATH in ${JSSRC[@]}
do 
  echo "> From '$OUTPATH'"
  cat $OUTPATH >> $JSOUTPATH
done

echo "Merging CSS"
rm $SSOUTPATH &> /dev/null
for OUTPATH in ${SSSRC[@]}
do 
  echo "> From '$OUTPATH'"
  cat $OUTPATH >> $SSOUTPATH
done

CSSCONTENT="$(cat $SSOUTPATH | tr '\n' ' ')"
FIND="%%CSS%%"
perl -pi -e "s/${FIND}/${CSSCONTENT}/g" $JSOUTPATH

for TOMASK in ${NEEDSMASKING[@]}
do 
  perl -pi -e "s/${TOMASK}/wmy$(xxd -l 8 -c 8 -p < /dev/random)/g" $JSOUTPATH
done

rm -f $SSOUTPATH
uglifyjs --compress --mangle --output $JSOUTPATH -- $JSOUTPATH