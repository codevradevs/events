import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories] = useState(['Travel', 'Events', 'Flights', 'Things to do']);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, [activeCategory]);

  const fetchBlogPosts = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/blog${activeCategory ? `?category=${activeCategory}` : ''}`);
      setPosts(data);
    } catch (error) {
      // Mock data for demo
      setPosts([
        {
          _id: '1',
          title: 'Ultimate Safari Guide: What to Pack for Your Kenyan Adventure',
          excerpt: 'Planning a safari? Here\'s everything you need to know about packing for the perfect wildlife experience.',
          category: 'Travel',
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400',
          author: 'Travel Team',
          date: '2024-01-15'
        },
        {
          _id: '2',
          title: 'Top 10 Music Festivals in East Africa This Year',
          excerpt: 'From Nairobi to Kampala, discover the hottest music festivals happening across East Africa.',
          category: 'Events',
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
          author: 'Events Team',
          date: '2024-01-10'
        },
        {
          _id: '3',
          title: 'Flight Booking Hacks: Save Money on Your Next Trip',
          excerpt: 'Learn insider tips to find the best flight deals and save hundreds on your travel budget.',
          category: 'Flights',
          image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
          author: 'Travel Team',
          date: '2024-01-08'
        }
      ]);
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>📝 Travel Blog</h1>
        <p className="text-muted">Travel tips, event guides, and lifestyle inspiration</p>
      </div>

      {/* Categories */}
      <div className="mb-xl">
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
          <button
            className={!activeCategory ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveCategory('')}
          >
            All Posts
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={activeCategory === category ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-xl)' }}>
        {posts.map(post => (
          <article key={post._id} className="card p-0" style={{ overflow: 'hidden', cursor: 'pointer' }}>
            <img 
              src={post.image} 
              alt={post.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div className="p-xl">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                <span className="text-orange text-sm font-medium">{post.category}</span>
                <span className="text-muted text-xs">{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <h3 className="mb-sm">{post.title}</h3>
              <p className="text-muted mb-md">{post.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-sm text-muted">By {post.author}</span>
                <button className="btn-secondary text-sm">Read More</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;