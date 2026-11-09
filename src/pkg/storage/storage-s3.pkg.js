const multer = require("multer");
const path = require("path");
const {
    rustfsClient,
    ensureBucketExists,
    S3_BUCKET,
    S3_ENDPOINT,
    PutObjectCommand,
    DeleteObjectCommand,
} = require("../../config/storage-s3.config");

const extractObjectKey = (linkPict) => {
    if (!linkPict || typeof linkPict !== "string") return null;
    const bucketPrefix = `/${S3_BUCKET}/`;
    const idx = linkPict.indexOf(bucketPrefix);
    if (idx !== -1) {
        return linkPict.substring(idx + bucketPrefix.length);
    }
    return linkPict;
};

const removePicsFileFromS3 = async (linkPict) => {
    const oldKey = extractObjectKey(linkPict);
    if (!oldKey) return;
    try {
        await rustfsClient.send(
            new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: oldKey,
            }),
        );
    } catch (err) {
        console.warn(`[RustFS] Gagal menghapus file lama (${oldKey}): ${err.message}`);
    }
};

const removeCoverPicsFileFromS3 = async (linkCoverPict) => {
    const oldKey = extractObjectKey(linkCoverPict)
    if (!oldKey) return;
    try {
        await rustfsClient.send(
            new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: oldKey,
            }),
        );
    } catch (err) {
        console.warn(`[RustFS] Gagal menghapus file lama (${oldKey}): ${err.message}`);
    }
}

const uploadProfileBufferToS3 = async (uuid, file) => {
    if (!file || !file.buffer) {
        throw new Error("File gambar tidak ditemukan");
    }

    await ensureBucketExists(S3_BUCKET);

    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const objectKey = `profile-pictures/${uuid}-${Date.now()}${ext}`;

    await rustfsClient.send(
        new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: objectKey,
            Body: file.buffer,
            ContentType: file.mimetype || "image/jpeg",
        }),
    );

    const cleanEndpoint = S3_ENDPOINT.replace(/\/$/, "");
    const fileUrl = `${cleanEndpoint}/${S3_BUCKET}/${objectKey}`;
    return { objectKey, fileUrl };
};

const uploadCoverProfileBufferToS3 = async (uuid, file) => {
    if (!file || !file.buffer) {
        throw new Error("File gambar tidak ditemukan");
    }

    await ensureBucketExists(S3_BUCKET);

    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const objectKey = `cover-profile-pictures/${uuid}-${Date.now()}${ext}`;

    await rustfsClient.send(
        new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: objectKey,
            Body: file.buffer,
            ContentType: file.mimetype || "image/jpeg",
        }),
    );

    const cleanEndpoint = S3_ENDPOINT.replace(/\/$/, "");
    const fileUrl = `${cleanEndpoint}/${S3_BUCKET}/${objectKey}`;
    return { objectKey, fileUrl };
    ;
}

const getUploadedFile = (req) => {
    if (req.file) return req.file;
    if (Array.isArray(req.files) && req.files.length > 0) {
        return req.files[0];
    }
    if (req.files && typeof req.files === "object") {
        for (const key of Object.keys(req.files)) {
            if (Array.isArray(req.files[key]) && req.files[key].length > 0) {
                return req.files[key][0];
            }
        }
    }
    return null;
};

const maxUploadFile = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { removePicsFileFromS3, removeCoverPicsFileFromS3, uploadProfileBufferToS3, uploadCoverProfileBufferToS3, getUploadedFile, maxUploadFile }