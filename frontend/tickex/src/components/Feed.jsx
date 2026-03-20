import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import AdCard from './AdCard';
import { AuthContext } from '../context/AuthContext';

export default function Feed() {
  const [items, setItems] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const nextCursor = useRef(null);
  const { user } = useContext(AuthContext);

  const load = async () => {
    setLoading(true);
    const res = await axios.get('http://localhost:5000/api/feed', { params: { cursor: nextCursor.current } });
    setItems(i => [...i, ...res.data.data]);
    nextCursor.current = res.data.nextCursor;
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (user?.subscription?.tier === 'free') {
      axios.get('http://localhost:5000/api/ads?placement=feed').then(r => setAds(r.data));
    }
  }, []);
  
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !loading) load();
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading]);

  return (
    <div>
      {items.map((it, i) => (
        <React.Fragment key={it._id}>
          <div className="card">
            {it.featured?.isFeatured && <span className="featured-badge">🔥 Featured</span>}
            <img src={it.posterUrl} alt="" style={{ width: '100%' }} />
            <h3>{it.title}</h3>
            <p>{it.description}</p>
            <button>Buy Ticket</button>
          </div>
          {i % 5 === 0 && ads[i % ads.length] && user?.subscription?.tier === 'free' && (
            <AdCard data={ads[i % ads.length]} />
          )}
        </React.Fragment>
      ))}
      {loading && <div>loading more...</div>}
    </div>
  );
}
