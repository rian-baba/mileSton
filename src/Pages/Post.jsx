import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/Configure";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    console.log("Fetched post:", post);
                    setPost(post);
                } else {
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            appwriteService.deletePost(post.$id).then((status) => {
                if (status) {
                    appwriteService.deleteFile(post.featuredImage);
                    navigate("/");
                }
            });
        }
    };

    const handleImageLoad = () => {
        console.log("Image loaded successfully");
        setImageLoaded(true);
        setImageError(false);
    };

    const handleImageError = (event) => {
        console.error(" Image load failed");
        console.error("Image URL:", event.target.src);
        setImageError(true);
        setImageLoaded(false);
    };

    const getImageUrl = (fileId) => {
        if (!fileId) return null;
        try {
            return appwriteService.getFileView(fileId);
        } catch (error) {
            try {
                return appwriteService.getFileDownload(fileId);
            } catch {
                return null;
            }
        }
    };

    if (!post) {
        return (
            <div className="py-8">
                <Container>
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Loading post...</span>
                    </div>
                </Container>
            </div>
        );
    }

    const imageUrl = getImageUrl(post.featuredImage);

    return (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-6 relative border rounded-xl p-4 bg-white shadow-sm">
                    {post.featuredImage ? (
                        <div className="relative w-full max-w-4xl">
                            {!imageLoaded && !imageError && (
                                <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                        <span className="text-gray-600">Loading image...</span>
                                    </div>
                                </div>
                            )}

                            {imageError && (
                                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl flex flex-col items-center justify-center p-6">
                                    <div className="text-center max-w-md">
                                        <div className="text-6xl mb-4">🖼️</div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                            Image Preview Unavailable
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Image transformations are blocked on Appwrite free plan.
                                        </p>

                                        {imageUrl && (
                                            <a 
                                                href={imageUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm mt-3"
                                            >
                                                Download Original Image
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={post.title}
                                    className={`rounded-xl max-w-full h-auto transition-all duration-300 ${
                                        imageLoaded ? 'opacity-100' : 'opacity-0'
                                    } ${imageError ? 'hidden' : 'block'}`}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    style={{ 
                                        display: imageError ? 'none' : 'block',
                                        minHeight: imageLoaded ? 'auto' : '0'
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center">
                            <div className="text-6xl mb-3">📝</div>
                            <span className="text-gray-600 text-lg">No featured image</span>
                        </div>
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6 bg-white rounded-lg shadow-lg p-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500 hover:bg-green-600" className="mr-3 transition-colors">
                                    Edit
                                </Button>
                            </Link>
                            <Button 
                                bgColor="bg-red-500 hover:bg-red-600" 
                                onClick={deletePost}
                                className="transition-colors"
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="w-full mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                        {post.title}
                    </h1>
                    
                    {post.$createdAt && (
                        <div className="flex items-center text-gray-600 text-sm">
                            <span>Published on {new Date(post.$createdAt).toLocaleDateString()}</span>
                            {post.$updatedAt !== post.$createdAt && (
                                <span className="ml-4">• Updated on {new Date(post.$updatedAt).toLocaleDateString()}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-full prose prose-lg max-w-none">
                    <div className="browser-css">
                        {parse(post.content)}
                    </div>
                </div>

                 <div className="flex justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full shadow hover:from-blue-600 hover:to-indigo-700 transition-all"
                    >
                         Back Home
                    </Link>
                </div>
            </Container>
        </div>
    );
}
