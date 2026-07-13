import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Sparkles,
  BarChart3,
  TrendingUp,
  Award,
  Download,
  Menu,
  X,
  Code2,
  Bot,
  ChevronRight,
  FileCode,
  CheckCircle2
} from 'lucide-react';

import snowflakePipelineImg from './assets/snowflake_pipeline.png';
import crmAdminPortalImg from './assets/crm_admin_portal.png';
import powerBiDashboardImg from './assets/power_bi_dashboard.png';
import hospitalDashboardImg from './assets/hospital_dashboard.jpg';
import sqlWarehouseSchemaImg from './assets/sql_warehouse_schema.png';
import revenueLeakageImg from './assets/revenue_leakage_calculator.png';

// ─── Canvas Particle Background ───────────────────────────────────────────
const DataNodeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(50, Math.floor((width * height) / 32000));
    
    let mouse = { x: null, y: null, radius: 130 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.8;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x && mouse.y) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.2;
            this.y += (dy / dist) * force * 1.2;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.11 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-bg" />;
};

// ─── Mouse Spotlight Ref Hook ─────────────────────────────────────────────
const useMouseMoveSpotlight = () => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  return { ref: cardRef, onMouseMove: handleMouseMove };
};

// ─── Project Card Spotlight Component ─────────────────────────────────────
const ProjectCard = ({ proj }) => {
  const { ref, onMouseMove } = useMouseMoveSpotlight();
  return (
    <div 
      ref={ref} 
      onMouseMove={onMouseMove} 
      className="spotlight-card reveal flex flex-col justify-between h-full"
    >
      <div>
        <div className="proj-header mb-4">
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
        <h3 className="proj-title mb-2">{proj.title}</h3>
        <p className="proj-desc text-gray-400 text-sm mb-4 leading-relaxed">{proj.desc}</p>
      </div>
      <ul className="tag-list mt-auto">
        {proj.tags.map((tag, tIdx) => (
          <li key={tIdx}>{tag}</li>
        ))}
      </ul>
    </div>
  );
};

// ─── Interactive Terminal Console Component ───────────────────────────────
const InteractiveTerminal = () => {
  const [logs, setLogs] = useState([
    { type: 'info', text: 'system_initialize --target=haresh_portfolio' },
    { type: 'success', text: '✔ Data Ingestion Staging running (Snowflake integration active)' },
    { type: 'success', text: '✔ Power BI DAX semantic connector: ONLINE' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const bodyRef = useRef(null);

  const appendLog = (type, text) => {
    setLogs(prev => [...prev, { type, text }]);
    setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;
    
    appendLog('cmd', `haresh@dwh:~$ ${cmd}`);

    setTimeout(() => {
      if (cleanCmd === 'help') {
        appendLog('info', 'Available commands:\n  help         - Display commands menu\n  run pipeline - Execute Credit Fraud medallion ETL cycle\n  clear        - Clear console screen\n  dax          - Trigger wait-time metric aggregation');
      } else if (cleanCmd === 'run pipeline') {
        appendLog('warn', '⚡ Launching Snowflake Bronze landing stream...');
        setTimeout(() => {
          appendLog('success', '✔ Bronze staging complete: variant rows stored');
          setTimeout(() => {
            appendLog('success', '✔ CDC streams validated in Silver schema (deduped)');
            setTimeout(() => {
              appendLog('success', '✔ Star dimension schema merged. Gold rebuild: SUCCESS');
            }, 500);
          }, 500);
        }, 400);
      } else if (cleanCmd === 'clear') {
        setLogs([]);
      } else if (cleanCmd === 'dax') {
        appendLog('info', 'Computing Power BI ER waiting times (DAX)...');
        setTimeout(() => {
          appendLog('success', '✔ Median Triage Wait time: 14.2 minutes (calculated)');
          appendLog('success', '✔ Patient satisfaction score: 92.4% success rating');
        }, 400);
      } else {
        appendLog('error', `bash: command not found: ${cmd}. Type 'help' to check options.`);
      }
    }, 150);

    setInputVal('');
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot" style={{ background: '#ef4444' }}></span>
          <span className="terminal-dot" style={{ background: '#eab308' }}></span>
          <span className="terminal-dot" style={{ background: '#22c55e' }}></span>
        </div>
        <div className="terminal-title">DWH_Engine_Console</div>
        <div className="text-[10px] text-gray-500 font-mono">v1.1</div>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {logs.map((log, i) => (
          <div key={i} className="terminal-line">
            {log.type === 'cmd' ? (
              <span className="terminal-cmd">{log.text}</span>
            ) : (
              <span className={`terminal-output terminal-${log.type}`}>{log.text}</span>
            )}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt">haresh@dwh:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCommand(inputVal)}
            placeholder="Type 'help' or click a command..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#EFF6FF',
              padding: 0,
              fontSize: 'inherit',
              fontFamily: 'inherit',
              outline: 'none',
              flex: 1
            }}
          />
          <span className="terminal-cursor"></span>
        </div>
      </div>
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '10px 14px',
        background: '#060a14',
        borderTop: '1px solid rgba(59, 130, 246, 0.08)'
      }}>
        <button onClick={() => handleCommand('help')} className="btn btn-secondary" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '10px' }}>ℹ️ Help</button>
        <button onClick={() => handleCommand('run pipeline')} className="btn btn-secondary" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '10px', color: 'var(--accent-cyan)', borderColor: 'rgba(34, 211, 238, 0.15)' }}>🚀 Run Medallion</button>
        <button onClick={() => handleCommand('dax')} className="btn btn-secondary" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '10px', color: 'var(--accent-gold)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>📈 DAX Metrics</button>
      </div>
    </div>
  );
};



// ─── Career Chapter Switcher Timeline Data ───────────────────────────────
const CHAPTERS = [
  {
    id: 1,
    chapter: "Chapter 1",
    label: "Operations & Delivery (Innovays)",
    title: "Manager — Data & Delivery",
    desc: "Led a core data operations and delivery team of 15+ members handling large enterprise accounts. Managed the processing and quality validation of 200K–300K+ monthly B2B records. Built Excel automation frameworks that reduced manual reporting cycles from 5 days down to 1 day.",
    stats: [
      { label: "TEAM MEMBERS LED", value: "15+ Senders" },
      { label: "MONTHLY RECORDS", value: "200K - 300K+" },
      { label: "EXPERIENCE", value: "14 Years 6 Mos" }
    ],
    icon: "⚙️"
  },
  {
    id: 2,
    chapter: "Chapter 2",
    label: "The Technical Pivot",
    title: "Transition to Cloud & SQL",
    desc: "Recognized the limits of spreadsheets and manual workflows. Modernized my technical stack by mastering SQL, database schemas, and cloud platforms. Earned verified badges in HackerRank Transact-SQL and completed Snowflake Hands-On Essentials workshops.",
    stats: [
      { label: "SQL CERTIFICATION", value: "HackerRank SQL" },
      { label: "SNOWFLAKE WORKSHOPS", value: "3 Certificates" },
      { label: "FOCUS AREA", value: "Data Modeling" }
    ],
    icon: "🔍"
  },
  {
    id: 3,
    chapter: "Chapter 3",
    label: "Consulting & Automation (Ariviga)",
    title: "Data Consultant & Systems Builder",
    desc: "Deploying Snowflake pipelines (Streams & Tasks), Power BI dashboards, and custom serverless web applications. Building Cloudflare API Workers, React leads dashboards, and custom Python/PowerShell scripts to parse Outlook folder bounce logs.",
    stats: [
      { label: "CURRENT ROLE", value: "Data Consultant" },
      { label: "PLATFORMS USED", value: "React / Workers" },
      { label: "BI METRICS", value: "Power BI / DAX" }
    ],
    icon: "🚀"
  }
];


const AUTOMATION_STEPS = [
  {
    id: 1,
    title: "Client Intake & Math Engine",
    component: "Frontend / Apps Script",
    desc: "Prospects input metrics on the browser. The frontend offloads calculations to a secure, server-side Google Apps Script math engine to protect intellectual property.",
    nodeHighlight: "node1"
  },
  {
    id: 2,
    title: "Secure API Proxy Gateway",
    component: "Cloudflare Workers",
    desc: "All traffic routes through a custom Cloudflare Workers proxy at /api. This hides the Google Apps Script endpoint, cleans HTTP headers, and enforces CORS protection.",
    nodeHighlight: "node2"
  },
  {
    id: 3,
    title: "Bi-directional GSheets Database",
    component: "Google Sheets CRM",
    desc: "Leads and client checklist progress states are saved to Google Sheets. The API features self-healing checks to automatically restore missing columns.",
    nodeHighlight: "node3"
  },
  {
    id: 4,
    title: "Multi-Channel Automated Nurturing",
    component: "Gmail Drip Engine",
    desc: "Apps Script triggers automatically compile customized 6-page PDF audits, schedule follow-up emails on Day 2 & Day 5, and link clients directly to their portal.",
    nodeHighlight: "node4"
  }
];

const BI_STEPS = [
  {
    id: 1,
    title: "Bronze Ingestion Staging",
    component: "Snowflake Stages / CSV / JSON",
    desc: "Ingests raw, high-velocity card transaction logs from Snowflake stages into Bronze landing tables, capturing variant data fields.",
    nodeHighlight: "node1"
  },
  {
    id: 2,
    title: "Silver Cleansing & Streams",
    component: "SQL Queries / Table Joins",
    desc: "Applies de-duplication windows, formats raw dates, standardizes currencies, and captures modifications using Snowflake Change Data Capture (CDC) Streams.",
    nodeHighlight: "node2"
  },
  {
    id: 3,
    title: "Gold Schema & Data Masking",
    component: "Star Schema / RLS / Masking",
    desc: "Stages facts and dimensions in a Star schema. Applies dynamic data masking on credit card numbers to secure cardholder PII and complies with PCI-DSS.",
    nodeHighlight: "node3"
  },
  {
    id: 4,
    title: "Fraud Analytics Dashboard",
    component: "Power BI / DAX Semantic Layer",
    desc: "Connects Power BI to Snowflake Gold views. Builds interactive fraud heatmaps, risk gauges, and calculations using optimized DAX expressions.",
    nodeHighlight: "node4"
  }
];

// Custom Inline SVG illustrations to replace AI-generated screenshot placeholders
const SnowflakePipelineIllustration = () => (
  <svg viewBox="0 0 400 160" width="100%" height="100%" style={{ background: '#090D1A', borderRadius: '8px', display: 'block' }}>
    <rect width="100%" height="100%" fill="#070B14" />
    <path d="M 0 40 L 400 40 M 0 80 L 400 80 M 0 120 L 400 120 M 100 0 L 100 180 M 200 0 L 200 180 M 300 0 L 300 180" stroke="rgba(59, 130, 246, 0.02)" strokeWidth="1" />
    
    <defs>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0.85" />
      </linearGradient>
    </defs>

    {/* Connection Flow Lines */}
    <path d="M 80 80 H 320" stroke="rgba(59, 130, 246, 0.12)" strokeWidth="4" />
    <path d="M 80 80 H 320" stroke="url(#blueGrad)" strokeWidth="2" strokeDasharray="8 6" />

    {/* Node 1: Ingestion */}
    <g transform="translate(55, 80)">
      <circle r="26" fill="#0C1220" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1" />
      <circle r="18" fill="url(#blueGrad)" opacity="0.12" />
      <path d="M -7 -7 H 7 V 7 H -7 Z" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
      <path d="M -4 -3 H 4 M -4 0 H 4 M -4 3 H 4" stroke="#3B82F6" strokeWidth="1" />
      <text x="0" y="42" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">1. RAW STAGE</text>
    </g>

    {/* Node 2: Snowflake DWH */}
    <g transform="translate(200, 80)">
      <circle r="32" fill="#0C1220" stroke="rgba(99, 102, 241, 0.35)" strokeWidth="1.5" />
      <circle r="24" fill="url(#purpleGrad)" opacity="0.12" />
      
      {/* Database Cylinder Icon */}
      <g transform="translate(-12, -14)">
        <path d="M 0 4 C 0 1, 24 1, 24 4 C 24 7, 0 7, 0 4 Z" fill="#6366F1" opacity="0.8" />
        <path d="M 0 4 V 11 C 0 14, 24 14, 24 11 V 4" fill="none" stroke="#6366F1" strokeWidth="1.5" />
        <path d="M 0 11 V 18 C 0 21, 24 21, 24 18 V 11" fill="none" stroke="#6366F1" strokeWidth="1.5" />
        <path d="M 0 18 V 25 C 0 28, 24 28, 24 25 V 18" fill="none" stroke="#6366F1" strokeWidth="1.5" />
      </g>
      
      <text x="0" y="48" fill="#EFF6FF" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">2. SNOWFLAKE</text>
    </g>

    {/* Node 3: Analytics / BI */}
    <g transform="translate(345, 80)">
      <circle r="26" fill="#0C1220" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1" />
      <circle r="18" fill="url(#goldGrad)" opacity="0.12" />
      <path d="M -7 8 V -7 H -3 V 8 Z M 0 8 V -2 H 4 V 8 Z M 7 8 V 3 H 11 V 8 Z" fill="#F59E0B" />
      <text x="0" y="42" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">3. BI REPORT</text>
    </g>
  </svg>
);

const PowerBiDashboardIllustration = () => (
  <svg viewBox="0 0 400 160" width="100%" height="100%" style={{ background: '#090D1A', borderRadius: '8px', display: 'block' }}>
    <rect width="100%" height="100%" fill="#070B14" />
    <path d="M 0 30 L 400 30" stroke="rgba(59, 130, 246, 0.06)" strokeWidth="1" />
    
    <text x="16" y="19" fill="#EFF6FF" fontSize="9.5" fontFamily="sans-serif" fontWeight="bold">Hospital ER Analytics Dashboard</text>
    
    {/* Left Column: Progress Ring (Triage Rate) */}
    <g transform="translate(70, 95)">
      <circle r="36" fill="none" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="6" />
      <path d="M 0 -36 A 36 36 0 1 1 -25.4 25.4" fill="none" stroke="url(#blueGrad)" strokeWidth="6" strokeLinecap="round" />
      <text x="0" y="4" fill="#3B82F6" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">92.4%</text>
      <text x="0" y="52" fill="#94A3B8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">Triage Efficiency</text>
    </g>

    {/* Right Column: Wait Time Trend Chart */}
    <g transform="translate(160, 48)">
      <rect width="224" height="96" rx="6" fill="#0C1220" stroke="rgba(59, 130, 246, 0.06)" strokeWidth="1" />
      <text x="12" y="16" fill="#94A3B8" fontSize="7.5" fontFamily="sans-serif">WAIT TIME TREND (24H)</text>
      
      <line x1="20" y1="36" x2="204" y2="36" stroke="rgba(59, 130, 246, 0.02)" strokeWidth="1" />
      <line x1="20" y1="56" x2="204" y2="56" stroke="rgba(59, 130, 246, 0.02)" strokeWidth="1" />
      <line x1="20" y1="76" x2="204" y2="76" stroke="rgba(59, 130, 246, 0.02)" strokeWidth="1" />
      <line x1="20" y1="82" x2="204" y2="82" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="1" />

      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" stopColorOpacity="0.2" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" stopColorOpacity="0" />
        </linearGradient>
      </defs>
      
      <path d="M 30 82 L 30 52 L 64 68 L 98 42 L 132 30 L 166 56 L 200 82 Z" fill="url(#areaGrad)" />
      <path d="M 30 52 L 64 68 L 98 42 L 132 30 L 166 56 L 200 82" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
      
      <circle cx="98" cy="42" r="2" fill="#22D3EE" />
      <circle cx="132" cy="30" r="2" fill="#22D3EE" />
      <text x="132" y="22" fill="#22D3EE" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">14.2m</text>
    </g>
  </svg>
);

const PROJECTS = [
  {
    title: "Snowflake Medallion Pipeline",
    icon: <Database size={24} />,
    image: snowflakePipelineImg,
    problem: "Manual data consolidation caused slow, inconsistent reporting.",
    approach: "Implemented bronze → silver → gold layers in Snowflake; transformations in SQL; scheduled refresh via Antigravity.",
    solution: "Automated ETL pipeline that ingests raw files into bronze, applies cleansing and joins in silver, and produces analytics-ready tables in gold consumed by Power BI.",
    impact: "Reduced end‑to‑end reporting latency from 6 hours to 30 minutes; eliminated manual reconciliation tasks saving ~15 hours/month.",
    technologies: ["Snowflake DWH", "SQL", "Power BI", "Antigravity"],
    liveLink: null,
    githubLink: "https://github.com/LeadGenData/haresh-kumar-portfolio/tree/main/projects/snowflake-pipeline"
  },
  {
    title: "Campaigns CRM Systems Automation",
    icon: <Bot size={24} />,
    image: crmAdminPortalImg,
    problem: "Manual lead harvesting and email bounce tracking wasted hours of administrative work and polluted outreach databases.",
    approach: "Developed web scrapers in Python, automated Outlook COM sweeping in PowerShell, and synced logs to Google Sheets.",
    solution: "An automated lead generation and outreach monitoring system that harvests verified contacts and flags bounced addresses.",
    impact: "Reduced administrative manual work by 100% and protected outreach domain reputation from email spam blocks.",
    technologies: ["Python", "PowerShell", "Outlook API", "Google Sheets API"],
    liveLink: null,
    githubLink: "https://github.com/LeadGenData/haresh-kumar-portfolio/tree/main/projects/campaigns-automation"
  },
  {
    title: "Chocolate Sales Analytics",
    icon: <FileCode size={24} />,
    image: powerBiDashboardImg,
    problem: "Lack of clear visibility into YOY revenue growth across global regions.",
    approach: "Analyzed raw sales logs; developed advanced DAX measures in Power BI.",
    solution: "Interactive Power BI dashboard analyzing global chocolate sales trends with dynamic product filtering.",
    impact: "Provided instant YOY revenue growth metrics, improving strategic decision-making speed by 50%.",
    liveLink: null,
    githubLink: "https://github.com/LeadGenData/haresh-kumar-portfolio/tree/main/projects/powerbi-analytics",
    technologies: ["Power BI", "DAX", "Data Modeling", "Business Intelligence"],
    antigravityNote: null
  },
  {
    title: "Clinical Admissions Analytics",
    icon: <BarChart3 size={24} />,
    image: hospitalDashboardImg,
    problem: "Unpredictable emergency admissions wait times led to inefficient staffing.",
    approach: "SQL; Power BI; Power Query (M).",
    solution: "Optimized clinical operations dashboard dynamically calculating triage rate metrics and satisfaction trends.",
    impact: "Identified bottlenecks to reduce patient wait times by 20% through optimized hospital staffing allocations.",
    technologies: ["Power BI", "DAX", "Power Query (M)", "Healthcare BI"],
    liveLink: "https://github.com/LeadGenData/hospital-emergency-room-dashboard-Power-BI-",
    githubLink: "https://github.com/LeadGenData/hospital-emergency-room-dashboard-Power-BI-",
    antigravityNote: null
  },
  {
    title: "Relational Schema Optimizer",
    icon: <Database size={24} />,
    image: sqlWarehouseSchemaImg,
    problem: "High-volume billing analyses were crippled by unoptimized relational models.",
    approach: "SQL Server T-SQL; Data Warehousing; Clustered Indexing.",
    solution: "Optimized relational warehouse modeling transaction logs with high-performance Star schemas.",
    impact: "Sped up complex reporting queries by 300%.",
    technologies: ["SQL Server", "T-SQL Engine", "ETL Pipelines", "Star Schema"],
    liveLink: "https://github.com/LeadGenData/sql_data_warehouse_project",
    githubLink: "https://github.com/LeadGenData/sql_data_warehouse_project",
    antigravityNote: null
  }
];

function App() {
  const [pipelineType, setPipelineType] = useState('automation');
  const [activeStep, setActiveStep]     = useState(1);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [formData, setFormData]         = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading]   = useState(false);
  const [formError, setFormError]       = useState('');
  const [activeChapterId, setActiveChapterId] = useState(1);
  const availabilitySpotlight = useMouseMoveSpotlight();
  const contactSpotlight = useMouseMoveSpotlight();
  const node1Spotlight = useMouseMoveSpotlight();
  const node2Spotlight = useMouseMoveSpotlight();
  const node3Spotlight = useMouseMoveSpotlight();
  const node4Spotlight = useMouseMoveSpotlight();
  const node5Spotlight = useMouseMoveSpotlight();
  const projectSpotlights = [node1Spotlight, node2Spotlight, node3Spotlight, node4Spotlight, node5Spotlight];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.08
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // ✅ Saves to "Haresh Portfolio - Contact Inquiries" Google Sheet
  // ✅ Sends notification email to hareshmkumar9@gmail.com
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwLblcovVU2lQcXGlKkWN84am2QV-qU-OyGr60HYvB-eo5_q0A6i8hLG64vKiPW-gbX/exec";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setFormError('Please fill in all fields before sending.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      // Apps Script requires text/plain + no-cors to avoid CORS preflight
      await fetch(APPS_SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body:    JSON.stringify({ name, email, message, source: 'Portfolio Website' })
      });
      // no-cors = can't read response; assume success if no exception thrown
      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 6000);
    } catch (err) {
      setFormError('Could not send. Please email hareshmkumar9@gmail.com directly.');
    } finally {
      setFormLoading(false);
    }
  };

  const stepsList = pipelineType === 'automation' ? AUTOMATION_STEPS : BI_STEPS;
  const selectedStep = stepsList.find(s => s.id === activeStep) || stepsList[0];

  return (
    <div className="app-container">
      {/* Dynamic Canvas Node Particle Field */}
      <DataNodeBackground />

      {/* Floating Glow Orbs & Grid Gradients */}
      <div className="grid-bg"></div>
      <div className="glow-orb orb-purple"></div>
      <div className="glow-orb orb-cyan"></div>
      <div className="glow-orb orb-orange"></div>

      <header className="header">
        <div className="container nav">
          <a href="#" className="logo">M. Haresh Kumar</a>
          <ul className="nav-links">
            <li><a href="#hero">About</a></li>
            <li><a href="#story">My Story</a></li>
            <li><a href="#architecture">Blueprints</a></li>
            <li><a href="#projects">Portfolio</a></li>
            <li><a href="#contact">Contact</a></li>
            <li style={{ marginLeft: '12px' }}>
              <a 
                href="./Haresh_Kumar_Resume.pdf" 
                download="Haresh_Kumar_Resume.pdf"
                className="btn btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', borderColor: 'rgba(59, 130, 246, 0.2)', background: 'rgba(59, 130, 246, 0.04)' }}
              >
                <Download size={13} /> Resume
              </a>
            </li>
          </ul>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DRAWER OVERLAY */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <ul className="mobile-menu-links">
            <li><a href="#hero" onClick={() => setMenuOpen(false)}>About</a></li>
            <li><a href="#story" onClick={() => setMenuOpen(false)}>My Story</a></li>
            <li><a href="#architecture" onClick={() => setMenuOpen(false)}>Blueprints</a></li>
            <li><a href="#projects" onClick={() => setMenuOpen(false)}>Portfolio</a></li>
            <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
            <li style={{ marginTop: '16px' }}>
              <a 
                href="./Haresh_Kumar_Resume.pdf" 
                download="Haresh_Kumar_Resume.pdf"
                className="btn btn-secondary" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <Download size={14} /> Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="container hero-layout">
          <div className="reveal">
            <div className="hero-subtitle">
              <Sparkles size={16} /> Data Operations &amp; Systems Automation Specialist
            </div>
            <h1 className="hero-title">Data Operations &amp; Systems Automation</h1>
            <p className="hero-desc">
              With over 14 years of hands-on data operations experience, I build enterprise-grade reporting dashboards, scalable Snowflake data warehouses, and automated ETL pipelines. I bring immediate business value by translating operational realities into modern Data Analytics, BI, and Data Engineering solutions.
            </p>
            <div className="cta-group">
              <a href="#projects" className="btn btn-primary">
                View Portfolios <ArrowRight size={18} />
              </a>
              <a href="#contact" className="btn btn-secondary">
                Get In Touch
              </a>
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            <InteractiveTerminal />
          </div>
        </div>
      </section>


      {/* DUAL INTERACTIVE BLUEPRINT SECTION */}
      {/* MY STORY SECTION */}
      <section id="story" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }} className="reveal">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', padding: '5px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '100px', fontFamily: 'var(--font-mono)' }}>
              ◆ Career Journey
            </div>
            <h2 className="section-title">From Data Operations to Data Engineering</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              I didn't start in a classroom. I started in the real world — managing data at scale, leading teams, and delivering results directly to senior leadership.
            </p>
          </div>

          {/* Stats Row */}
          <div className="stats-row stats-row-3 reveal reveal-delay-1" style={{ marginBottom: '72px' }}>
            <div className="stat-card">
              <div className="stat-value">14+</div>
              <div className="stat-label">Years in Data Operations</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">15+</div>
              <div className="stat-label">Team Members Led</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">300K+</div>
              <div className="stat-label">Monthly Records Managed</div>
            </div>
          </div>

          {/* Interactive Chapter Switcher Console */}
          <div className="chapter-console-container reveal reveal-delay-2">
            
            {/* Left Tabs */}
            <div className="chapter-tabs-list">
              {CHAPTERS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterId(ch.id)}
                  className={`chapter-tab-item ${activeChapterId === ch.id ? 'active' : ''}`}
                  style={{ border: 'none' }}
                >
                  <div className="chapter-tab-num" style={{ color: activeChapterId === ch.id ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    ◆ {ch.chapter}
                  </div>
                  <div className="chapter-tab-title">{ch.label}</div>
                </button>
              ))}
              
              {/* My Edge Note */}
              <div className="glass-panel" style={{ borderColor: 'rgba(59,130,246,0.15)', marginTop: '12px' }}>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.82rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "I know the <strong style={{ color: 'var(--text-main)' }}>operational reality</strong> behind the data — the broken pipelines, the manual workarounds, the business cost of slow reporting."
                </p>
              </div>
            </div>

            {/* Right Active Chapter Console Panel */}
            <div className="chapter-viewer-panel">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CONSOLE NODE ACTIVE</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
                      {CHAPTERS.find(c => c.id === activeChapterId).title}
                    </h3>
                  </div>
                  <span style={{ fontSize: '2rem' }}>{CHAPTERS.find(c => c.id === activeChapterId).icon}</span>
                </div>
                
                <p style={{ fontSize: '0.92rem', color: 'var(--text-sub)', lineHeight: '1.7', marginBottom: '24px' }}>
                  {CHAPTERS.find(c => c.id === activeChapterId).desc}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
                {CHAPTERS.find(c => c.id === activeChapterId).stats.map((st, sIdx) => (
                  <div key={sIdx} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '4px', textTransform: 'uppercase' }}>{st.label}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: activeChapterId === 3 ? 'var(--accent-cyan)' : activeChapterId === 2 ? 'var(--accent-gold)' : 'var(--accent-primary)' }}>{st.value}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ARCHITECTURE SECTION */}
      <section id="architecture" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 className="section-title">Interactive System Blueprints</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 24px' }}>
              Toggle between the two core architectures I design: serverless systems automation or cloud data engineering pipelines.
            </p>

            {/* Toggle Buttons */}
            <div style={{ display: 'inline-flex', gap: '12px', background: 'rgba(8, 9, 12, 0.6)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => { setPipelineType('automation'); setActiveStep(1); }}
                style={{
                  background: pipelineType === 'automation' ? 'var(--accent-orange)' : 'transparent',
                  color: pipelineType === 'automation' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                Systems Automation
              </button>
              <button
                onClick={() => { setPipelineType('bi'); setActiveStep(1); }}
                style={{
                  background: pipelineType === 'bi' ? 'var(--accent-emerald)' : 'transparent',
                  color: pipelineType === 'bi' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                Cloud Data Engineering (Snowflake)
              </button>
            </div>
          </div>

          <div className="arch-grid">
            {/* Steps Controller */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stepsList.map((step) => (
                <div
                  key={step.id}
                  className="step-card"
                  onClick={() => setActiveStep(step.id)}
                  style={{
                    cursor: 'pointer',
                    borderColor: activeStep === step.id ? (pipelineType === 'automation' ? 'var(--accent-orange)' : 'var(--accent-emerald)') : 'var(--border-color)',
                    background: activeStep === step.id ? 'var(--bg-tertiary)' : 'rgba(23, 27, 38, 0.4)',
                    boxShadow: activeStep === step.id ? (pipelineType === 'automation' ? 'var(--glow-shadow)' : '0 0 20px var(--accent-emerald-glow)') : 'none'
                  }}
                >
                  <div className="step-num" style={{
                    background: activeStep === step.id ? (pipelineType === 'automation' ? 'var(--accent-orange)' : 'var(--accent-emerald)') : 'var(--border-color)',
                    color: '#ffffff'
                  }}>{step.id}</div>
                  <div className="step-info">
                    <h4>{step.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: pipelineType === 'automation' ? 'var(--accent-emerald)' : 'var(--accent-orange)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '4px' }}>
                      {step.component}
                    </span>
                    <p style={{ fontSize: '0.9rem' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Blueprint canvas */}
            <div className="diagram-card" style={{ height: '100%', minHeight: '380px', justifyContent: 'center' }}>
              <h4 style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase' }}>
                Pipeline Map ({pipelineType === 'automation' ? 'Automation' : 'Snowflake Medallion'})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', position: 'relative' }}>

                {/* NODE 1 */}
                 <div 
                   ref={node1Spotlight.ref}
                   onMouseMove={node1Spotlight.onMouseMove}
                   className={`spotlight-card ${selectedStep.nodeHighlight === 'node1' ? 'blueprint-pulse' : ''}`}
                   style={{
                     width: '260px',
                     padding: '16px',
                     textAlign: 'center',
                     borderWidth: '2px',
                     borderColor: selectedStep.nodeHighlight === 'node1' ? (pipelineType === 'automation' ? 'var(--accent-orange)' : 'var(--accent-emerald)') : 'var(--border-color)',
                     boxShadow: selectedStep.nodeHighlight === 'node1' ? (pipelineType === 'automation' ? 'var(--glow-shadow)' : '0 0 20px var(--accent-emerald-glow)') : 'none',
                     transition: 'all 0.3s ease'
                   }}
                 >
                   {pipelineType === 'automation' ? <Globe size={18} style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }} /> : <Settings size={18} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} />}
                   <h4 style={{ fontSize: '0.95rem' }}>{pipelineType === 'automation' ? 'Client Browser' : 'Bronze Landing Staging'}</h4>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pipelineType === 'automation' ? 'Intake Form & Metrics' : 'JSON, CSV, Raw stages'}</span>
                 </div>

                 {/* Arrow */}
                 <ArrowRight 
                   size={20} 
                   className={selectedStep.nodeHighlight !== 'node1' ? 'blueprint-pulse' : ''} 
                   style={{ 
                     transform: 'rotate(90deg)', 
                     color: selectedStep.nodeHighlight !== 'node1' ? (pipelineType === 'automation' ? 'var(--accent-orange)' : 'var(--accent-emerald)') : 'var(--border-color)',
                     transition: 'all 0.3s ease'
                   }} 
                 />

                 {/* NODE 2 */}
                 <div 
                   ref={node2Spotlight.ref}
                   onMouseMove={node2Spotlight.onMouseMove}
                   className={`spotlight-card ${selectedStep.nodeHighlight === 'node2' ? 'blueprint-pulse' : ''}`}
                   style={{
                     width: '260px',
                     padding: '16px',
                     textAlign: 'center',
                     borderWidth: '2px',
                     borderColor: selectedStep.nodeHighlight === 'node2' ? (pipelineType === 'automation' ? 'var(--accent-orange)' : 'var(--accent-emerald)') : 'var(--border-color)',
                     boxShadow: selectedStep.nodeHighlight === 'node2' ? (pipelineType === 'automation' ? 'var(--glow-shadow)' : '0 0 20px var(--accent-emerald-glow)') : 'none',
                     transition: 'all 0.3s ease'
                   }}
                 >
                   {pipelineType === 'automation' ? <Lock size={18} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} /> : <Database size={18} style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }} />}
                   <h4 style={{ fontSize: '0.95rem' }}>{pipelineType === 'automation' ? 'API Proxy (Cloudflare)' : 'Silver Cleansing & CDC'}</h4>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pipelineType === 'automation' ? 'CORS & Endpoint Masking' : 'De-duplication & Streams'}</span>
                 </div>

                 {/* Arrow */}
                 <ArrowRight 
                   size={20} 
                   className={(selectedStep.nodeHighlight === 'node3' || selectedStep.nodeHighlight === 'node4') ? 'blueprint-pulse' : ''} 
                   style={{ 
                     transform: 'rotate(90deg)', 
                     color: (selectedStep.nodeHighlight === 'node3' || selectedStep.nodeHighlight === 'node4') ? (pipelineType === 'automation' ? 'var(--accent-orange)' : 'var(--accent-emerald)') : 'var(--border-color)',
                     transition: 'all 0.3s ease'
                   }} 
                 />

                 {/* DOUBLE HORIZONTAL NODES */}
                 <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', width: '100%' }}>

                   {/* NODE 3 */}
                   <div 
                     ref={node3Spotlight.ref}
                     onMouseMove={node3Spotlight.onMouseMove}
                     className={`spotlight-card ${selectedStep.nodeHighlight === 'node3' ? 'blueprint-pulse' : ''}`}
                     style={{
                       width: '180px',
                       padding: '16px',
                       textAlign: 'center',
                       borderWidth: '2px',
                       borderColor: selectedStep.nodeHighlight === 'node3' ? (pipelineType === 'automation' ? 'var(--accent-orange)' : 'var(--accent-emerald)') : 'var(--border-color)',
                       boxShadow: selectedStep.nodeHighlight === 'node3' ? (pipelineType === 'automation' ? 'var(--glow-shadow)' : '0 0 20px var(--accent-emerald-glow)') : 'none',
                       transition: 'all 0.3s ease'
                     }}
                   >
                     {pipelineType === 'automation' ? <Database size={18} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} /> : <Layers size={18} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} />}
                     <h4 style={{ fontSize: '0.9rem' }}>{pipelineType === 'automation' ? 'Sheets CRM' : 'Gold Star Schema'}</h4>
                     <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pipelineType === 'automation' ? 'Lead & Checklist DB' : 'PII Masking & Dimensions'}</span>
                   </div>

                   {/* NODE 4 */}
                   <div 
                     ref={node4Spotlight.ref}
                     onMouseMove={node4Spotlight.onMouseMove}
                     className={`spotlight-card ${selectedStep.nodeHighlight === 'node4' ? 'blueprint-pulse' : ''}`}
                     style={{
                       width: '180px',
                       padding: '16px',
                       textAlign: 'center',
                       borderWidth: '2px',
                       borderColor: selectedStep.nodeHighlight === 'node4' ? (pipelineType === 'automation' ? 'var(--accent-orange)' : 'var(--accent-emerald)') : 'var(--border-color)',
                       boxShadow: selectedStep.nodeHighlight === 'node4' ? (pipelineType === 'automation' ? 'var(--glow-shadow)' : '0 0 20px var(--accent-emerald-glow)') : 'none',
                       transition: 'all 0.3s ease'
                     }}
                   >
                     {pipelineType === 'automation' ? <Mail size={18} style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }} /> : <BarChart3 size={18} style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }} />}
                     <h4 style={{ fontSize: '0.9rem' }}>{pipelineType === 'automation' ? 'Gmail Engines' : 'Executive BI Report'}</h4>
                     <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pipelineType === 'automation' ? 'PDF & Drip Campaign' : 'Power BI Risk Heatmaps'}</span>
                   </div>

                 </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIOS & PROJECTS SECTION */}
      <section id="projects">
        <div className="container relative">
          <div className="section-watermark">03 WORK</div>
          <div style={{ textAlign: 'center', marginBottom: '48px' }} className="reveal">
            <h2 className="section-title">Analytical &amp; Automation Portfolios</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Real-world systems and Cloud Data Warehouses engineered to analyze metrics and automate operations.
            </p>
          </div>

          <div className="bento-grid">
            
            {/* DYNAMIC PROJECT CARDS USING NEW RECRUITER STRUCTURE */}
            {PROJECTS.map((proj, i) => (
              <div 
                key={i}
                ref={projectSpotlights[i]?.ref}
                onMouseMove={projectSpotlights[i]?.onMouseMove}
                className={`spotlight-card reveal ${i === 0 || i === 3 ? "bento-col-2" : ""} ${i % 2 !== 0 ? "reveal-delay-1" : ""} flex flex-col justify-between h-full`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div className="proj-icon-wrapper">
                        {proj.icon}
                      </div>
                      <div>
                        <h3 className="proj-title" style={{ fontSize: '1.05rem', fontWeight: '700' }}>{proj.title}</h3>
                        <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">ANALYTICS & AUTOMATION</span>
                      </div>
                    </div>
                    <div className="proj-links">
                      {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" title="Source Code"><Github size={20} /></a>}
                      {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" title="Live Site"><ExternalLink size={20} /></a>}
                    </div>
                  </div>

                  {proj.image && (
                    <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#0f172a' }}>
                      <img src={proj.image} alt={proj.title} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', maxHeight: '250px' }} />
                    </div>
                  )}

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: 'var(--accent-blue)', fontSize: '0.80rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Problem</strong>
                    <p className="proj-desc text-gray-400 text-sm mt-1">{proj.problem}</p>
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: 'var(--accent-blue)', fontSize: '0.80rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Approach</strong>
                    <p className="proj-desc text-gray-400 text-sm mt-1">{proj.approach}</p>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ color: 'var(--accent-blue)', fontSize: '0.80rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Solution</strong>
                    <p className="proj-desc text-gray-400 text-sm mt-1">{proj.solution}</p>
                  </div>

                  <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '6px', borderLeft: '3px solid var(--accent-blue)' }}>
                    <strong style={{ color: '#fff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Impact</strong>
                    <p style={{ color: '#fff', fontSize: '0.9rem', marginTop: '6px', fontWeight: '500', lineHeight: '1.4' }}>{proj.impact}</p>
                  </div>

                  {proj.antigravityNote && (
                    <div style={{ marginBottom: '20px', padding: '10px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <p style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontStyle: 'italic', lineHeight: '1.4' }}>{proj.antigravityNote}</p>
                    </div>
                  )}
                </div>

                <ul className="tag-list mt-auto pt-4 border-t border-white/5">
                  {proj.technologies.map((tag, idx) => <li key={idx}>{tag}</li>)}
                </ul>
              </div>
            ))}

            {/* Special Bento Card: Availability / Connect */}
            <div 
              ref={availabilitySpotlight.ref}
              onMouseMove={availabilitySpotlight.onMouseMove}
              className="spotlight-card reveal reveal-delay-2" 
              style={{ borderColor: 'rgba(245, 158, 11, 0.25)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.03), rgba(7, 11, 20, 0.85))' }}
            >
              <div className="proj-header mb-4">
                <div className="proj-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.08)', color: 'var(--accent-gold)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                  <Sparkles size={22} />
                </div>
              </div>
              <h3 className="proj-title mb-2" style={{ color: 'var(--accent-gold)' }}>Open for Opportunities</h3>
              <p className="proj-desc mb-4" style={{ color: 'var(--text-sub)' }}>
                I am actively seeking roles as a BI Specialist, Senior Data Analyst, Snowflake Data Engineer, or Automation Consultant. My 14+ years of operational delivery ensures I bring immediate value over theoretical knowledge.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <a href="#contact" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(245, 158, 11, 0.25)', color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.04)' }}>
                  Start a Conversation →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* CONTACT PORTAL */}
      <section id="contact" style={{ background: 'var(--bg-secondary)', borderBottom: 'none' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }} className="reveal">
            <h2 className="section-title">Secure Contact Portal</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Interested in Snowflake data warehousing, SQL modeling, or Power BI dashboard designs? Send an inquiry directly.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info reveal">
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <Mail size={22} />
                </div>
                <div className="contact-details">
                  <h4>Email Support</h4>
                  <p>hareshmkumar9@gmail.com</p>
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
                  <h4>Focus Areas</h4>
                  <p>Snowflake, Power BI, SQL Modeling, Workflow Automation</p>
                </div>
              </div>
            </div>

            <div 
              ref={contactSpotlight.ref}
              onMouseMove={contactSpotlight.onMouseMove}
              className="spotlight-card reveal reveal-delay-1"
            >
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
                      onChange={handleInputChange}
                      placeholder="e.g. Hiring Manager"
                      disabled={formLoading}
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
                      placeholder="e.g. company@example.com"
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
                      placeholder="Outline your database modeling needs, reporting metrics, or general inquiries..."
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
      <footer className="footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="footer-text" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} M. Haresh Kumar · Styled with <span>React &amp; Vite</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px', maxWidth: '700px', margin: '8px auto 0', lineHeight: '1.6' }}>
            Portfolio styled with React and Vite using Antigravity for layout and workflow orchestration. All Snowflake, Power BI, and SQL implementations linked below are my handwritten work.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
