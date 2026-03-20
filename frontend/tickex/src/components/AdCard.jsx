import React from 'react';
import axios from 'axios';

export default function AdCard({ data }) {
  const handleClick = () => {
    axios.post(`http://localhost:5000/api/ads/${data._id}/click`);
    window.open(data.link, '_blank');
  };

  React.useEffect(() => {
    axios.post(`http://localhost:5000/api/ads/${data._id}/impression`);
  }, [data._id]);

  return (
    <div className="ad-card" onClick={handleClick}>
      <span className="ad-badge">Ad</span>
      <img src={data.mediaUrl} alt="Advertisement" />
    </div>
  );
}
