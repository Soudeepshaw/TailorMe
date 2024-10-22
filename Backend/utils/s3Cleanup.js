const { S3Client, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require('../config/s3Config');

exports.cleanupOldImages = async () => {
  const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
  const oldDate = new Date(Date.now() - TWO_WEEKS);

  const listParams = {
    Bucket: process.env.S3_BUCKET_NAME,
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(listParams));
    const deletePromises = data.Contents
      .filter(object => object.LastModified < oldDate)
      .map(object => {
        const deleteParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: object.Key,
        };
        return s3Client.send(new DeleteObjectCommand(deleteParams));
      });

    await Promise.all(deletePromises);
    console.log('Old images cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up old images:', error);
  }
};
