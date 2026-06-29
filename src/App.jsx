import React, { useState } from 'react';
import './App.css';
import { 
  Github, 
  Mail, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  Layers, 
  Database, 
  ArrowRight, 
  MessageSquare,
  Lock,
  Globe,
  Settings,
  Sparkles
} from 'lucide-react';

const ARCH_STEPS = [
  {
    id: 1,
    title: "Client Intake & Math Engine",
    component: "Frontend / Apps Script",
    desc: "Prospects input metrics on the browser. The frontend offloads calculations to a secure, server-side Google Apps Script math engine to protect intellectual property.",
    nodeHighlight: "client"
  },
  {
    id: 2,
    title: "Secure API Proxy Gateway",
    component: "Cloudflare Workers",
    desc: "All traffic routes through a custom Cloudflare Workers proxy at /api. This hides the Google Apps Script endpoint, cleans HTTP headers, and enforces CORS protection.",
    nodeHighlight: "proxy"
  },
  {
    id: 3,
    title: "Bi-directional GSheets Database",
    component: "Google Sheets CRM",
    desc: "Leads and client checklist progress states are saved to Google Sheets. The API features self-healing checks to automatically restore missing columns.",
    nodeHighlight: "database"
  },
  {
    id: 4,
    title: "Multi-Channel Automated Nurturing",
    component: "Gmail Drip Engine",
    desc: "Apps Script triggers automatically compile customized 6-page PDF audits, schedule follow-up emails on Day 2 & Day 5, and link clients directly to their portal.",
    nodeHighlight: "outreach"
  }
];

const PROJECTS = [
  {
    title: "Revenue Leakage Calculator",
    icon: <Cpu size={24} />,
    desc: "A client-side interactive audit tool with server-side Apps Script math execution. Generates unredacted custom 6-page PDF recovery plans and automates outreach.",
    liveLink: "https://bdl.dataconnectmail.com/",
    githubLink: "https://github.com/jamescluster35/revenue-leakage-calculator",
    tags: ["Google Apps Script", "Cloudflare Workers", "Vanilla HTML/CSS/JS", "PDF Engine"]
  },
  {
    title: "Executive CRM Admin Portal",
    icon: <Layers size={24} />,
    desc: "React-based CRM console featuring direct landing redirection, responsive KPI dashboard, case-insensitive lead filters, and custom search pipelines.",
    liveLink: "https://jamescluster35.github.io/bdl-leads-pro-live/",
    githubLink: "https://github.com/jamescluster35/bdl-leads-pro-crm",
    tags: ["React 19", "Vite", "Zustand State", "REST API", "Vanilla CSS"]
  },
  {
    title: "Outlook Campaign Sync Utilities",
    icon: <Terminal size={24} />,
    desc: "PowerShell and Python scripts executing local Outlook sent-folder campaign parsing, email bounce sweepers, and automated CRM record updates.",
    liveLink: null,
    githubLink: "https://github.com/jamescluster35/revenue-leakage-calculator/tree/main/scripts",
    tags: ["Python 3", "PowerShell Core", "Outlook COM API", "Automation"]
  }
];

function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      // Simulate form submission
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setFormSubmitted(false);
      }, 5000);
    }
  };

  const selectedStep = ARCH_STEPS.find(s => s.id === activeStep) || ARCH_STEPS[0];

  return (
    <div>
      {/* HEADER */}
      <header className="header">
        <div className="container nav">
          <a href="#" className="logo">James.Dev</a>
          <ul className="nav-links">
            <li><a href="#hero">About</a></li>
            <li><a href="#architecture">Architecture</a></li>
            <li><a href="#projects">Systems</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="container hero-layout">
          <div>
            <div className="hero-subtitle">
              <Sparkles size={16} /> Software Architect & Automation Specialist
            </div>
            <h1 className="hero-title">Engineering High-Yield Automation Systems</h1>
            <p className="hero-desc">
              Specialized in serverless architectures, robust bi-directional API pipelines, and automated outreach engines. I build custom tools that drive operational efficiency and recover lost business revenue.
            </p>
            <div className="cta-group">
              <a href="#projects" className="btn btn-primary">
                View Systems <ArrowRight size={18} />
              </a>
              <a href="#contact" className="btn btn-secondary">
                Get In Touch
              </a>
            </div>
          </div>

          <div className="glass-panel pulse-glow-orange" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={20} className="textColorAccent" style={{ color: 'var(--accent-orange)' }} /> Core Stack & Tooling
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>LANGUAGES</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>JavaScript (ES6+)</span></span>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Python 3</span></span>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>PowerShell Core</span></span>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>SQL</span></span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>FRAMEWORKS / INFRASTRUCTURE</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>React / Vite</span></span>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Cloudflare Workers</span></span>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Google Apps Script</span></span>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Docker Containers</span></span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>APIS & INTEGRATIONS</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>REST APIs</span></span>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Google Workspace</span></span>
                  <span className="tag-list" style={{ display: 'inline-flex' }}><span style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Stripe API</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE INTERACTIVE CANVAS */}
      <section id="architecture" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title">Interactive System Blueprint</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Click on the pipeline stages below to visualize the serverless, bi-directional architecture implemented to handle lead intake, database sync, and automation.
            </p>
          </div>

          <div className="arch-grid">
            {/* Steps Controller */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ARCH_STEPS.map((step) => (
                <div 
                  key={step.id} 
                  className="step-card" 
                  onClick={() => setActiveStep(step.id)}
                  style={{ 
                    cursor: 'pointer',
                    borderColor: activeStep === step.id ? 'var(--accent-orange)' : 'var(--border-color)',
                    background: activeStep === step.id ? 'var(--bg-tertiary)' : 'rgba(23, 27, 38, 0.4)',
                    boxShadow: activeStep === step.id ? 'var(--glow-shadow)' : 'none'
                  }}
                >
                  <div className="step-num" style={{
                    background: activeStep === step.id ? 'var(--accent-orange)' : 'var(--accent-orange-glow)',
                    color: activeStep === step.id ? '#ffffff' : 'var(--accent-orange)'
                  }}>{step.id}</div>
                  <div className="step-info">
                    <h4>{step.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '4px' }}>
                      {step.component}
                    </span>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Blueprint canvas */}
            <div className="diagram-card" style={{ height: '100%', minHeight: '380px', justifyContent: 'center' }}>
              <h4 style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase' }}>
                Pipeline Map
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', position: 'relative' }}>
                
                {/* NODE 1: Browser */}
                <div className="glass-panel" style={{ 
                  width: '260px', 
                  padding: '16px', 
                  textAlign: 'center', 
                  borderWidth: '2px',
                  borderColor: selectedStep.nodeHighlight === 'client' ? 'var(--accent-orange)' : 'var(--border-color)',
                  boxShadow: selectedStep.nodeHighlight === 'client' ? 'var(--glow-shadow)' : 'none'
                }}>
                  <Globe size={18} style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }} />
                  <h4 style={{ fontSize: '0.95rem' }}>Client Browser</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intake Form & Metrics</span>
                </div>

                {/* Arrow */}
                <ArrowRight size={20} style={{ transform: 'rotate(90deg)', color: 'var(--border-color)' }} />

                {/* NODE 2: Gateway */}
                <div className="glass-panel" style={{ 
                  width: '260px', 
                  padding: '16px', 
                  textAlign: 'center', 
                  borderWidth: '2px',
                  borderColor: selectedStep.nodeHighlight === 'proxy' ? 'var(--accent-orange)' : 'var(--border-color)',
                  boxShadow: selectedStep.nodeHighlight === 'proxy' ? 'var(--glow-shadow)' : 'none'
                }}>
                  <Lock size={18} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} />
                  <h4 style={{ fontSize: '0.95rem' }}>API Proxy (Cloudflare)</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CORS & Endpoint Masking</span>
                </div>

                {/* Arrow */}
                <ArrowRight size={20} style={{ transform: 'rotate(90deg)', color: 'var(--border-color)' }} />

                {/* DOUBLE HORIZONTAL NODES */}
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', width: '100%' }}>
                  
                  {/* Database Node */}
                  <div className="glass-panel" style={{ 
                    width: '180px', 
                    padding: '16px', 
                    textAlign: 'center', 
                    borderWidth: '2px',
                    borderColor: selectedStep.nodeHighlight === 'database' ? 'var(--accent-orange)' : 'var(--border-color)',
                    boxShadow: selectedStep.nodeHighlight === 'database' ? 'var(--glow-shadow)' : 'none'
                  }}>
                    <Database size={18} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} />
                    <h4 style={{ fontSize: '0.9rem' }}>Sheets CRM</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Lead & Checklist DB</span>
                  </div>

                  {/* Mail node */}
                  <div className="glass-panel" style={{ 
                    width: '180px', 
                    padding: '16px', 
                    textAlign: 'center', 
                    borderWidth: '2px',
                    borderColor: selectedStep.nodeHighlight === 'outreach' ? 'var(--accent-orange)' : 'var(--border-color)',
                    boxShadow: selectedStep.nodeHighlight === 'outreach' ? 'var(--glow-shadow)' : 'none'
                  }}>
                    <Mail size={18} style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }} />
                    <h4 style={{ fontSize: '0.9rem' }}>Gmail Engines</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PDF & Drip Campaign</span>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEMS & PROJECTS SECTION */}
      <section id="projects">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title">Engineered Web Systems</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Real-world systems built to solve operational bottlenecks, manage data pipelines, and automate marketing processes.
            </p>
          </div>

          <div className="projects-grid">
            {PROJECTS.map((proj, idx) => (
              <div key={idx} className="glass-panel proj-card">
                <div className="proj-header">
                  <div className="proj-icon-wrapper">
                    {proj.icon}
                  </div>
                  <div className="proj-links">
                    {proj.githubLink && (
                      <a href={proj.githubLink} target="_blank" rel="noreferrer" title="Source Code">
                        <Github size={20} />
                      </a>
                    )}
                    {proj.liveLink && (
                      <a href={proj.liveLink} target="_blank" rel="noreferrer" title="Live Site">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="proj-title">{proj.title}</h3>
                <p className="proj-desc">{proj.desc}</p>
                <ul className="tag-list">
                  {proj.tags.map((tag, tIdx) => (
                    <li key={tIdx}>{tag}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT PORTAL */}
      <section id="contact" style={{ background: 'var(--bg-secondary)', borderBottom: 'none' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title">Secure Contact Portal</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Interested in custom automations or systems development? Send an inquiry directly through this secure gateway.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <Mail size={22} />
                </div>
                <div className="contact-details">
                  <h4>Email Support</h4>
                  <p>jamescluster35@gmail.com</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <Settings size={22} />
                </div>
                <div className="contact-details">
                  <h4>Availability</h4>
                  <p>Contract / Direct Consultation</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <Sparkles size={22} />
                </div>
                <div className="contact-details">
                  <h4>Specialization</h4>
                  <p>APIs, Google Ecosystem, Webapps</p>
                </div>
              </div>
            </div>

            <div className="glass-panel">
              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div className="contact-icon-wrapper" style={{ margin: '0 auto 20px', background: 'var(--accent-emerald-glow)', color: 'var(--accent-emerald)' }}>
                    <MessageSquare size={24} />
                  </div>
                  <h3 style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }}>Inquiry Received</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Thank you for your submission. Your message has been routed to the server. I will respond to your registered email shortly.
                  </p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Owner" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="e.g. business@example.com" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Project Scope / Details</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleInputChange} 
                      rows="4" 
                      placeholder="Outline your automation needs, systems to build, or general inquiries..." 
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Send Secure Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            &copy; {new Date().getFullYear()} James.Dev · Engineered with <span>React &amp; Vite</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
