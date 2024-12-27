//Steps to congig AWS 1.create a user and bucket 2.Add policy in the bucket for access
const AWS =require('aws-sdk');
AWS.config.update({region:'ap-south-1'}); //region given AWS closer to target audience
const s3= new AWS.S3();
const S3_BUCKET='testbucketforfevhub' //name of the bucket

module.exports={s3,S3_BUCKET};
