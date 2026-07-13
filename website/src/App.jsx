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
import chocolateSalesDashboardImg from './assets/chocolate_sales_dashboard.jpg';
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

// Interactive SVG blueprint showing Systems Automation flow
const AutomationBlueprintDiagram = ({ activeStep }) => (
  <svg viewBox="0 0 500 320" width="100%" height="100%" style={{ background: 'transparent', display: 'block' }}>
    <defs>
      <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>

    {/* Background grids */}
    <g opacity="0.03">
      <path d="M0 40 H500 M0 80 H500 M0 120 H500 M0 160 H500 M0 200 H500 M0 240 H500 M0 280 H500" stroke="#3b82f6" strokeWidth="1" />
      <path d="M50 0 V320 M100 0 V320 M150 0 V320 M200 0 V320 M250 0 V320 M300 0 V320 M350 0 V320 M400 0 V320 M450 0 V320" stroke="#3b82f6" strokeWidth="1" />
    </g>

    {/* Connection Flow Lines with active dash offsets */}
    <path 
      d="M 90 160 H 210" 
      stroke={activeStep > 1 ? "#22d3ee" : "rgba(255,255,255,0.08)"} 
      strokeWidth="2.5" 
      fill="none"
      className={activeStep > 1 ? "svg-flow-animation" : ""}
    />

    {/* Split paths */}
    <path 
      d="M 290 160 C 330 160, 330 90, 410 90" 
      stroke={activeStep > 2 ? "#22d3ee" : "rgba(255,255,255,0.08)"} 
      strokeWidth="2" 
      fill="none"
      className={activeStep > 2 ? "svg-flow-animation" : ""}
    />
    <path 
      d="M 290 160 C 330 160, 330 230, 410 230" 
      stroke={activeStep > 2 ? "#22d3ee" : "rgba(255,255,255,0.08)"} 
      strokeWidth="2" 
      fill="none"
      className={activeStep > 2 ? "svg-flow-animation" : ""}
    />

    {/* Node 1: Browser */}
    <g transform="translate(90, 160)">
      <circle r="40" fill="#040810" stroke={activeStep === 1 ? "#22d3ee" : "rgba(255,255,255,0.08)"} strokeWidth={activeStep === 1 ? "2.5" : "1"} filter={activeStep === 1 ? "url(#glow-cyan)" : "none"} style={{ transition: 'all 0.3s' }} />
      <circle r="32" fill="#080f1e" />
      <rect x="-12" y="-10" width="24" height="17" rx="2" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="-12" y1="-4" x2="12" y2="-4" stroke="#22d3ee" strokeWidth="1" />
      <circle cx="-8" cy="-7" r="0.8" fill="#ef4444" />
      <circle cx="-5" cy="-7" r="0.8" fill="#eab308" />
      <circle cx="-2" cy="-7" r="0.8" fill="#22c55e" />
      <text x="0" y="3" fill="#cbd5e1" fontSize="6.5" fontFamily="sans-serif" textAnchor="middle">Metrics Intake</text>
      <text x="0" y="54" fill={activeStep === 1 ? "#22d3ee" : "#64748b"} fontSize="8" fontFamily="monospace" fontWeight="600" textAnchor="middle">1. BROWSER FORM</text>
    </g>

    {/* Node 2: Workers */}
    <g transform="translate(250, 160)">
      <circle r="40" fill="#040810" stroke={activeStep === 2 ? "#22d3ee" : "rgba(255,255,255,0.08)"} strokeWidth={activeStep === 2 ? "2.5" : "1"} filter={activeStep === 2 ? "url(#glow-cyan)" : "none"} style={{ transition: 'all 0.3s' }} />
      <circle r="32" fill="#080f1e" />
      <g transform="translate(0, -3)" className={activeStep === 2 ? "svg-spin-animation" : ""}>
        <circle cx="0" cy="0" r="9" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="0" cy="0" r="4" fill="#22d3ee" />
      </g>
      <text x="0" y="14" fill="#cbd5e1" fontSize="6.5" fontFamily="sans-serif" textAnchor="middle">CF API Workers</text>
      <text x="0" y="54" fill={activeStep === 2 ? "#22d3ee" : "#64748b"} fontSize="8" fontFamily="monospace" fontWeight="600" textAnchor="middle">2. PROXY GATEWAY</text>
    </g>

    {/* Node 3: Sheets CRM */}
    <g transform="translate(410, 90)">
      <circle r="34" fill="#040810" stroke={activeStep === 3 ? "#22d3ee" : "rgba(255,255,255,0.08)"} strokeWidth={activeStep === 3 ? "2" : "1"} filter={activeStep === 3 ? "url(#glow-cyan)" : "none"} style={{ transition: 'all 0.3s' }} />
      <circle r="27" fill="#080f1e" />
      <rect x="-9" y="-8" width="18" height="15" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="-9" y1="-3" x2="9" y2="-3" stroke="#22d3ee" strokeWidth="1" />
      <line x1="-9" y1="2" x2="9" y2="2" stroke="#22d3ee" strokeWidth="1" />
      <line x1="-3" y1="-8" x2="-3" y2="7" stroke="#22d3ee" strokeWidth="1" />
      <text x="0" y="46" fill={activeStep === 3 ? "#22d3ee" : "#64748b"} fontSize="8.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">3. GOOGLE SHEETS</text>
    </g>

    {/* Node 4: Email */}
    <g transform="translate(410, 230)">
      <circle r="34" fill="#040810" stroke={activeStep === 4 ? "#22d3ee" : "rgba(255,255,255,0.08)"} strokeWidth={activeStep === 4 ? "2" : "1"} filter={activeStep === 4 ? "url(#glow-cyan)" : "none"} style={{ transition: 'all 0.3s' }} />
      <circle r="27" fill="#080f1e" />
      <rect x="-10" y="-7" width="20" height="14" rx="1.5" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
      <path d="M-10 -5 L0 1 L10 -5" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
      <text x="0" y="46" fill={activeStep === 4 ? "#22d3ee" : "#64748b"} fontSize="8.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">4. EMAIL OUTREACH</text>
    </g>
  </svg>
);

// Interactive SVG blueprint showing Snowflake Medallion flow
const SnowflakeBlueprintDiagram = ({ activeStep }) => (
  <svg viewBox="0 0 500 320" width="100%" height="100%" style={{ background: 'transparent', display: 'block' }}>
    <defs>
      <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Background grids */}
    <g opacity="0.03">
      <path d="M0 40 H500 M0 80 H500 M0 120 H500 M0 160 H500 M0 200 H500 M0 240 H500 M0 280 H500" stroke="#10b981" strokeWidth="1" />
      <path d="M50 0 V320 M100 0 V320 M150 0 V320 M200 0 V320 M250 0 V320 M300 0 V320 M350 0 V320 M400 0 V320 M450 0 V320" stroke="#10b981" strokeWidth="1" />
    </g>

    {/* Connectors with flowing dashes */}
    <path 
      d="M 65 160 H 175" 
      stroke={activeStep > 1 ? "#10b981" : "rgba(255,255,255,0.08)"} 
      strokeWidth="2.5" 
      fill="none"
      className={activeStep > 1 ? "svg-flow-animation" : ""}
    />
    <path 
      d="M 215 160 H 315" 
      stroke={activeStep > 2 ? "#10b981" : "rgba(255,255,255,0.08)"} 
      strokeWidth="2.5" 
      fill="none"
      className={activeStep > 2 ? "svg-flow-animation" : ""}
    />
    <path 
      d="M 355 160 H 435" 
      stroke={activeStep > 3 ? "#10b981" : "rgba(255,255,255,0.08)"} 
      strokeWidth="2.5" 
      fill="none"
      className={activeStep > 3 ? "svg-flow-animation" : ""}
    />

    {/* Node 1: Bronze */}
    <g transform="translate(65, 160)">
      <circle r="36" fill="#040810" stroke={activeStep === 1 ? "#10b981" : "rgba(255,255,255,0.08)"} strokeWidth={activeStep === 1 ? "2.5" : "1"} filter={activeStep === 1 ? "url(#glow-emerald)" : "none"} style={{ transition: 'all 0.3s' }} />
      <circle r="29" fill="#080f1e" />
      <polygon points="-7,-9 2,-9 7,-4 7,9 -7,9" fill="none" stroke="#10b981" strokeWidth="1.5" />
      <polyline points="2,-9 2,-4 7,-4" fill="none" stroke="#10b981" strokeWidth="1.2" />
      <text x="0" y="48" fill={activeStep === 1 ? "#10b981" : "#64748b"} fontSize="8.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">1. BRONZE (RAW)</text>
    </g>

    {/* Node 2: Silver */}
    <g transform="translate(195, 160)">
      <circle r="38" fill="#040810" stroke={activeStep === 2 ? "#10b981" : "rgba(255,255,255,0.08)"} strokeWidth={activeStep === 2 ? "2.5" : "1"} filter={activeStep === 2 ? "url(#glow-emerald)" : "none"} style={{ transition: 'all 0.3s' }} />
      <circle r="30" fill="#080f1e" />
      <g transform="translate(0, -2)" className={activeStep === 2 ? "svg-spin-animation" : ""}>
        <circle cx="0" cy="0" r="9" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="-9" y1="0" x2="9" y2="0" stroke="#10b981" strokeWidth="1.2" />
        <line x1="0" y1="-9" x2="0" y2="9" stroke="#10b981" strokeWidth="1.2" />
      </g>
      <text x="0" y="52" fill={activeStep === 2 ? "#10b981" : "#64748b"} fontSize="8.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">2. SILVER (CLEAN)</text>
    </g>

    {/* Node 3: Gold */}
    <g transform="translate(335, 160)">
      <circle r="38" fill="#040810" stroke={activeStep === 3 ? "#10b981" : "rgba(255,255,255,0.08)"} strokeWidth={activeStep === 3 ? "2.5" : "1"} filter={activeStep === 3 ? "url(#glow-emerald)" : "none"} style={{ transition: 'all 0.3s' }} />
      <circle r="30" fill="#080f1e" />
      <path d="M-7,-7 C-7,-7 0,-10 0,-10 C0,-10 7,-7 7,-7 V0 C7,5 0,9 0,9 C0,9 -7,5 -7,0 Z" fill="none" stroke="#10b981" strokeWidth="1.5" />
      <text x="0" y="52" fill={activeStep === 3 ? "#10b981" : "#64748b"} fontSize="8.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">3. GOLD (STAR)</text>
    </g>

    {/* Node 4: Power BI */}
    <g transform="translate(435, 160)">
      <circle r="36" fill="#040810" stroke={activeStep === 4 ? "#10b981" : "rgba(255,255,255,0.08)"} strokeWidth={activeStep === 4 ? "2.5" : "1"} filter={activeStep === 4 ? "url(#glow-emerald)" : "none"} style={{ transition: 'all 0.3s' }} />
      <circle r="29" fill="#080f1e" />
      <rect x="-8" y="-7" width="3" height="13" fill="#10b981" />
      <rect x="-3" y="-11" width="3" height="17" fill="#10b981" />
      <rect x="2" y="-4" width="3" height="10" fill="#10b981" />
      <text x="0" y="48" fill={activeStep === 4 ? "#10b981" : "#64748b"} fontSize="8.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">4. EXECUTIVE BI</text>
    </g>
  </svg>
);



// Premium CSS-based MacBook/Vite browser mockup wrapper
const BrowserFrame = ({ title, url, children }) => (
  <div 
    style={{
      width: '100%',
      background: '#040810',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}
  >
    {/* Browser header bar */}
    <div 
      style={{
        height: '34px',
        background: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '8px',
        zIndex: 10
      }}
    >
      {/* OS Mock buttons */}
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }}></span>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
      
      {/* Browser Address mock bar */}
      <div 
        style={{
          flex: 1,
          height: '20px',
          background: 'rgba(0, 0, 0, 0.45)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '9.5px',
          color: '#64748b',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.3px',
          border: '1px solid rgba(255,255,255,0.03)',
          maxWidth: '340px',
          margin: '0 auto'
        }}
      >
        {url}
      </div>
    </div>
    {/* Screen viewport content */}
    <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  </div>
);


const PROJECTS = [
  {
    title: "Snowflake Medallion Pipeline",
    icon: <Database size={24} />,
    image: snowflakePipelineImg,
    category: "Cloud Data Engineering",
    tagBg: "rgba(59, 130, 246, 0.1)",
    tagBorder: "rgba(59, 130, 246, 0.2)",
    tagText: "#60a5fa",
    problem: "Manual data consolidation caused slow, inconsistent reporting.",
    approach: "Implemented bronze → silver → gold layers in Snowflake; transformations in SQL; automated incremental ingestion using Snowflake Streams (CDC) and Tasks.",
    solution: "Automated ETL pipeline that ingests raw files into bronze, applies cleansing and joins in silver, and produces analytics-ready tables in gold consumed by Power BI.",
    impact: "Reduced end‑to‑end reporting latency from 6 hours to 30 minutes; eliminated manual reconciliation tasks saving ~15 hours/month.",
    technologies: ["Snowflake DWH", "SQL", "Snowflake Streams", "Snowflake Tasks"],
    liveLink: null,
    githubLink: "https://github.com/LeadGenData/haresh-kumar-portfolio/tree/main/projects/snowflake-pipeline"
  },
  {
    title: "Campaigns CRM Systems Automation",
    icon: <Bot size={24} />,
    image: crmAdminPortalImg,
    category: "Systems Automation",
    tagBg: "rgba(234, 179, 8, 0.1)",
    tagBorder: "rgba(234, 179, 8, 0.2)",
    tagText: "#fde047",
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
    image: chocolateSalesDashboardImg,
    category: "Business Intelligence",
    tagBg: "rgba(34, 211, 238, 0.1)",
    tagBorder: "rgba(34, 211, 238, 0.2)",
    tagText: "#22d3ee",
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
    category: "Clinical Analytics",
    tagBg: "rgba(16, 185, 129, 0.1)",
    tagBorder: "rgba(16, 185, 129, 0.2)",
    tagText: "#34d399",
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
    category: "Database Engineering",
    tagBg: "rgba(168, 85, 247, 0.1)",
    tagBorder: "rgba(168, 85, 247, 0.2)",
    tagText: "#c084fc",
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
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
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
    setCarouselIndex(0);
  }, [activeFilter]);

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
            <h1 className="hero-title" style={{ letterSpacing: '-0.04em' }}>
              I Bridge the Gap Between Operations &amp; Code
            </h1>
            <p className="hero-desc" style={{ fontSize: '1.02rem', color: 'var(--text-sub)' }}>
              Over 14 years of hands-on data operations experience, turned into clean, automated systems. I build enterprise-grade reporting, scalable Snowflake data warehouses, and self-healing pipelines that translate complex operational needs into real business value.
            </p>
            
            {/* Tech Stack Showcase */}
            <div style={{ marginTop: '28px', marginBottom: '28px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>Core Tech Stack</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { name: 'Snowflake DWH', color: '#60a5fa', bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.18)' },
                  { name: 'Power BI / DAX', color: '#22d3ee', bg: 'rgba(34,211,238,0.06)', border: 'rgba(34,211,238,0.18)' },
                  { name: 'Python', color: '#fde047', bg: 'rgba(253,224,71,0.06)', border: 'rgba(253,224,71,0.18)' },
                  { name: 'SQL / T-SQL', color: '#c084fc', bg: 'rgba(192,132,252,0.06)', border: 'rgba(192,132,252,0.18)' },
                  { name: 'PowerShell', color: '#38bdf8', bg: 'rgba(56,189,248,0.06)', border: 'rgba(56,189,248,0.18)' },
                  { name: 'dbt Pipelines', color: '#f43f5e', bg: 'rgba(244,63,94,0.06)', border: 'rgba(244,63,94,0.18)' }
                ].map((tech, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      padding: '4px 12px', 
                      borderRadius: '30px', 
                      background: tech.bg, 
                      border: '1px solid ' + tech.border, 
                      color: tech.color, 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      cursor: 'default'
                    }}
                    className="tech-tag-hover"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="cta-group">
              <a href="#projects" className="btn btn-primary">
                View Cases <ArrowRight size={18} />
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

          {/* Immersive Narrative Timeline */}
          <div className="story-timeline-vertical reveal reveal-delay-2" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {CHAPTERS.map(ch => (
              <div key={ch.id} className="story-timeline-card">
                {/* Timeline node icon */}
                <div className="story-timeline-indicator">
                  {ch.icon}
                </div>
                {/* Timeline node body */}
                <div className="story-timeline-body">
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: ch.id === 1 ? 'var(--accent-primary)' : ch.id === 2 ? 'var(--accent-gold)' : 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      ◆ Chapter {ch.id}: {ch.label}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '500' }}>
                      {ch.stats.find(s => s.label === "EXPERIENCE" || s.label === "FOCUS AREA" || s.label === "CURRENT ROLE")?.value || ""}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                    {ch.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-sub)', lineHeight: '1.7', marginBottom: '18px' }}>
                    {ch.desc}
                  </p>
                  
                  {/* Stats Grid inside Node */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px' }}>
                    {ch.stats.map((st, sIdx) => (
                      <div key={sIdx}>
                        <div style={{ fontSize: '8px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '2px', textTransform: 'uppercase' }}>{st.label}</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)' }}>{st.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
            <div className="diagram-card spotlight-card" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(7, 11, 20, 0.45)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '24px' }}>
              <h4 style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
                Pipeline Map ({pipelineType === 'automation' ? 'Systems Automation' : 'Snowflake Medallion'})
              </h4>

              <div style={{ width: '100%', maxWidth: '460px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pipelineType === 'automation' ? (
                  <AutomationBlueprintDiagram activeStep={activeStep} />
                ) : (
                  <SnowflakeBlueprintDiagram activeStep={activeStep} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIOS & PROJECTS SECTION */}
      <section id="projects">
        <div className="container relative">
          <div className="section-watermark">03 WORK</div>
          <div style={{ textAlign: 'center', marginBottom: '28px' }} className="reveal">
            <h2 className="section-title">Analytical &amp; Automation Portfolios</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Real-world systems and Cloud Data Warehouses engineered to analyze metrics and automate operations.
            </p>
          </div>

          {/* CATEGORY FILTER TABS */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }} className="reveal">
            {['All', 'Data Engineering', 'Business Intelligence', 'Automation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '30px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: '1px solid',
                  borderColor: activeFilter === cat ? 'var(--accent-blue)' : 'rgba(255,255,255,0.08)',
                  backgroundColor: activeFilter === cat ? 'rgba(34, 211, 238, 0.1)' : 'rgba(10, 16, 32, 0.45)',
                  color: activeFilter === cat ? 'var(--accent-blue)' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeFilter === cat ? '0 0 15px rgba(34, 211, 238, 0.15)' : 'none'
                }}
                className="filter-btn"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FLAGSHIP SPOTLIGHT CAROUSEL */}
          <div className="reveal">
            {(() => {
              const list = PROJECTS.map((p, idx) => ({ ...p, originalIndex: idx })).filter(proj => {
                const isEngineering = proj.category.includes("Engineering");
                const isBI = proj.category.includes("Intelligence") || proj.category.includes("Analytics");
                const isAutomation = proj.category.includes("Automation");
                
                if (activeFilter === 'Data Engineering') return isEngineering;
                if (activeFilter === 'Business Intelligence') return isBI;
                if (activeFilter === 'Automation') return isAutomation;
                return true;
              });

              if (list.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No projects found matching the filter.
                  </div>
                );
              }

              const currentIndex = Math.min(carouselIndex, list.length - 1);
              const activeProj = list[currentIndex];
              const origIdx = activeProj.originalIndex;

              const prevSlide = () => {
                setCarouselIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
              };

              const nextSlide = () => {
                setCarouselIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
              };

              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div 
                    key={currentIndex}
                    ref={projectSpotlights[origIdx]?.ref}
                    onMouseMove={projectSpotlights[origIdx]?.onMouseMove}
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      gap: '32px',
                      minHeight: '480px'
                    }}
                    className="spotlight-card flex flex-col lg:flex-row gap-8 items-stretch p-8 w-full slide-enter"
                  >
                    {/* Left: Image Showcase framed inside Browser Window Mockup */}
                    {activeProj.image && (
                      <div 
                        style={{ flex: '1.2', display: 'flex', minHeight: '380px', cursor: 'zoom-in' }}
                        onClick={() => { setSelectedImage(activeProj.image); setSelectedTitle(activeProj.title); }}
                        className="group w-full lg:w-auto"
                      >
                        <BrowserFrame 
                          title={activeProj.title} 
                          url={`https://haresh.io/analytics/${activeProj.title.toLowerCase().replace(/ /g, '-')}`}
                        >
                          {/* Ambient Glow Backdrop (Blurred replica of dashboard) */}
                          <img 
                            src={activeProj.image} 
                            alt="" 
                            style={{ 
                              position: 'absolute',
                              inset: 0,
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              filter: 'blur(24px) opacity(0.35)',
                              pointerEvents: 'none',
                              transform: 'scale(1.15)',
                              transition: 'transform 0.5s ease',
                              zIndex: 0
                            }} 
                            className="group-hover:scale-[1.22]"
                          />

                          {/* Foreground Main Image Floating with Shadow */}
                          <img 
                            src={activeProj.image} 
                            alt={activeProj.title} 
                            style={{ 
                              position: 'relative',
                              zIndex: 1,
                              width: '88%', 
                              height: 'auto',
                              maxHeight: '260px',
                              objectFit: 'contain',
                              borderRadius: '6px',
                              boxShadow: '0 20px 45px rgba(0,0,0,0.7)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
                            }} 
                            className="group-hover:scale-[1.03] group-hover:translate-y-[-3px]"
                          />

                          <div 
                            style={{
                              position: 'absolute',
                              bottom: '12px',
                              right: '12px',
                              background: 'rgba(15,23,42,0.92)',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '9.5px',
                              color: '#60a5fa',
                              fontWeight: '600',
                              border: '1px solid rgba(59,130,246,0.2)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                              zIndex: 10
                            }}
                          >
                            🔍 Zoom Screen
                          </div>
                        </BrowserFrame>
                      </div>
                    )}

                    {/* Right: Info Showcase */}
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div>
                            <span style={{ padding: '3px 10px', borderRadius: '4px', background: activeProj.tagBg, border: '1px solid ' + activeProj.tagBorder, color: activeProj.tagText, fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'monospace' }}>{activeProj.category}</span>
                            <h3 className="proj-title" style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '10px', color: '#fff' }}>{activeProj.title}</h3>
                          </div>
                          <div className="proj-links" style={{ gap: '16px', display: 'flex' }}>
                            {activeProj.githubLink && <a href={activeProj.githubLink} target="_blank" rel="noreferrer" title="Source Code" style={{ color: '#94a3b8' }} className="hover:text-white"><Github size={24} /></a>}
                            {activeProj.liveLink && <a href={activeProj.liveLink} target="_blank" rel="noreferrer" title="Live Site" style={{ color: '#94a3b8' }} className="hover:text-white"><ExternalLink size={24} /></a>}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '16px' }}>
                          <div>
                            <strong style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>The Problem</strong>
                            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px', lineHeight: '1.5' }}>{activeProj.problem}</p>
                          </div>
                          <div>
                            <strong style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Our Approach</strong>
                            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px', lineHeight: '1.5' }}>{activeProj.approach}</p>
                          </div>
                          <div>
                            <strong style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>The Solution</strong>
                            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px', lineHeight: '1.5' }}>{activeProj.solution}</p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(34, 211, 238, 0.06)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)' }}>
                          <strong style={{ color: '#fff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Impact</strong>
                          <p style={{ color: '#fff', fontSize: '0.95rem', marginTop: '6px', fontWeight: '500', lineHeight: '1.4' }}>{activeProj.impact}</p>
                        </div>
                      </div>

                      <div>
                        <ul className="tag-list mt-auto pt-4 border-t border-white/5" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0 }}>
                          {activeProj.technologies.map((tag, idx) => (
                            <li key={idx} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '0.78rem', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.04)' }}>{tag}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Nav Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '24px' }}>
                    <button
                      onClick={prevSlide}
                      style={{
                        background: 'rgba(10, 16, 32, 0.65)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(34,211,238,0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; }}
                    >
                      &larr;
                    </button>

                    {/* Dots Indicators */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {list.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCarouselIndex(idx)}
                          style={{
                            width: currentIndex === idx ? '24px' : '10px',
                            height: '10px',
                            borderRadius: '5px',
                            background: currentIndex === idx ? 'var(--accent-blue)' : 'rgba(255,255,255,0.2)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: currentIndex === idx ? '0 0 8px var(--accent-blue)' : 'none'
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextSlide}
                      style={{
                        background: 'rgba(10, 16, 32, 0.65)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(34,211,238,0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; }}
                    >
                      &rarr;
                    </button>
                  </div>

                  {/* Special Bento Card below carousel, styled to span full width */}
                  <div 
                    ref={availabilitySpotlight.ref}
                    onMouseMove={availabilitySpotlight.onMouseMove}
                    className="spotlight-card reveal" 
                    style={{ 
                      borderColor: 'rgba(245, 158, 11, 0.25)', 
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.03), rgba(7, 11, 20, 0.85))',
                      width: '100%',
                      marginTop: '40px',
                      padding: '28px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <div className="proj-header mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
                      <div className="proj-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.08)', color: 'var(--accent-gold)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                        <Sparkles size={22} />
                      </div>
                    </div>
                    <h3 className="proj-title mb-2" style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>Open for Opportunities</h3>
                    <p className="proj-desc mb-4" style={{ color: 'var(--text-sub)', maxWidth: '650px', margin: '0 auto 16px' }}>
                      I am actively seeking roles as a BI Specialist, Senior Data Analyst, Snowflake Data Engineer, or Automation Consultant. My 14+ years of operational delivery ensures I bring immediate value over theoretical knowledge.
                    </p>
                    <div style={{ width: '100%', maxWidth: '280px' }}>
                      <a href="#contact" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(245, 158, 11, 0.25)', color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.04)' }}>
                        Start a Conversation →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}
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

      {/* PORTFOLIO LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 8, 16, 0.9)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            padding: '20px',
            cursor: 'zoom-out'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '95%',
              maxHeight: '85%',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: '#090d16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.4rem',
                lineHeight: '1',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              &times;
            </button>
            <img 
              src={selectedImage} 
              alt={selectedTitle} 
              style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block', objectFit: 'contain' }} 
            />
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center', color: '#fff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>{selectedTitle}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>Click anywhere outside to close this preview</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
