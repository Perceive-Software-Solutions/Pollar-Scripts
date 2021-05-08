

dburl=$1
username=$3
password=$4
db=$2

mongoAccess=mongodb+srv://$username:$password@$dburl/$db

Collections=$(mongo $mongoAccess --quiet --eval "db.getCollectionNames()" | sed 's/,/ /g' | tail +6)

#echo $Collections

for col in $Collections
do
    if [ "$col" = "[" ] || [ "$col" = "]" ]
    then
        continue
    else
        echo "Exporting $col"
        mongoexport --uri $mongoAccess --collection=$col --type json --out output-$col.json
    fi
    
done
