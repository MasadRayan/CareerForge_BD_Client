import React from 'react';

const AboutUs = () => {
  
  const sectionStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    minHeight: '100vh'
  };

  
  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
    marginTop: '40px'
  };

  
  const cardStyle = {
    width: '100%',
    maxWidth: '400px', 
    padding: '40px 20px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    textAlign: 'center'
  };

  const socialBtnStyle = {
    display: 'inline-block',
    margin: '5px',
    padding: '8px 16px',
    background: '#27272a',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.9rem'
  };

  
  const teamMembers = [
    {
      name: "Shoriful hoque Nobin",
      role: "AI & Full-Stack Developer",
      bio: "Building, deploying, and scaling highly engineered AI and web systems.",
      image: "/dp_nobin.jpg",
      links: {
        linkedin: "https://www.linkedin.com/in/nobin",
        x: "https://x.com/nobin",
        facebook: "https://facebook.com/nobin",
        whatsapp: "https://whatsapp.com/channel/..."
      }
    },
    {
      name: "Masad Rayran",
      role: "Software Engineer",
      bio: "Passionate about creating scalable and efficient applications.",
      image: "/dp_masad.jpg",
      links: {
        linkedin: "https://www.linkedin.com/in/masad",
        x: "https://x.com/masad",
        facebook: "https://facebook.com/masad",
        whatsapp: "https://whatsapp.com/channel/..."
      }
    },
    {
      name: "Sakawat Hossien",
      role: "System Designer",
      bio: "Designing intuitive, secure, and visually stunning user experiences.",
      image: "/dp_sakawat.jpg",
      links: {
        linkedin: "https://www.linkedin.com/in/sakawat",
        x: "https://x.com/sakawat",
        facebook: "https://facebook.com/sakawat",
        whatsapp: "https://whatsapp.com/channel/..."
      }
    }
  ];

  return (
    <div style={sectionStyle}>
      <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '10px' }}>About Us</h2>
      <p style={{ color: '#a1a1aa', fontSize: '1.2rem' }}>Meet the team behind the platform.</p>

      <div style={gridStyle}>
        {teamMembers.map((member, index) => (
          <div key={index} style={cardStyle}>
            <img
              src={member.image}
              alt={member.name}
              style={{ 
                width: '150px', 
                height: '150px', 
                borderRadius: '50%', 
                objectFit: 'cover', 
                border: '4px solid #f97316', 
                marginBottom: '20px', 
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)' 
              }}
            />
            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '5px' }}>{member.name}</h3>
            <h4 style={{ fontSize: '1.1rem', color: '#f97316', marginBottom: '15px', fontWeight: 'normal' }}>{member.role}</h4>
            
            <p style={{ color: '#a1a1aa', fontSize: '1rem', lineHeight: '1.6', marginBottom: '25px' }}>
              {member.bio}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
              <a href={member.links.linkedin} target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6', color: '#3b82f6' }}>💼 LinkedIn</a>
              <a href={member.links.x} target="_blank" rel="noreferrer" style={socialBtnStyle}>✖️ X</a>
              <a href={member.links.facebook} target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: 'rgba(24, 119, 242, 0.2)', borderColor: '#1877f2', color: '#1877f2' }}>📘 Facebook</a>
              <a href={member.links.whatsapp} target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981', color: '#10b981' }}>💬 WhatsApp</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;