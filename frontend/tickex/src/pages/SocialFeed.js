import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';

const SocialFeed = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    fetchFeed();
    fetchFollowing();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newFeedPost', (post) => {
        setPosts(prev => [post, ...prev]);
      });

      return () => {
        socket.off('newFeedPost');
      };
    }
  }, [socket]);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/feed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      setPosts([]);
    }
  };

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/users/following', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowing(data);
    } catch (error) {
      console.error('Failed to fetch following:', error);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/feed/post', {
        content: newPost
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts(prev => [data, ...prev]);
      setNewPost('');

      if (socket) {
        socket.emit('newFeedPost', data);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const likePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/feed/post/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: post.likes.includes(user._id) 
                ? post.likes.filter(id => id !== user._id)
                : [...post.likes, user._id]
            }
          : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };



  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>📱 Social Feed</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--spacing-xl)' }}>
        {/* Main Feed */}
        <div>
          {/* Create Post */}
          <div className="card mb-xl">
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--bg-primary)',
                fontWeight: 'bold'
              }}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  placeholder="What's happening in the events world?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                  style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
                />
                <button className="btn-primary" onClick={createPost}>
                  📝 Post
                </button>
              </div>
            </div>
          </div>

          {/* Posts */}
          {Array.isArray(posts) && posts.map(post => (
            <div key={post._id} className="card mb-lg">
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bg-primary)',
                  fontWeight: 'bold'
                }}>
                  {post.author.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                    <span 
                      className="font-medium cursor-pointer"
                      onClick={() => navigate(`/organizer/${post.author._id}`)}
                    >
                      {post.author.username}
                    </span>
                    {post.author.verified && (
                      <span style={{ color: 'var(--primary-color)' }}>✓</span>
                    )}
                    <span className="text-muted text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mb-md">{post.content}</p>
                  
                  {post.sharedEvent && (
                    <div 
                      className="bg-tertiary p-md rounded-lg mb-md cursor-pointer"
                      onClick={() => navigate(`/event/${post.sharedEvent._id}`)}
                    >
                      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <img 
                          src={post.sharedEvent.posterUrl} 
                          alt={post.sharedEvent.title}
                          style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 className="mb-xs">{post.sharedEvent.title}</h4>
                          <p className="text-muted text-sm">{post.sharedEvent.venue}</p>
                          <p className="text-orange text-sm">{new Date(post.sharedEvent.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => likePost(post._id)}
                      style={{ 
                        color: post.likes.includes(user._id) ? 'var(--primary-color)' : 'inherit',
                        fontSize: 'var(--font-sm)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)'
                      }}
                    >
                      ❤️ {post.likes.length}
                    </button>
                    <button 
                      className="btn-secondary"
                      style={{ fontSize: 'var(--font-sm)', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                    >
                      💬 {post.comments?.length || 0}
                    </button>
                    <button 
                      className="btn-secondary"
                      style={{ fontSize: 'var(--font-sm)', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                    >
                      📤 Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div>
          {/* Following */}
          <div className="card mb-lg">
            <h3 className="mb-md">👥 Following</h3>
            {following.length === 0 ? (
              <p className="text-muted text-sm">You're not following anyone yet</p>
            ) : (
              following.slice(0, 5).map(organizer => (
                <div 
                  key={organizer._id}
                  className="mb-sm cursor-pointer"
                  onClick={() => navigate(`/organizer/${organizer._id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'var(--primary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--bg-primary)',
                      fontSize: 'var(--font-sm)',
                      fontWeight: 'bold'
                    }}>
                      {organizer.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm">{organizer.username}</span>
                    {organizer.verified && (
                      <span style={{ color: 'var(--primary-color)' }}>✓</span>
                    )}
                  </div>
                </div>
              ))
            )}
            {following.length > 5 && (
              <button className="btn-secondary text-sm mt-sm">
                View All ({following.length})
              </button>
            )}
          </div>

          {/* Trending Topics */}
          <div className="card">
            <h3 className="mb-md">🔥 Trending</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {['#MusicFestival', '#TechConference', '#FoodFair', '#ArtExhibition'].map(tag => (
                <div key={tag} className="text-sm cursor-pointer text-orange">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;