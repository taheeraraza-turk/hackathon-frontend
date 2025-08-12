import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import '../styles/preview.css';
export default function Preview(){
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('token');
  useEffect(()=>{
    if (!token) { setProfile(null); return; }
    API.get('/profile/me', { headers: { Authorization: 'Bearer '+token } })
      .then(res=> setProfile(res.data))
      .catch(()=> setProfile(null));
  }, []);
  if (!profile) return <div><h2>Welcome to Portfolio Builder</h2><p>Create your profile to see a preview.</p></div>;

  return (
    <div className="profile-card">
      <h2>{profile.name || 'No name'}</h2>
      <p>{profile.email}</p>
      <div>
        <strong>Skills</strong>
        <div>{(profile.skills||[]).map((s,i)=><span key={i} className="skill">{s}</span>)}</div>
      </div>
      <div>
        <strong>Projects</strong>
        {(profile.projects||[]).map((p,i)=>(
          <div key={i} className="project">
            <h4>{p.title}</h4>
            <p>{p.description}</p>
            {p.link && <a href={p.link} target="_blank" rel="noreferrer">View</a>}
          </div>
        ))}
      </div>
      <strong>Github</strong>
      {profile.github && <p>Github: <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a></p>}
    </div>
  )
}
