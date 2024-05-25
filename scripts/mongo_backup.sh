#!/bin/bash

# reference: https://bansalnagesh.medium.com/backing-up-mongodb-on-aws-ec2-to-s3-b045b5727fd6
#Force file syncronization and lock writes
mongosh admin --eval "printjson(db.fsyncLock())"
 
MONGODUMP_PATH="/usr/bin/mongodump"
MONGO_DATABASE="epitomecredit" #replace with your database name
 
TIMESTAMP=`date +%F-%H%M`
S3_BUCKET_NAME="epitomecredit-db" #replace with your bucket name on Amazon S3
S3_BUCKET_PATH="prod"
 
# Create backup
$MONGODUMP_PATH -d $MONGO_DATABASE
 
# Add timestamp to backup
mv dump mongodb-$HOSTNAME-$TIMESTAMP
tar cf mongodb-$HOSTNAME-$TIMESTAMP.tar mongodb-$HOSTNAME-$TIMESTAMP
 
# Upload to S3
aws s3 cp mongodb-$HOSTNAME-$TIMESTAMP.tar s3://$S3_BUCKET_NAME/$S3_BUCKET_PATH/mongodb-$HOSTNAME-$TIMESTAMP.tar
 
#Unlock database writes
mongosh admin --eval "printjson(db.fsyncUnlock())"
#Delete local files
rm -rf mongodb-*

#cron: 0 00 * * * /bin/bash /home/ubuntu/scripts/mongodb_prod_bkp.sh
