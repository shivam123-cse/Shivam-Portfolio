"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CinematicLayer from "./CinematicLayer";
import styles from "./VideoIntro.module.css";

export default function VideoIntro() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);

  const containerRef = useRef(null);
  const foregroundVideoRef = useRef(null);
  const ambientVideoRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const textElementsRef = useRef([]);

  // Auto-hide sound hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSoundHint(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Synchronize video controls
  const togglePlay = () => {
    if (isPlaying) {
      foregroundVideoRef.current?.pause();
      ambientVideoRef.current?.pause();
    } else {
      foregroundVideoRef.current?.play().catch(() => {});
      ambientVideoRef.current?.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (foregroundVideoRef.current) {
      foregroundVideoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
    if (showSoundHint) setShowSoundHint(false);
  };

  const scrollToNextSection = () => {
    gsap.to(window, {
      scrollTo: window.innerHeight,
      duration: 1.2,
      ease: "power3.inOut",
    });
  };

  // Premium GSAP entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Container fade in
    gsap.to(containerRef.current, { opacity: 1, duration: 1 });

    // Text stagger animation
    tl.fromTo(
      textElementsRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.12, delay: 0.4 },
      0
    );

    // Scroll indicator pulse
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0.6,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }, []);

  const addToRefs = (el) => {
    if (el && !textElementsRef.current.includes(el)) {
      textElementsRef.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className={styles.heroContainer}>
      {/* Ambient Background Layer (Blurred Duplicate) */}
      <div className={styles.ambientWrapper}>
        <video
          ref={ambientVideoRef}
          className={styles.ambientVideo}
          src="/assets/talking-head.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Cinematic Gradient Overlays */}
      <div className={styles.vignetteOverlay} />
      <div className={styles.gradientBottom} />

      {/* Three.js Particle Layer */}
      <CinematicLayer />

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Foreground Video Window */}
        <div className={styles.videoWindowFrame}>
          <video
            ref={foregroundVideoRef}
            className={styles.mainVideo}
            src="/assets/talking-head.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />
        </div>

        {/* Portfolio Text Content */}
        <div className={styles.textContent}>
          <span ref={addToRefs} className={styles.tagline}>
            PREMIUM PORTFOLIO DIRECTORY
          </span>
          <h1 ref={addToRefs} className={styles.giantTitle}>
            SHIVAM <br /> <span className={styles.accentText}>KUMAR</span>
          </h1>
          <p ref={addToRefs} className={styles.subtitle}>
            Creative developer specializing in interactive experiences, immersive web technologies, and premium motion design that captivates and inspires.
          </p>
        </div>
      </div>

      {/* Glassmorphism Controls */}
      <div className={styles.controlsContainer}>
        {showSoundHint && (
          <div className={styles.soundHint} onClick={toggleMute}>
            <span>TAP FOR SOUND</span>
            <div className={styles.pulseDot} />
          </div>
        )}

        <div className={styles.glassControlGroup}>
          <button 
            onClick={togglePlay} 
            aria-label={isPlaying ? "Pause Video" : "Play Video"} 
            className={styles.controlBtn}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          <button 
            onClick={toggleMute} 
            aria-label={isMuted ? "Unmute Sound" : "Mute Sound"} 
            className={styles.controlBtn}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM4 9v6h4l5 5V4L8 9H4zm12.5 3c0 2.97-1.9 5.5-4.5 6.5v2c3.71-1.04 6.5-4.44 6.5-8.5s-2.79-7.46-6.5-8.5v2c2.6 1 4.5 3.53 4.5 6.5z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef} 
        className={styles.scrollIndicator} 
        onClick={scrollToNextSection}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            scrollToNextSection();
          }
        }}
      >
        <span className={styles.scrollLabel}>EXPLORE</span>
        <div className={styles.pulseLine} />
      </div>
    </section>
  );
}