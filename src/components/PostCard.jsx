import React, { useState } from 'react';
import appwriteService from "../appwrite/Configure";
import { Link } from 'react-router-dom';

function PostCard({ $id, title, featuredImage }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    console.log("PostCard props:", { $id, title, featuredImage });
    
    const handleImageLoad = () => {
        console.log(" Image loaded successfully for post:", $id);
        setImageLoading(false);
    };

    const handleImageError = (error) => {
        console.error(" Image load error for post:", $id, error);
        setImageError(true);
        setImageLoading(false);
    };

    // Try different URL methods
    const getImageUrl = (fileId) => {
        if (!fileId) return null;
        
        // Primary: Direct file view (works on free plan)
        try {
            return appwriteService.getFileView(fileId);
        } catch (error) {
            console.log("getFileView failed, trying download URL");
            // Fallback: Download URL
            try {
                return appwriteService.getFileDownload(fileId);
            } catch (downloadError) {
                console.error("All URL methods failed");
                return null;
            }
        }
    };

    const imageUrl = getImageUrl(featuredImage);
    console.log("Generated image URL:", imageUrl);

    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300'>
                <div className='w-full justify-center mb-4 relative'>
                    {imageLoading && !imageError && (
                        <div className="w-full h-48 bg-gray-300 animate-pulse rounded-xl flex items-center justify-center">
                            <span className="text-gray-500">Loading image...</span>
                        </div>
                    )}

                    {imageError ? (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex flex-col items-center justify-center border-2 border-gray-400">
                            <div className="text-6xl mb-2">🖼️</div>
                            <span className="text-gray-600 text-sm font-medium">Image not available</span>
                            <span className="text-xs text-gray-500 mt-1">Free plan limitations</span>
                        </div>
                    ) : (
                        featuredImage && imageUrl && (
                            <img 
                                src={imageUrl} 
                                alt={title}
                                className={`rounded-xl w-full h-48 object-cover transition-opacity duration-300 ${
                                    imageLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                style={{ display: imageLoading ? 'none' : 'block' }}
                            />
                        )
                    )}

                    {!featuredImage && (
                        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex flex-col items-center justify-center">
                            <div className="text-5xl mb-2">📝</div>
                            <span className="text-gray-600 font-medium">No image</span>
                        </div>
                    )}
                </div>
                
                <h2 className='text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2'>
                    {title}
                </h2>
            </div>
        </Link>
    );
}

export default PostCard;