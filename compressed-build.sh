# 1. Squish modules together
sh build.sh

DIR='public-compressed'
SRC='public'
INDEX='index.html'

rm -rf $DIR && mkdir $DIR

# 2. Copy html
echo "copying:" $SRC/$INDEX
cp $SRC/$INDEX $DIR/$INDEX

# 3. Copy + compress server and client 
for component in shared client server
do
    touch $DIR/$component.js && rm $DIR/$component.js

    echo "uglify:" $SRC/$component.js
    cat $SRC/$component.js | uglifyjs -cmt > $DIR/$component.js

    # Alt
#    echo "closure-compile:" $SRC/$component.js
#    ccjs `pwd`/$SRC/$component.js > `pwd`/$DIR/$component.js
done

# 4. Zip
echo "Zipping to:" $DIR.zip
touch $DIR.zip && rm $DIR.zip
zip -r9 $DIR.zip $DIR

# 5. How big is it?
echo "DONE"
echo "Zip file size:" `du -b $DIR.zip`
