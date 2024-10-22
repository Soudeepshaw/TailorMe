const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const uploadToS3 = (file, userId) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `profile-pictures/${userId}-${Date.now()}.jpg`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

module.exports = { s3, uploadToS3 };
