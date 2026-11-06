const {
  S3Client,
  ListBucketsCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();

const S3_BUCKET = process.env.S3_BUCKET || "storage-user-service";
const S3_ENDPOINT = process.env.S3_ENDPOINT || "http://geosandbox_storage:9000";

const rustfsClient = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function ensureBucketExists(bucketName = S3_BUCKET) {
  try {
    await rustfsClient.send(new HeadBucketCommand({ Bucket: bucketName }));
  } catch (err) {
    const statusCode = err?.$metadata?.httpStatusCode;
    if (statusCode === 404 || err.name === "NotFound" || err.name === "NoSuchBucket") {
      await rustfsClient.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`RustFS: Bucket '${bucketName}' created.`);
    }
  }
}

async function connectionStorageS3() {
  try {
    await rustfsClient.send(new ListBucketsCommand({}));
    await ensureBucketExists(S3_BUCKET);
    console.log("RustFS: Connected successfully!");
  } catch (error) {
    console.error(`RustFS Error: ${error.message}`);
  }
}

connectionStorageS3();

module.exports = {
  rustfsClient,
  connectionStorageS3,
  ensureBucketExists,
  S3_BUCKET,
  S3_ENDPOINT,
  PutObjectCommand,
  DeleteObjectCommand,
};

