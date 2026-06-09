import { useState, useEffect, useRef } from 'react'
import './App.css'

// 1. Animated Counter Component for Statistics
function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value, 10);
  const hasPlus = value.includes('+');

  useEffect(() => {
    if (isNaN(numericValue)) {
      setCount(value);
      return;
    }
    let start = 0;
    const end = numericValue;
    const totalMiliseconds = duration;
    const incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, Math.max(incrementTime, 20));

    return () => clearInterval(timer);
  }, [value, duration, numericValue]);

  return (
    <span>
      {count}
      {hasPlus && '+'}
    </span>
  );
}

// 2. Typing Title Animation Component for Hero
function TypingTitle() {
  const [text, setText] = useState('');
  const fullText = 'NITHIN RB';
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const delayBetween = 2500;
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    if (isDeleting) {
      timer = setTimeout(() => {
        setText(fullText.substring(0, text.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(fullText.substring(0, text.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && text === fullText) {
      timer = setTimeout(() => setIsDeleting(true), delayBetween);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting]);

  return (
    <h1 className="hero-name">
      <span>{text}</span>
      <span className="cursor"></span>
    </h1>
  );
}

// 3. Virtual Transition Background Component
function VirtualBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      offset = (offset + 1.5) % 50;
      
      const centerY = canvas.height / 2;
      
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
      ctx.lineWidth = 1.5;
      
      // Draw horizon
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
      
      // Draw vertical lines with perspective
      ctx.beginPath();
      for(let i = -canvas.width * 2; i < canvas.width * 3; i+= 100) {
        ctx.moveTo(canvas.width / 2, centerY);
        ctx.lineTo(i, canvas.height);
      }
      ctx.stroke();
      
      // Draw horizontal moving lines
      ctx.beginPath();
      for(let y = 0; y < canvas.height / 2; y+= 4) {
        // non linear spacing for perspective
        const movingY = centerY + Math.pow(((y + offset) % (canvas.height / 2)) / (canvas.height / 2), 2) * (canvas.height / 2);
        ctx.moveTo(0, movingY);
        ctx.lineTo(canvas.width, movingY);
      }
      ctx.stroke();

      // Top inverted grid for virtual immersion
      ctx.strokeStyle = 'rgba(191, 85, 236, 0.15)';
      ctx.beginPath();
      for(let i = -canvas.width * 2; i < canvas.width * 3; i+= 100) {
        ctx.moveTo(canvas.width / 2, centerY);
        ctx.lineTo(i, 0);
      }
      for(let y = 0; y < canvas.height / 2; y+= 4) {
        const movingY = centerY - Math.pow(((y + offset) % (canvas.height / 2)) / (canvas.height / 2), 2) * (canvas.height / 2);
        ctx.moveTo(0, movingY);
        ctx.lineTo(canvas.width, movingY);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }} />;
}

// 4. Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('home');

  // Intersection Observer for Scroll Reveal & Active Navigation link
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    // Scroll listener for active link
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'leadership', 'goals', 'contact'];
      let currentSection = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* virtual background */}
      <VirtualBackground />

      {/* Navigation Bar */}
      <nav className="navbar">
        <a href="#home" className="navbar-logo" onClick={(e) => handleLinkClick(e, 'home')}>
          <span>&lt; NITHIN RB /&gt;</span>
        </a>
        <ul className="navbar-links">
          <li>
            <a href="#home" className={`navbar-link ${activeSection === 'home' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'home')}>Home</a>
          </li>
          <li>
            <a href="#about" className={`navbar-link ${activeSection === 'about' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'about')}>About</a>
          </li>
          <li>
            <a href="#skills" className={`navbar-link ${activeSection === 'skills' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'skills')}>Skills</a>
          </li>
          <li>
            <a href="#projects" className={`navbar-link ${activeSection === 'projects' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'projects')}>Projects</a>
          </li>
          <li>
            <a href="#leadership" className={`navbar-link ${activeSection === 'leadership' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'leadership')}>Leadership</a>
          </li>
          <li>
            <a href="#goals" className={`navbar-link ${activeSection === 'goals' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'goals')}>Goals</a>
          </li>
          <li>
            <a href="#contact" className={`navbar-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'contact')}>Contact</a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-left">
          <div className="cyber-badge">
            <span className="cyber-badge-dot"></span>
            <span>Active Portfolio // Recruiter Ready</span>
          </div>
          
          <TypingTitle />

          <h2 className="hero-subheading">
            Computer Science Engineering Student | Future Software Engineer
          </h2>
          <p className="hero-desc">
            I build software solutions, IoT systems and intelligent applications that solve real-world problems. Passionate about technology, innovation and continuous learning.
          </p>

          <div className="hero-btn-container">
            <a href="#projects" className="btn-primary" onClick={(e) => handleLinkClick(e, 'projects')}>
              View Projects
            </a>
            <a href="#contact" className="btn-secondary" onClick={(e) => handleLinkClick(e, 'contact')}>
              Contact Me
            </a>
          </div>
        </div>

        <div className="hero-right">
          {/* Floating brand icons */}
          <div className="floating-tech java f1" title="Java">☕</div>
          <div className="floating-tech python f2" title="Python">🐍</div>
          <div className="floating-tech react f3" title="React">⚛️</div>
          <div className="floating-tech arduino f4" title="Arduino">♾️</div>
          <div className="floating-tech github f5" title="GitHub">🐙</div>
          <div className="floating-tech ai f6" title="AI Symbol">🧠</div>

          {/* Floating holographic status cards */}
          <div className="hero-card hc1">
            <div>SYSTEM STATUS: ONLINE</div>
            <div style={{ color: 'var(--cyan)' }}>DB_CONNECTED: TRUE</div>
          </div>
          <div className="hero-card hc2">
            <div>&gt;_ compiler: active</div>
            <div style={{ color: 'var(--purple)' }}>err_count: 0</div>
          </div>

          {/* 3D Workspace illustration */}
          <div className="workspace-container">
            <div className="holo-screen editor-layer">
              <div className="screen-header">
                <span className="screen-dot"></span>
                <span className="screen-title">workspace.jsx - Editor</span>
              </div>
              <div className="code-lines">
                <div className="code-line cl1"></div>
                <div className="code-line cl2"></div>
                <div className="code-line cl3"></div>
                <div className="code-line cl4"></div>
                <div className="code-line cl5"></div>
                <div className="code-line cl2"></div>
                <div className="code-line cl1"></div>
              </div>
            </div>

            <div className="holo-screen terminal-layer">
              <div className="screen-header">
                <span className="screen-dot"></span>
                <span className="screen-title">bash - Terminal</span>
              </div>
              <div className="terminal-content">
                <div className="terminal-text">$ npm run dev</div>
                <div className="terminal-text" style={{ color: 'var(--cyan)' }}>➜ Local: http://localhost:3000/</div>
                <div className="terminal-text">$ iot-server --connect</div>
                <div className="terminal-text" style={{ color: 'var(--purple)' }}>[STATUS] Handshake successful.</div>
              </div>
            </div>

            <div className="holo-screen monitor-layer">
              <div className="screen-header">
                <span className="screen-dot"></span>
                <span className="screen-title">hardware_monitor.sys</span>
              </div>
              <div className="monitor-grid">
                <div className="monitor-node">
                  <span className="node-val">98%</span>
                  <span className="node-lbl">CPU LOAD</span>
                </div>
                <div className="monitor-node">
                  <span className="node-val">12ms</span>
                  <span className="node-lbl">IOT LATENCY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* About Section */}
      <section id="about" className="about-section reveal">
        <h2 className="sec-title">About Me</h2>
        <p className="sec-subtitle">A brief overview of my focus and fields of interest</p>
        
        <div className="about-grid">
          <div className="about-card glass-card">
            <p className="about-text">
              I am a Computer Science Engineering student at <strong>Presidency University, Bengaluru</strong>. 
              Driven by a profound curiosity for technology, I develop hardware-software integrations, web applications, 
              and computational systems that tackle challenging scenarios. 
            </p>
            <p className="about-text">
              My engineering framework centers around building resilient software architectures, deploying IoT sensor networks, 
              and applying algorithms to model real-world scenarios.
            </p>
            
            <h3 style={{ fontSize: '18px', margin: '20px 0 12px' }}>Areas of Focus:</h3>
            <div className="about-interests">
              <div className="interest-tag">
                <span className="interest-icon">💻</span>
                <span>Software Development</span>
              </div>
              <div className="interest-tag">
                <span className="interest-icon">🌐</span>
                <span>Web Development</span>
              </div>
              <div className="interest-tag">
                <span className="interest-icon">🧠</span>
                <span>Artificial Intelligence</span>
              </div>
              <div className="interest-tag">
                <span className="interest-icon">📡</span>
                <span>Internet of Things</span>
              </div>
              <div className="interest-tag" style={{ gridColumn: 'span 2' }}>
                <span className="interest-icon">🧩</span>
                <span>Complex Problem Solving</span>
              </div>
            </div>
          </div>

          <div className="about-graphic">
            <div className="cyber-orbit">
              <div className="cyber-orbit-inner">
                <div className="orbit-center">
                  <div className="cyber-grid-overlay">🚀</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Skills Section */}
      <section id="skills" className="skills-section reveal">
        <h2 className="sec-title">Skills & Tech Stack</h2>
        <p className="sec-subtitle">Technologies and toolkits I work with</p>

        <div className="skills-grid">
          <div className="skill-card glass-card java">
            <div className="skill-icon-container">☕</div>
            <span className="skill-title">Java</span>
          </div>
          <div className="skill-card glass-card python">
            <div className="skill-icon-container">🐍</div>
            <span className="skill-title">Python</span>
          </div>
          <div className="skill-card glass-card c">
            <div className="skill-icon-container">⚙️</div>
            <span className="skill-title">C</span>
          </div>
          <div className="skill-card glass-card html">
            <div className="skill-icon-container">🌐</div>
            <span className="skill-title">HTML</span>
          </div>
          <div className="skill-card glass-card css">
            <div className="skill-icon-container">🎨</div>
            <span className="skill-title">CSS</span>
          </div>
          <div className="skill-card glass-card js">
            <div className="skill-icon-container">⚡</div>
            <span className="skill-title">JavaScript</span>
          </div>
          <div className="skill-card glass-card react">
            <div className="skill-icon-container">⚛️</div>
            <span className="skill-title">React</span>
          </div>
          <div className="skill-card glass-card sql">
            <div className="skill-icon-container">🗄️</div>
            <span className="skill-title">SQL</span>
          </div>
          <div className="skill-card glass-card git">
            <div className="skill-icon-container">📁</div>
            <span className="skill-title">Git</span>
          </div>
          <div className="skill-card glass-card arduino">
            <div className="skill-icon-container">♾️</div>
            <span className="skill-title">Arduino</span>
          </div>
          <div className="skill-card glass-card iot">
            <div className="skill-icon-container">📡</div>
            <span className="skill-title">IoT Systems</span>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Projects Section */}
      <section id="projects" className="projects-section reveal">
        <h2 className="sec-title">Featured Projects</h2>
        <p className="sec-subtitle">A showcase of systems and solutions built</p>

        <div className="projects-grid">
          <div className="project-card glass-card">
            <div>
              <div className="project-header">
                <span className="project-icon">📡</span>
                <div className="project-tags">
                  <span className="project-tag">IoT</span>
                  <span className="project-tag purple-tag">Analytics</span>
                </div>
              </div>
              <h3 className="project-title">Real-Time Transportation & IoT Data Insights</h3>
              <p className="project-desc">
                Developed a system for collecting and analyzing transportation data using IoT technologies for real-time monitoring and decision-making.
              </p>
            </div>
            <div className="project-tags" style={{ marginTop: 'auto' }}>
              <span className="project-tag">Python</span>
              <span className="project-tag">IoT Gateway</span>
              <span className="project-tag">Real-Time DB</span>
            </div>
          </div>

          <div className="project-card glass-card">
            <div>
              <div className="project-header">
                <span className="project-icon">📍</span>
                <div className="project-tags">
                  <span className="project-tag">Hardware</span>
                  <span className="project-tag purple-tag">Arduino</span>
                </div>
              </div>
              <h3 className="project-title">GSM GPS Arduino Tracking System</h3>
              <p className="project-desc">
                Created a GPS and GSM based tracking system that sends live coordinates directly to a mobile device.
              </p>
            </div>
            <div className="project-tags" style={{ marginTop: 'auto' }}>
              <span className="project-tag">Arduino Uno</span>
              <span className="project-tag">GSM Module</span>
              <span className="project-tag">GPS Satellites</span>
            </div>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Preserved & Adapted: Leadership & Campus Involvement Section */}
      <section id="leadership" className="leadership-section reveal">
        <h2 className="sec-title">Leadership & Campus Involvement</h2>
        <p className="sec-subtitle">Organizing events, driving projects, and collaborating within teams</p>

        {/* Statistics Panels with Counters */}
        <div className="stats-grid">
          <div className="stat-card glass-card">
            <div className="stat-value">
              <AnimatedCounter value="10+" />
            </div>
            <div className="stat-label">Projects Guided</div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-value">
              <AnimatedCounter value="Multiple" />
            </div>
            <div className="stat-label">Events Coordinated</div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-value">
              <AnimatedCounter value="100+" />
            </div>
            <div className="stat-label">Students Collaborated</div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-value">
              <AnimatedCounter value="Ongoing" />
            </div>
            <div className="stat-label">Leadership Experience</div>
          </div>
        </div>

        {/* Vertical timeline representing Coordinator Roles */}
        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-badge"></div>
            <div className="timeline-content glass-card">
              <h3 className="timeline-role">Club Coordinator</h3>
              <div className="timeline-org">CFR Club & Campus Activities</div>
              
              <ul className="timeline-list">
                <li>Coordinated technical events and student activities.</li>
                <li>Led teams and managed project execution.</li>
                <li>Organized workshops, competitions and collaborative learning sessions.</li>
                <li>Mentored junior students in project development and problem-solving.</li>
                <li>Worked with faculty and student teams to ensure successful event delivery.</li>
              </ul>

              {/* Featured Initiative */}
              <div className="featured-initiative">
                <div className="featured-header">
                  <span className="featured-tag">Featured Initiative</span>
                  <span className="featured-title">Project X 2.0</span>
                </div>
                <p className="featured-desc">
                  Successfully led and coordinated Project X 2.0, where participants developed innovative projects using Python. Guided teams throughout planning, development and presentation stages while encouraging practical learning and teamwork.
                </p>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-badge"></div>
            <div className="timeline-content glass-card">
              <h3 className="timeline-role">Additional Contributions</h3>
              <div className="timeline-org">Task Coordination & Event Support</div>
              
              <ul className="timeline-list">
                <li>Served as Task Coordinator for multiple technical and non-technical events.</li>
                <li>Coordinated student participation in project competitions and innovation challenges.</li>
                <li>Supported knowledge-sharing activities and technical workshops.</li>
                <li>Contributed to the growth and engagement of the CFR Club through leadership and event management.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Achievements Cards inside Leadership Section */}
        <div className="achievements-wrapper">
          <h3 className="timeline-role" style={{ marginBottom: '28px', textAlign: 'center', fontSize: '20px' }}>Key Achievements</h3>
          <div className="achievements-grid">
            <div className="achievement-card glass-card">
              <div className="achievement-icon">🏆</div>
              <p className="achievement-title">Club Coordinator</p>
            </div>
            <div className="achievement-card glass-card">
              <div className="achievement-icon">🚀</div>
              <p className="achievement-title">Led Project X 2.0</p>
            </div>
            <div className="achievement-card glass-card">
              <div className="achievement-icon">👨‍💻</div>
              <p className="achievement-title">Mentored Student Teams</p>
            </div>
            <div className="achievement-card glass-card">
              <div className="achievement-icon">📋</div>
              <p className="achievement-title">Task Coordinator for Multiple Events</p>
            </div>
            <div className="achievement-card glass-card">
              <div className="achievement-icon">🤝</div>
              <p className="achievement-title">Organized Technical Workshops</p>
            </div>
            <div className="achievement-card glass-card">
              <div className="achievement-icon">🎯</div>
              <p className="achievement-title">Active Contributor to CFR Club Activities</p>
            </div>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Goals Section */}
      <section id="goals" className="goals-section reveal">
        <h2 className="sec-title">Personal & Career Goals</h2>
        <p className="sec-subtitle">My roadmap for short-term and long-term milestones</p>

        <div className="goals-grid">
          <div className="goal-card glass-card">
            <span className="goal-badge">Short-Term Goal</span>
            <h3 className="goal-title">Gain Experience & Grow Stack</h3>
            <p className="goal-desc">
              Gain industry experience through practical internships, work on large-scale architectures, and continuously improve full-stack development and hardware-software integration skills.
            </p>
          </div>

          <div className="goal-card glass-card long">
            <span className="goal-badge">Long-Term Goal</span>
            <h3 className="goal-title">Build Scalable Product Solutions</h3>
            <p className="goal-desc">
              Become a software engineer who builds scalable products and impactful technology solutions, pushing the boundaries of IoT, cloud computing, and intelligent systems.
            </p>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Contact Section */}
      <section id="contact" className="contact-section reveal">
        <h2 className="sec-title">Get In Touch</h2>
        <p className="sec-subtitle">Let's connect and build something innovative together</p>

        {/* Holographic terminal block */}
        <div className="contact-terminal">
          <div className="terminal-header">
            <span className="terminal-dot dot-red"></span>
            <span className="terminal-dot dot-yellow"></span>
            <span className="terminal-dot dot-green"></span>
            <span className="terminal-title">nithin-rb@portfolio: ~</span>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="terminal-prompt">nithin-rb@portfolio:~$</span> <span className="terminal-cmd">cat contact_details.json</span>
            </div>
            <div className="terminal-output">
              {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;"Name": <span className="terminal-accent">"NITHIN RB"</span>,
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;"Location": <span className="terminal-accent">"Bengaluru, India"</span>,
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;"University": <span className="terminal-accent">"Presidency University"</span>,
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;"Status": <span className="terminal-accent">"Open to Internships / Software Engineer Roles"</span>
              <br />
              {"}"}
            </div>
            <div className="terminal-line" style={{ marginTop: '20px' }}>
              <span className="terminal-prompt">nithin-rb@portfolio:~$</span> <span className="terminal-cmd">ping -c 3 networks.net</span>
            </div>
            <div className="terminal-output">
              PING networks.net (127.0.0.1) 56(84) bytes of data.
              <br />
              64 bytes from localhost: icmp_seq=1 ttl=64 time=0.04 ms
              <br />
              64 bytes from localhost: icmp_seq=2 ttl=64 time=0.03 ms
              <br />
              --- networks.net ping statistics ---
              <br />
              3 packets transmitted, 3 received, 0% packet loss, time 2004ms
            </div>
          </div>
        </div>

        {/* Contact Links Grid */}
        <div className="contact-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <a href="https://github.com/nithinrbbb" target="_blank" rel="noopener noreferrer" className="contact-card glass-card github">
            <span className="contact-icon">🐙</span>
            <span className="contact-label">GitHub</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>@nithinrbbb</span>
          </a>
          <a href="https://instagram.com/nithinrbbb" target="_blank" rel="noopener noreferrer" className="contact-card glass-card linkedin">
            <span className="contact-icon">📸</span>
            <span className="contact-label">Instagram</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>@nithinrbbb</span>
          </a>
          <a href="mailto:nithinleo0408@gmail.com" className="contact-card glass-card email">
            <span className="contact-icon">✉️</span>
            <span className="contact-label">Email</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>nithinleo0408@gmail.com</span>
          </a>
          <a href="tel:+918217820918" className="contact-card glass-card email">
            <span className="contact-icon">📞</span>
            <span className="contact-label">Phone</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>+91 8217820918</span>
          </a>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
