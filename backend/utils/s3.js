const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const bucketName = process.env.DO_SPACE_NAME;

const s3 = new AWS.S3({
  endpoint: `https://${process.env.DO_SPACE_REGION}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY,
    secretAccessKey: process.env.DO_SECRET_KEY,
  },
  region: process.env.DO_SPACE_REGION,
  s3ForcePathStyle: true,
});

// ✅ Upload file from Multer memory (req.file)
const uploadFileToS3 = async (file, folder = "uploads") => {
  const {buffer} = file;
  const {mimetype} = file;
  const filename = file.originalname;

  const key = `${folder}/${Date.now()}-${uuidv4()}-${filename}`;

  const result = await s3
    .upload({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      ACL: "public-read",
    })
    .promise();

  return result.Key.split("/").pop(); // store only filename
};

const deleteFileFromS3 = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  await s3.deleteObject(params).promise();
};

module.exports = {
  uploadFileToS3,
  deleteFileFromS3,
};
