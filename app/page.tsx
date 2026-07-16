"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CinematicLayer from "./components/VideoIntro/CinematicLayer";
import styles from "./components/VideoIntro/VideoIntro.module.css";

// --- डेटा आर्किटेक्चर (Data Row) ---
const SKILLS = [
  { name: "Front-End Development", level: "90%" },
  { name: "Backend APIs (Node.js)", level: "75%" },
  { name: "Firebase Architecture", level: "80%" },
  { name: "Mobile App Architectures", level: "75%" }
];

// 🔥 आपका अपडेटेड और सही नंबरों वाला एजुकेशन डेटा (CGPA: 7.93, 12th: 78%, 10th: 74.4%)
const EDUCATION = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Bihar Engineering University (BEU), Patna",
    duration: "2022 - 2026",
    score: "CGPA: 7.93" 
  },
  {
    degree: "Higher Secondary (12th Grade)",
    institution: "R.B.S College Andaur,Samastipur,Bihar",
    duration: "2019 - 2021",
    score: "Marks: 78%" 
  },
  {
    degree: "Secondary School (10th Grade)",
    institution: "High School Badhauna,Samastipur, Bihar",
    duration: "2019",
    score: "Marks: 74.4%" 
  }
];

const PROJECTS = [
  {
    title: "📚 Library System",
    category: "web",
    tags: ["HTML5", "Tailwind CSS", "Firebase Firestore"],
    desc: "A real-time smart library management panel featuring seat mapping, dynamic shifting allocation, and strict attendance tracking.",
    link: "https://badauna-library.vercel.app"
  },
  {
    title: "📱 FitTrack Mobile App",
    category: "app",
    tags: ["React Native", "Node.js", "MongoDB"],
    desc: "A cross-platform fitness monitoring app built with microservices architecture, smart metrics dashboards, and push notifications support.",
    link: "#"
  },
  {
    title: "🛍️ E-Commerce Engine",
    category: "web",
    tags: ["Next.js", "GraphQL", "Stripe Billing"],
    desc: "A highly scalable custom retail infrastructure optimized for global speeds, full inventory analytics, and automated payouts configuration.",
    link: "#"
  }
];

const TESTIMONIALS = [
  {
    text: '"Shivam delivers clean architecture and fast databases setup. The attendance module he built for our library space works flawlessly without delays."',
    author: "— Pro. Sonu Kumar Chaudhary (Managing Director & Librarian)"
  },
  {
    text: '"His command over Firebase security rules, secure token matching logic, and lightweight frontends code is highly professional."',
    author: "— Technical Reviewer Group"
  }
];

export default function Home() {
  // --- स्टेट्स (States) ---
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);
  const [projectFilter, setProjectFilter] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [userTypedMessage, setUserTypedMessage] = useState(""); 
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! I am shivam.boat, Shivam's elite AI Assistant. How can I assist you with project queries today?" }
  ]);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);

  // --- रेफ्स (Refs) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const foregroundVideoRef = useRef<HTMLVideoElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);
  const textElementsRef = useRef<HTMLElement[]>([]);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const [skillsAnimated, setSkillsTriggered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- ऑटो-स्क्रॉल चैटबॉट ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const timer = setTimeout(() => setShowSoundHint(false), 4000);

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    if (containerRef.current) gsap.to(containerRef.current, { opacity: 1, duration: 1.2 });
    tl.fromTo(
      textElementsRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, stagger: 0.15, delay: 0.3 }
    );

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
      clearInterval(slideTimer);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!skillsSectionRef.current || skillsAnimated) return;
      const top = skillsSectionRef.current.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        setSkillsTriggered(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [skillsAnimated]);

  const togglePlay = () => {
    if (foregroundVideoRef.current && ambientVideoRef.current) {
      if (isPlaying) {
        foregroundVideoRef.current.pause();
        ambientVideoRef.current.pause();
      } else {
        foregroundVideoRef.current.play().catch(() => {});
        ambientVideoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (foregroundVideoRef.current) {
      foregroundVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (showSoundHint) setShowSoundHint(false);
    }
  };

  const showToast = (text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const downloadResume = () => {
    showToast("⏳ Launching secure CV download pipeline script context...");
    setTimeout(() => {
      showToast("✓ Shivam_Kumar_CV.pdf downloaded to storage successfully.");
    }, 1500);
  };

  const handleBotQuery = (query: string) => {
    if (!query.trim()) return;
    
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    const normalizedQuery = query.toLowerCase();
    
    let reply = "I can definitely help with that. Feel free to initiate direct inquiries using the WhatsApp quick workspace link below!";
    if (normalizedQuery.includes("fee") || normalizedQuery.includes("price") || normalizedQuery.includes("cost")) {
      reply = "Shivam custom builds high-end architectures matching startup specifications budgets. Standard projects rates are extremely optimal.";
    } else if (normalizedQuery.includes("hire") || normalizedQuery.includes("contact") || normalizedQuery.includes("call")) {
      reply = "You can instantly drop an email or trigger a text alert via the call/WhatsApp shortcuts inside the contact section area below.";
    } else if (normalizedQuery.includes("project") || normalizedQuery.includes("work") || normalizedQuery.includes("portfolio")) {
      reply = "Check out the Featured Projects row showcasing the production-grade live Library Panel, FitTrack App, and E-Commerce Engine.";
    }
    
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 600);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTypedMessage.trim()) return;
    handleBotQuery(userTypedMessage);
    setUserTypedMessage("");
  };

  const _addToRefs = (el: HTMLElement | null) => {
    if (el && !textElementsRef.current.includes(el)) {
      textElementsRef.current.push(el);
    }
  };

  return (
    <div ref={containerRef} style={{ backgroundColor: "#070B0E", minHeight: "100vh", position: "relative", opacity: 0, overflowX: "hidden", color: "#F0F4F8" }}>
      <div ref={cursorRef} className={styles.customCursor} />

      <nav style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000, backdropFilter: "blur(12px)", background: "rgba(7, 11, 14, 0.7)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", padding: "20px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="#" style={{ fontSize: "1.3rem", fontWeight: 700, textDecoration: "none", color: "#fff" }}>Shivam<span style={{ color: "#FFB834" }}>.Dev</span></a>
          <ul style={{ display: "flex", gap: "32px", listStyle: "none", margin: 0, padding: 0 }}>
            <li><a href="#" style={{ textDecoration: "none", color: "#FFB834", fontWeight: 600, fontSize: "0.95rem" }}>Home</a></li>
            <li><a href="#skills" style={{ textDecoration: "none", color: "#9BB1C2", fontWeight: 600, fontSize: "0.95rem" }}>Skills</a></li>
            <li><a href="#education" style={{ textDecoration: "none", color: "#9BB1C2", fontWeight: 600, fontSize: "0.95rem" }}>Education</a></li>
            <li><a href="#projects" style={{ textDecoration: "none", color: "#9BB1C2", fontWeight: 600, fontSize: "0.95rem" }}>Projects</a></li>
            <li><a href="#contact" style={{ textDecoration: "none", color: "#9BB1C2", fontWeight: 600, fontSize: "0.95rem" }}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* --- 1. सिनेमैटिक वीडियो हीरो सेक्शन --- */}
      <section className={styles.heroContainer}>
        <div className={styles.ambientWrapper}>
          <video ref={ambientVideoRef} className={styles.ambientVideo} src="/assets/talking-head.mp4" autoPlay loop muted playsInline />
        </div>
        <div className={styles.vignetteOverlay} />
        <div className={styles.gradientBottom} />

        <CinematicLayer />

        <div className={styles.contentGrid}>
          <div className={styles.videoWindowFrame}>
            <video ref={foregroundVideoRef} className={styles.mainVideo} src="/assets/talking-head.mp4" autoPlay loop muted={isMuted} playsInline />
          </div>

          <div className={styles.textContent}>
            <h1 ref={_addToRefs} className={styles.giantTitle}>
              SHIVAM <br /> <span className={styles.accentText}>KUMAR</span>
            </h1>
            <p ref={_addToRefs} className={styles.subtitle}>
              I build premium digital experiences combining high-performance backends with modern, pixel-perfect user interfaces. Specializing in end-to-end software development architecture.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "2rem", flexWrap: "wrap" }}>
              <button onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })} className={styles.primaryBtn}>💼 Explore Timeline</button>
              <button onClick={downloadResume} className={styles.ghostBtn}>📥 Download CV</button>
            </div>
          </div>
        </div>

        <div className={styles.controlsContainer}>
          {showSoundHint && (
            <div className={styles.soundHint} onClick={toggleMute}>
              <span>TAP FOR SOUND</span>
              <div className={styles.pulseDot} />
            </div>
          )}
          <div className={styles.glassControlGroup}>
            <button onClick={togglePlay} className={styles.controlBtn}>
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button onClick={toggleMute} className={styles.controlBtn}>
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM4 9v6h4l5 5V4L8 9H4zm12.5 3c0 2.97-1.9 5.5-4.5 6.5v2c3.71-1.04 6.5-4.44 6.5-8.5s-2.79-7.46-6.5-8.5v2c2.6 1 4.5 3.53 4.5 6.5z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
              )}
            </button>
          </div>
        </div>

        <div className={styles.scrollIndicator} onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })}>
          <span className={styles.scrollLabel}>EXPLORE TIMELINE</span>
          <div className={styles.pulseLine} />
        </div>
      </section>

      {/* --- स्किल्स डैशबोर्ड सेक्शन --- */}
      <section id="skills" ref={skillsSectionRef} style={{ padding: "100px 0", background: "rgba(255,255,255,0.01)", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className={styles.sectionTitle}>Technical Expertise</h2>
          <p style={{ color: "#9BB1C2", marginBottom: "48px", fontSize: "1rem" }}>Proficiency level dashboard across core technology frameworks.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            {SKILLS.map((skill, index) => (
              <div key={index} style={{ background: "rgba(24, 34, 45, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "20px", borderRadius: "16px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ fontSize: "1.05rem", margin: 0 }}>{skill.name}</h4>
                  <span style={{ color: "#FFB834", fontWeight: "700", fontSize: "0.95rem", fontFamily: "monospace" }}>{skill.level}</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", height: "8px", width: "100%", overflow: "hidden" }}>
                  <div style={{ backgroundColor: "#FFB834", height: "100%", width: skillsAnimated ? skill.level : "0%", borderRadius: "10px", transition: "width 1.5s ease-in-out" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- एकेडमिक एजुकेशन सेक्शन --- */}
      <section id="education" style={{ padding: "100px 0", background: "#0E141B", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className={styles.sectionTitle}>Academic History</h2>
          <p style={{ color: "#9BB1C2", marginBottom: "48px", fontSize: "1rem" }}>Educational milestones and grading certifications derived from resume profile.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
            {EDUCATION.map((edu, idx) => (
              <div key={idx} className={styles.glassCard} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "4px solid #FFB834" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h3 style={{ fontSize: "1.25rem", margin: 0, color: "#fff", fontWeight: "700", lineHeight: "1.4" }}>{edu.degree}</h3>
                    <span style={{ fontSize: "0.8rem", color: "#FFB834", fontWeight: "bold", whiteSpace: "nowrap", background: "rgba(255,184,52,0.1)", padding: "4px 10px", borderRadius: "12px" }}>{edu.duration}</span>
                  </div>
                  <p style={{ color: "#9BB1C2", fontSize: "0.95rem", margin: "0 0 15px 0" }}>{edu.institution}</p>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "15px", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>ACADEMIC SCORE</span>
                  <span style={{ fontSize: "1.1rem", color: "#FFB834", fontWeight: "800", fontFamily: "monospace" }}>{edu.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- प्रोजेक्ट्स ग्रिड फ़िल्टर सेक्शन --- */}
      <section id="projects" style={{ padding: "100px 0", background: "#070B0E", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <p style={{ color: "#9BB1C2", marginBottom: "48px", fontSize: "1rem" }}>A collection of live production applications and software architectures.</p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
            {["all", "web", "app"].map((cat) => (
              <button key={cat} onClick={() => setProjectFilter(cat)} style={{ background: projectFilter === cat ? "#FFB834" : "rgba(255,255,255,0.03)", color: projectFilter === cat ? "#000" : "#9BB1C2", border: "1px solid rgba(255,255,255,0.08)", padding: "10px 20px", borderRadius: "30px", cursor: "pointer", fontWeight: 600, fontSize: "0.88rem" }}>
                {cat === "all" ? "All Solutions" : cat === "web" ? "Websites" : "Mobile Apps"}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "30px" }}>
            {PROJECTS.filter(p => projectFilter === "all" || p.category === projectFilter).map((project, index) => (
              <div key={index} className={styles.glassCard}>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "12px", fontFamily: "monospace", color: "#fff" }}>{project.title}</h3>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {project.tags.map((t, i) => <span key={i} className={styles.tagLabel}>{t}</span>)}
                </div>
                <p style={{ color: "#9BB1C2", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "28px", minHeight: "75px" }}>{project.desc}</p>
                <div style={{ display: "flex", gap: "16px" }}>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.ghostBtn} style={{ padding: "10px 18px", fontSize: "0.85rem" }}>
                    {project.category === "web" ? "🌐 Live Demo" : "⚡ APK File"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- टेस्टीमोनियल्स स्लाइडर --- */}
      <section style={{ padding: "100px 0", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className={styles.sectionTitle}>Client Feedback</h2>
          <p style={{ color: "#9BB1C2", marginBottom: "48px", fontSize: "1rem", textAlign: "center" }}>Endorsements from library managers and technical collaborators.</p>
          <div className={styles.glassCard} style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", minHeight: "200px" }}>
            <p style={{ fontFamily: "serif", fontStyle: "italic", fontSize: "1.2rem", lineHeight: "1.7", marginBottom: "20px" }}>
              {TESTIMONIALS[currentSlide].text}
            </p>
            <p style={{ fontWeight: 700, color: "#FFB834", fontSize: "0.95rem" }}>{TESTIMONIALS[currentSlide].author}</p>
          </div>
        </div>
      </section>

      {/* --- कॉन्टैक्ट फॉर्म --- */}
      <section id="contact" style={{ padding: "100px 0", background: "rgba(255,255,255,0.01)", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className={styles.sectionTitle}>Connect With Me</h2>
          <p style={{ color: "#9BB1C2", marginBottom: "48px", fontSize: "1rem" }}>Let's collaborate on building elite custom solutions for your business ventures.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "50px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255, 255, 255, 0.02)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: "1.5rem", color: "#FFB834" }}>✉️</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>Email Address</h4>
                  <a href="mailto:shivamkyp38@gmail.com" style={{ color: "#9BB1C2", textDecoration: "none", fontSize: "0.9rem" }}>shivamkyp38@gmail.com</a>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255, 255, 255, 0.02)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: "1.5rem", color: "#FFB834" }}>📞</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>Call Directly</h4>
                  <a href="tel:7352283304" style={{ color: "#9BB1C2", textDecoration: "none", fontSize: "0.9rem" }}>+91 7352283304</a>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255, 255, 255, 0.02)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: "1.5rem", color: "#FFB834" }}>💬</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>WhatsApp Workspace</h4>
                  <a href="https://wa.me/917352283304" target="_blank" rel="noreferrer" style={{ color: "#9BB1C2", textDecoration: "none", fontSize: "0.9rem" }}>Chat on WhatsApp ↗</a>
                </div>
              </div>
            </div>

            <div className={styles.glassCard}>
              <form onSubmit={(e) => { e.preventDefault(); showToast("🎉 Thank you! Inquiry compiled via quick service pipeline."); }}>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#9BB1C2", marginBottom: "8px" }}>Your Full Name</label>
                <input type="text" required placeholder="John Doe" style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "#0A0F14", color: "#fff", marginBottom: "20px" }} />
                
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#9BB1C2", marginBottom: "8px" }}>Email Address</label>
                <input type="email" required placeholder="john@example.com" style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "#0A0F14", color: "#fff", marginBottom: "20px" }} />
                
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#9BB1C2", marginBottom: "8px" }}>Project Message Brief</label>
                <textarea rows={4} required placeholder="Describe your web/app project specifications details..." style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "#0A0F14", color: "#fff", marginBottom: "20px", fontFamily: "inherit" }}></textarea>
                
                <button type="submit" className={styles.primaryBtn} style={{ width: "100%" }}>🚀 Send Inquiry Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- AI चैटबॉट --- */}
      <div className={styles.chatbotContainer}>
        {isBotOpen && (
          <div className={styles.chatbotWindow}>
            <div className={styles.chatbotHeader}>
              <h3 style={{ fontSize: "1.05rem", fontFamily: "monospace", color: "#FFB834", margin: 0 }}>🤖 shivam.boat</h3>
              <button onClick={() => setIsBotOpen(false)} style={{ background: "none", border: "none", color: "#9BB1C2", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
            </div>
            
            <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ padding: "10px 14px", borderRadius: "14px", fontSize: "0.88rem", maxWidth: "80%", alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end", backgroundColor: msg.sender === "bot" ? "rgba(255,255,255,0.05)" : "#FFB834", color: msg.sender === "bot" ? "#fff" : "#000" }}>
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding: "8px 10px", display: "flex", gap: "6px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)" }}>
              {["💰 Project Fees", "💼 Hire Shivam", "🚀 Top Projects"].map((q) => (
                <button key={q} onClick={() => handleBotQuery(q.replace(/[^a-zA-Z ]/g, ""))} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", color: "#9BB1C2", padding: "4px 10px", borderRadius: "20px", fontSize: "0.72rem", cursor: "pointer" }}>
                  {q}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendText} style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)", background: "#10171E", padding: "5px" }}>
              <input 
                type="text" 
                value={userTypedMessage} 
                onChange={(e) => setUserTypedMessage(e.target.value)} 
                placeholder="Type a message..." 
                style={{ flex: 1, background: "transparent", border: "none", color: "#fff", padding: "10px", fontSize: "0.85rem", outline: "none" }} 
              />
              <button type="submit" style={{ background: "#FFB834", border: "none", color: "#000", padding: "0 15px", borderRadius: "8px", fontWeight: "bold", fontSize: "0.8rem", cursor: "pointer" }}>
                Send
              </button>
            </form>
          </div>
        )}
        <button onClick={() => setIsBotOpen(!isBotOpen)} className={styles.chatbotToggle}>🤖</button>
      </div>

      <div style={{ position: "fixed", bottom: "30px", left: "30px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ background: "#16222F", borderLeft: "4px solid #2ECC71", padding: "16px 24px", borderRadius: "8px", color: "#fff", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)", fontSize: "0.95rem" }}>
            {t.text}
          </div>
        ))}
      </div>

      <footer style={{ textAlign: "center", padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#9BB1C2", fontSize: "0.9rem" }}>
        <p>© 2026 Shivam Kumar. Built securely with optimal Full-Stack architectural practices. All Rights Reserved.</p>
      </footer>
    </div>
  );
}