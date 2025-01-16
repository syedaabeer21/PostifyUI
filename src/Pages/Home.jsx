import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BiLike, BiCommentDetail } from "react-icons/bi";
import { FaUser } from "react-icons/fa";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [likedUsers, setLikedUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const content = useRef();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/post');
            console.log(response)
            const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const addPost = async (event) => {
        event.preventDefault();
        if (!token) return showAlert("Please log in to add a post.", "alert-error");

        const storedUsername = localStorage.getItem('username') || "Unknown User";
        try {
            const response = await axios.post('http://localhost:3000/api/v1/post',
                { content: content.current.value},
                { headers: { Authorization: `Bearer ${token}` } }
            );
                // Add the stored username directly to the new post object
                const newPost = { ...response.data, user: { username: storedUsername } };
                content.current.value = "";
                //setPosts([response.data, ...posts]);
                setPosts([newPost, ...posts]);
                showAlert("Post added successfully!", "alert-success");
        } catch (error) {
            console.error(error);
        }
    };

    const likePost = async (postId) => {
        if (!token) return showAlert("Please log in to like a post.", "alert-error");
        try {
            await axios.post('http://localhost:3000/api/v1/like',
                { postId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts(posts.map(post =>
                post._id === postId ? { ...post, likes: [...post.likes, token] } : post));
            showAlert("Post liked successfully!", "alert-info");
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const fetchLikedUsers = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/likes/${postId}`);
            setLikedUsers(response.data.users);
            setIsLikeModalOpen(true);
        } catch (error) {
            console.error("Error fetching liked users:", error);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/comments/${postId}`);
            setComments(response.data.comments);
            setIsCommentModalOpen(true);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const addComment = async (postId, commentText) => {
        if (!token) return showAlert("Please log in to add a comment.", "alert-error");
        try {
            const response = await axios.post('http://localhost:3000/api/v1/comment',
                { postId, text: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts(posts.map(post =>
                post._id === postId ? { ...post, comments: [...post.comments, response.data] } : post));
            showAlert("Comment added successfully!", "alert-success");
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const showAlert = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => setAlertMessage(''), 3000);
    };

    return (
        <div className='bg-gradient-to-br from-blue-900 relative top-20 p-6  to-black text-white '>
        <div className="  container mx-auto p-6 max-w-2xl rounded-lg shadow-lg  bg-gradient-to-br from-blue-900 to-black  text-white">
            <h1 className='text-xl font-semibold mb-2 p-2'>Create A Post</h1>
            {/* Add Post Form */}
            <form onSubmit={addPost} className="mb-6 bg-white p-6  rounded-lg shadow-lg text-black">
                <input
                    ref={content}
                    type="text"
                    placeholder="What's on your mind?"
                    className="textarea w-full p-4 rounded-lg border border-blue-600 focus:ring-2 focus:ring-blue-500 mb-7"
                    required
                />
                <button className="btn w-full bg-blue-700 text-white hover:bg-blue-800 rounded-lg transition duration-300">Post</button>
            </form>

            {/* Alert Message */}
            {alertMessage && (
                <div className={`fixed bottom-8 z-10 left-1/2 transform -translate-x-1/2 p-4 rounded-lg text-white ${alertType === "alert-error" ? 'bg-red-600'  : 'bg-blue-600'}`}>
                    {alertMessage}
                </div>
            )}

            {Array.isArray(posts) && posts.map((post) => (
    <div 
        key={post._id} 
        className="bg-white text-black p-6 rounded-xl shadow-xl mb-8 border border-gray-300 transition-transform transform hover:scale-[1.02] duration-300"
    >
        {/* Post Header (Username & Time) */}
        <div className="flex justify-between items-center mb-4">
           <div className='flex items-center gap-1'><p className='text-gray-500'>Posted By :</p> <p className="text-blue-700 font-semibold text-md">{post.user?.username || 'Unknown User'}</p></div>
            <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
        </div>

        {/* Post Content */}
        <p className="text-lg font-semibold mb-4">{post.content}</p>

        {/* Post Actions (Like & Comment) */}
        <div className="flex justify-between items-center border-t pt-4">
            {/* Like Section */}
            <div className="flex items-center space-x-3">
                <BiLike 
                    className="cursor-pointer text-2xl text-blue-600 hover:text-blue-700 transition duration-300" 
                    onClick={() => likePost(post._id)} 
                />
                <button 
                    onClick={() => fetchLikedUsers(post._id)} 
                    className="text-blue-600 hover:underline font-semibold"
                >
                    {post.likes.length} Likes
                </button>
            </div>

            {/* Comment Section */}
            <div className="flex items-center space-x-3">
                <BiCommentDetail 
                    className="cursor-pointer text-2xl text-gray-600 hover:text-gray-700 transition duration-300" 
                    onClick={() => fetchComments(post._id)} 
                />
                <button 
                    onClick={() => fetchComments(post._id)} 
                    className="text-gray-600 hover:underline font-semibold"
                >
                    {post.comments.length} Comments
                </button>
            </div>
        </div>

        {/* Comment Form */}
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const commentText = e.target.commentText.value;
                addComment(post._id, commentText);
                e.target.reset();
            }}
            className="mt-4 space-y-2"
        >
            <input
                type="text"
                name="commentText"
                placeholder="Write a comment..."
                className="input input-bordered w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
            />
            <button 
                className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300"
            >
                Add Comment
            </button>
        </form>
    </div>
))}

            {/* Likes Modal */}
            {isLikeModalOpen && (
                <Modal title="Liked Users" onClose={() => setIsLikeModalOpen(false)}>
                    <ul>
                        {likedUsers.map((user, index) => (
                            <li key={index}>{user.username}</li>
                        ))}
                    </ul>
                </Modal>
            )}

            {/* Comments Modal */}
            {isCommentModalOpen && (
                <Modal title="Comments" onClose={() => setIsCommentModalOpen(false)}>
                    <ul>
                        {comments.map((comment, index) => (
                            <li key={index} className="p-2 border-b">
                                <strong>{comment.user.username}:</strong> {comment.text}
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}
        </div>
        </div>
    );
};

// Reusable Modal Component
const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
            <button onClick={onClose} className="btn mt-4 w-full bg-blue-600 text-white hover:bg-blue-700">Close</button>
        </div>
    </div>
);

export default Home;
