const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Configuration = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4",
  },
  region: "us-east-1",
};

const s3 = new S3Client(s3Configuration);

async function generateUploadURL(fileName) {
  const command = new PutObjectCommand({
    Bucket: "teamconnect-kltn",
    Key: `${fileName}`,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // expires in seconds
  return url;
}

async function generateDownloadFileURL(fileName) {
  const command = new GetObjectCommand({
    Bucket: "teamconnect-kltn",
    Key: `${fileName}`,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // expires in seconds
  return url;
}

module.exports = { generateUploadURL, generateDownloadFileURL };
