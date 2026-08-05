import React, { useState } from 'react';

const ContactUs = () => {
  // ফর্মের ডাটা সেভ রাখার জন্য State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // ইনপুট পরিবর্তনের ফাংশন
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ফর্ম সাবমিট ফাংশন
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! Your message has been sent.`);
    setFormData({ name: '', email: '', message: '' });
  };

  // --- স্টাইলিং ---
  const sectionStyle = {
    padding: '60px 20px',
    background: '#09090b', // একটু গাঢ় ব্যাকগ্রাউন্ড
    minHeight: '100vh',
    color: '#fff',
    fontFamily: 'sans-serif'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '50px'
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    justifyContent: 'center'
  };

  const formContainerStyle = {
    flex: '1',
    minWidth: '300px',
    maxWidth: '500px',
    background: '#18181b',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '20px',
    background: '#27272a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: '#f97316', // কমলা রঙের বাটন
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
  };

  const teamContainerStyle = {
    flex: '1',
    minWidth: '300px',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const contactCardStyle = {
    display: 'flex',
    alignItems: 'center',
    background: '#18181b',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  };

  // ৩ জনের কন্টাক্ট ইনফরমেশন
  const teamContacts = [
    {
      name: "Shoriful hoque Nobin",
      role: "AI & Full-Stack Developer",
      email: "nobin@example.com",
      phone: "+880 1XXX-XXXXXX",
      image: "/dp_nobin.jpg" // এখানে আপনার ছবির লিংক বসাবেন
    },
    {
      name: "Masad Rayran",
      role: "Software Engineer",
      email: "masad@example.com",
      phone: "+880 1XXX-XXXXXX",
      image: "/dp_masad.jpg"
    },
    {
      name: "Sakawat Hossien",
      role: "System Designer",
      email: "sakawat@example.com",
      phone: "+880 1XXX-XXXXXX",
      image: "/dp_sakawat.jpg"
    }
  ];

  return (
    <div style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>Contact Us</h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', margin: '0' }}>Have a project in mind? Get in touch with our team.</p>
        </div>

        <div style={gridStyle}>
          
          {/* লেফট সাইড: Contact Form */}
          <div style={formContainerStyle}>
            <h3 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Send a Message</h3>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                value={formData.name} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email" 
                value={formData.email} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
              <textarea 
                name="message" 
                placeholder="How can we help you?" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                style={{ ...inputStyle, resize: 'none' }} 
                required 
              />
              <button type="submit" style={buttonStyle}>Send Message</button>
            </form>
          </div>

          {/* রাইট সাইড: ৩ জনের ডিরেক্ট কন্টাক্ট ইনফো */}
          <div style={teamContainerStyle}>
            <h3 style={{ marginBottom: '5px', fontSize: '1.5rem' }}>Direct Contact</h3>
            <p style={{ color: '#a1a1aa', marginBottom: '15px' }}>Reach out to us individually.</p>
            
            {teamContacts.map((member, index) => (
              <div key={index} style={contactCardStyle}>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f97316', marginRight: '20px' }} 
                />
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{member.name}</h4>
                  <p style={{ margin: '0 0 8px 0', color: '#f97316', fontSize: '0.9rem' }}>{member.role}</p>
                  <p style={{ margin: '0', color: '#a1a1aa', fontSize: '0.9rem' }}>
                    📧 {member.email} <br/>
                    📞 {member.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;