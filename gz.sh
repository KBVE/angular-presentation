#!/bin/bash
# Written by By Matt Gadient
LOCATION="./"
FILES="htm|css|html|js|json"

process() {

DEBUG=1
SLEEP_DELAY=0.1

        FILE="$1"

        if [ -f "$FILE".gz ]
        then
                FILE_ORIG=$(stat -c %Y "$FILE")
                FILE_GZIP=$(stat -c %Y "$FILE".gz)
                if [ $FILE_ORIG -gt $FILE_GZIP ]
                then
                        rm "$FILE".gz
                        gzip -k -9 "$FILE"
                        if [ "$DEBUG" == 1 ]
                        then
                                echo "Deleted old .gz and created new one at: $FILE.gz"
                                sleep $SLEEP_DELAY
                        fi
                else
                        if [ "$DEBUG" == 1 ]
                        then
                                echo "Skipping - Already up to date: $FILE.gz" 
                        fi
                fi
        else
                gzip -k -9 "$FILE"
                if [ "$DEBUG" == 1 ]
                then
                        echo "Created new: $FILE.gz"
                        sleep $SLEEP_DELAY
                fi
        fi
}
export -f process
find $LOCATION -type f -regextype posix-extended -regex '.*\.('$FILES')' -exec /bin/bash -c 'process "{}"' \;