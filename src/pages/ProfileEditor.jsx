import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import "../styles/editor.css"
function parseSkills(raw){ return raw.split(',').map(s=>s.trim()).filter(Boolean) }

export default function ProfileEditor(){
  const [profile,setProfile]=useState({ name:'', email:'', skills:[], projects:[], github:''});
  const [skillsText,setSkillsText]=useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  useEffect(()=>{ if (!token) { navigate('/login'); return; }
    API.get('/profile/me',{ headers: { Authorization: 'Bearer '+token } })
      .then(res=>{ if(res.data){ setProfile(res.data); setSkillsText((res.data.skills||[]).join(', ')) } })
      .catch(()=>{});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...profile, skills: parseSkills(skillsText) };
      await API.post('/profile', payload, { headers: { Authorization: 'Bearer '+token } });
      alert('Saved'); navigate('/');
    } catch (err) { alert(err.response?.data?.message || err.message) }
  }

  const addProject = ()=> {
    setProfile(p=> ({ ...p, projects: [...(p.projects||[]), { title:'', description:'', link:'' }] }));
  }
  const updateProject = (idx, key, value) => {
    const copy = [...profile.projects];
    copy[idx][key]=value;
    setProfile({...profile, projects: copy});
  }
  const removeProject = (idx) => { const copy = [...profile.projects]; copy.splice(idx,1); setProfile({...profile, projects: copy}); }

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={save}>
        <label>Name</label>
        <input value={profile.name||''} onChange={e=>setProfile({...profile, name:e.target.value})} />
        <label>GitHub Link</label>
        <input value={profile.github||''} onChange={e=>setProfile({...profile, github:e.target.value})} />
        <label>Skills (comma separated)</label>
        <input value={skillsText} onChange={e=>setSkillsText(e.target.value)} />
        <label>Projects</label>
        {(profile.projects||[]).map((pr, i)=>(
          <div key={i} className="project">
            <input placeholder="Title" value={pr.title} onChange={e=>updateProject(i,'title',e.target.value)} />
            <textarea placeholder="Description" value={pr.description} onChange={e=>updateProject(i,'description',e.target.value)} />
            <input placeholder="Link" value={pr.link} onChange={e=>updateProject(i,'link',e.target.value)} />
            <button type="button" onClick={()=>removeProject(i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addProject} className="full-width">Add Project</button>
        <div style={{marginTop:12}}>
          <button type="submit" className="full-width">Save Profile</button>
        </div>
      </form>
    </div>
  )
}
