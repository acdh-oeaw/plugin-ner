import { createClient } from "@supabase/supabase-js";
import { task, logger } from "@trigger.dev/sdk/v3";
import * as tus from "tus-js-client";
const supabaseServerUrl = process.env.SUPABASE_PUBLIC_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
export const uploadDocumentToRS = task({
    id: "upload-document-to-rs",
    run: async (payload, { ctx }) => {
        const { documentData, name, type } = payload;
        const supabase = createClient(supabaseServerUrl, supabaseServiceKey);
        const uploadFile = async (file, name, type, onProgress) => {
            return new Promise((resolve, reject) => {
                // @ts-ignore
                const upload = new tus.Upload(file, {
                    endpoint: `${supabaseServerUrl}/storage/v1/upload/resumable`,
                    retryDelays: [0, 3000, 5000, 10000, 20000],
                    headers: {
                        authorization: `Bearer ${supabaseServiceKey}`,
                        "x-upsert": "true", // optionally set upsert to true to overwrite existing files
                    },
                    uploadDataDuringCreation: true,
                    removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
                    metadata: {
                        bucketName: "documents",
                        objectName: name,
                        contentType: type,
                        cacheControl: "3600",
                    },
                    chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
                    onError: function (error) {
                        logger.log("Failed because: " + error);
                        reject(error);
                    },
                    onProgress: function (bytesUploaded, bytesTotal) {
                        onProgress((bytesUploaded / bytesTotal) * 100);
                    },
                    onSuccess: function () {
                        resolve();
                    },
                });
                // Check if there are any previous uploads to continue.
                return upload
                    .findPreviousUploads()
                    .then(function (previousUploads) {
                    // Found previous uploads so we select the first one.
                    if (previousUploads.length) {
                        upload.resumeFromPreviousUpload(previousUploads[0]);
                    }
                    // Start the upload
                    upload.start();
                });
            });
        };
        const result = await supabase
            .from("documents")
            .insert({
            name: name,
            content_type: type,
            bucket_id: "documents",
            meta_data: {},
        })
            .select()
            .single();
        if (result.error) {
            logger.error(`Failed to create Recogito Studio document: ${JSON.stringify(result.error, null, 2)}`);
            return false;
        }
        const onProgress = (progress) => {
            logger.log(`Upload Progress: ${progress}%`);
        };
        const blob = new Blob([documentData], { type: type });
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await uploadFile(buffer, result.data.id, type, onProgress);
    },
});
