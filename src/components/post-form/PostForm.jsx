import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/Configure";

export default function PostForm({ post }) {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        setLoading(true);
        
        try {
            if (post) {
                // Updating existing post
                let file = null;
                
                if (data.image[0]) {
                    file = await appwriteService.uploadFile(data.image[0]);
                    
                    if (file && post.featuredImage) {
                        await appwriteService.deleteFile(post.featuredImage);
                    }
                }

                const updateData = {
                    title: data.title,
                    content: data.content,
                    status: data.status,
                    ...(file && { featuredImage: file.$id })
                };
                
                const dbPost = await appwriteService.updatePost(post.$id, updateData);

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // Creating new post
                if (!data.image || !data.image[0]) {
                    alert("Please select an image for your blog post");
                    return;
                }
                
                const file = await appwriteService.uploadFile(data.image[0]);

                if (file && file.$id) {
                    const postData = {
                        title: data.title,
                        slug: data.slug,
                        content: data.content,
                        featuredImage: file.$id,
                        status: data.status,
                        userId: userData.$id
                    };
                    
                    const dbPost = await appwriteService.createPost(postData);

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    } else {
                        alert("Failed to create post. Please try again.");
                    }
                } else {
                    alert("Failed to upload image. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error in submit function:", error);
            alert(`Error: ${error.message || 'Something went wrong'}`);
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // File size check
            if (file.size > 5 * 1024 * 1024) {
                alert("File too large. Please select a file smaller than 5MB.");
                e.target.value = '';
                return;
            }
            
            // File type check
            const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert("Invalid file type. Please select PNG, JPG, JPEG, or GIF.");
                e.target.value = '';
                return;
            }

            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {post ? "Edit Post" : "Create New Post"}
                    </h1>
                    <p className="text-gray-600">
                        {post ? "Update your story" : "Share your thoughts with the world"}
                    </p>
                </div>

                <form onSubmit={handleSubmit(submit)} className="grid lg:grid-cols-3 gap-8">
                    {/* Main content area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic info */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4">Post Details</h3>
                            
                            <div className="space-y-4">
                                <Input
                                    label="Title"
                                    placeholder="Enter your post title..."
                                    {...register("title", { 
                                        required: "Title is required",
                                        minLength: {
                                            value: 5,
                                            message: "Title must be at least 5 characters"
                                        }
                                    })}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                                )}
                                
                                <Input
                                    label="Slug (URL)"
                                    placeholder="your-post-url"
                                    {...register("slug", { required: "Slug is required" })}
                                    onInput={(e) => {
                                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                    }}
                                />
                                {errors.slug && (
                                    <p className="text-red-500 text-sm">{errors.slug.message}</p>
                                )}
                                <p className="text-gray-500 text-sm">This will be your post's URL</p>
                            </div>
                        </div>

                        {/* Content editor */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4">Content</h3>
                            <RTE 
                                label="Write your story" 
                                name="content" 
                                control={control} 
                                defaultValue={getValues("content")} 
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Featured image */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4">Featured Image</h3>
                            
                            <Input
                                label="Upload Image"
                                type="file"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                className="mb-4"
                                {...register("image", { required: !post && "Please select an image" })}
                                onChange={(e) => {
                                    handleFileChange(e);
                                    const { onChange } = register("image", { required: !post });
                                    onChange(e);
                                }}
                            />
                            
                            {errors.image && (
                                <p className="text-red-500 text-sm mb-4">{errors.image.message}</p>
                            )}

                            {/* Preview */}
                            {(imagePreview || post) && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                    <img
                                        src={imagePreview || (post && appwriteService.getFileView(post.featuredImage))}
                                        alt="Preview"
                                        className="w-full h-40 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Post settings */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4">Settings</h3>
                            
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: "Please select a status" }}
                                render={({ field }) => (
                                    <div>
                                        <Select
                                            options={["active", "inactive"]}
                                            label="Status"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        {errors.status && (
                                            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                                        )}
                                    </div>
                                )}
                            />

                            <div className="mt-4 bg-gray-50 rounded p-3 text-sm text-gray-600">
                                <p className="font-medium">Status Info:</p>
                                <p>• Active: Visible to everyone</p>
                                <p>• Inactive: Hidden from public</p>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button 
                            type="submit" 
                            disabled={loading}
                            bgColor={post ? "bg-green-600" : "bg-blue-600"}
                            className={`w-full py-3 font-semibold ${loading ? 'opacity-50' : 'hover:opacity-90'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    {post ? "Updating..." : "Publishing..."}
                                </span>
                            ) : (
                                post ? "Update Post" : "Publish Post"
                            )}
                        </Button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}