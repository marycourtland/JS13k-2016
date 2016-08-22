# This just squishes modules together amd-style.
export SRC='public'

cd $SRC

for component in client server shared
do
    touch $component.js && rm $component.js
    for file in $component/*.js
    do  
        echo "// ====== " $file >> $component.js
        cat "$file" >> $component.js
    done
done

