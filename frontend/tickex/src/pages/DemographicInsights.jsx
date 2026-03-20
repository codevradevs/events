import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function DemographicInsights() {
  const { eventId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/analytics/event/${eventId}/demographics`)
      .then(r => setData(r.data));
  }, [eventId]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="demographics">
      <h1>Demographic Insights</h1>
      
      <section>
        <h2>Top Locations</h2>
        {data.locations.map(loc => (
          <div key={loc._id}>{loc._id}: {loc.count}</div>
        ))}
      </section>

      <section>
        <h2>Age Groups</h2>
        {data.ageGroups.map(age => (
          <div key={age._id}>{age._id}: {age.count}</div>
        ))}
      </section>

      <section>
        <h2>Gender Distribution</h2>
        {data.genderDist.map(g => (
          <div key={g._id}>{g._id}: {g.count}</div>
        ))}
      </section>
    </div>
  );
}
