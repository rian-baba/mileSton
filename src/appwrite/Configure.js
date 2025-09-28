import { Client, Databases, ID, Query, Storage } from "appwrite";
import conf from "../config/config";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        console.log("Appwrite configuration:", {
            endpoint: conf.appWriteUrl,
            projectId: conf.appWriteProjectId,
            databaseId: conf.appWriteDatabaseId,
            collectionId: conf.appWriteCollectionId,
            bucketId: conf.appwriteBucketId
        });

        this.client
            .setEndpoint(conf.appWriteUrl)
            .setProject(conf.appWriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // Create Post
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            console.log("Creating post with data:", { title, slug, content, featuredImage, status, userId });
            
            const result = await this.databases.createDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            );
            
            console.log("Post created successfully:", result);
            return result;
        } catch (error) {
            console.error("Service :: createPost :: error", error);
            throw error;
        }
    }

    // Update Post
    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            console.log("Updating post:", slug, { title, content, featuredImage, status });
            
            const updateData = {
                title,
                content,
                status,
            };
            
            if (featuredImage) {
                updateData.featuredImage = featuredImage;
            }
            
            const result = await this.databases.updateDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                slug,
                updateData
            );
            
            console.log("Post updated successfully:", result);
            return result;
        } catch (error) {
            console.error("Service :: updatePost :: error", error);
            throw error;
        }
    }

    // Delete Post
    async deletePost(slug) {
        try {
            console.log("Deleting post:", slug);
            
            await this.databases.deleteDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                slug
            );
            
            console.log("Post deleted successfully");
            return true;
        } catch (error) {
            console.error("Service :: deletePost :: error", error);
            return false;
        }
    }

    // Get Single Post
    async getPost(slug) {
        try {
            console.log("Fetching post:", slug);
            
            const result = await this.databases.getDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                slug
            );
            
            console.log("Post fetched successfully:", result);
            return result;
        } catch (error) {
            console.error("Service :: getPost :: error", error);
            return false;
        }
    }

    // Get All Posts
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            console.log("Fetching posts with queries:", queries);
            
            const result = await this.databases.listDocuments(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                queries
            );
            
            console.log("Posts fetched successfully:", result);
            return result;
        } catch (error) {
            console.error("Service :: getPosts :: error", error);
            return false;
        }
    }

    // File Upload
    async uploadFile(file) {
        try {
            console.log("Starting file upload...");
            console.log("File details:", {
                name: file.name,
                size: file.size,
                type: file.type
            });

            const result = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );

            console.log("File uploaded successfully:", result);
            return result;
        } catch (error) {
            console.error("Service :: uploadFile :: error", error);
            throw error;
        }
    }

    // File Delete
    async deleteFile(fileId) {
        try {
            console.log("Deleting file:", fileId);
            
            if (!fileId) {
                console.warn("No fileId provided for deletion");
                return false;
            }
            
            const result = await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            
            console.log("File deleted successfully:", result);
            return result;
        } catch (error) {
            console.error("Service :: deleteFile :: error", error);
            return false;
        }
    }

    // IMPORTANT: Direct File URL instead of Preview
    getFileView(fileId) {
        try {
            console.log("Getting direct file URL for:", fileId);
            
            if (!fileId) {
                console.error("No fileId provided");
                return null;
            }
            
            // Direct file view URL (no transformations)
            const fileUrl = this.bucket.getFileView(conf.appwriteBucketId, fileId);
            console.log("Direct file URL:", fileUrl);
            
            return fileUrl;
        } catch (error) {
            console.error("Service :: getFileView :: error", error);
            return null;
        }
    }

    // Keep preview method for fallback but expect it to fail on free plan
    getFilePreview(fileId) {
        try {
            console.log("Getting file preview for:", fileId);
            
            if (!fileId) {
                console.error("No fileId provided for preview");
                return null;
            }
            
            // This will fail on free plan with transformations blocked error
            const previewUrl = this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
            console.log("Preview URL:", previewUrl);
            
            return previewUrl;
        } catch (error) {
            console.error("Service :: getFilePreview :: error", error);
            return null;
        }
    }

    // Download URL (alternative method)
    getFileDownload(fileId) {
        try {
            console.log("Getting file download URL for:", fileId);
            
            if (!fileId) {
                console.error("No fileId provided");
                return null;
            }
            
            const downloadUrl = this.bucket.getFileDownload(conf.appwriteBucketId, fileId);
            console.log("Download URL:", downloadUrl);
            
            return downloadUrl;
        } catch (error) {
            console.error("Service :: getFileDownload :: error", error);
            return null;
        }
    }
}

const service = new Service();
export default service;