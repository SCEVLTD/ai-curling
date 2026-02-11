import { useState, useEffect, useRef, useCallback } from "react";

const BRAND = {
  blue: "#2563EB", blueDark: "#1D4ED8", blueLight: "#60A5FA",
  purple: "#7C3AED", purpleLight: "#A78BFA",
  green: "#10B981", orange: "#F59E0B",
  dark: "#111827", darkMid: "#1F2937",
  gray: "#6B7280", grayLight: "#9CA3AF",
  light: "#F9FAFB", white: "#FFFFFF", red: "#EF4444",
};

const STONES = [
  { id: 1, name: "Invoice Automation", emoji: "📄", color: BRAND.blue, desc: "Stop chasing paper trails" },
  { id: 2, name: "CRM Intelligence", emoji: "🧠", color: BRAND.purple, desc: "Know your customers better" },
  { id: 3, name: "AI Knowledge Base", emoji: "📚", color: BRAND.green, desc: "Answer everything, instantly" },
  { id: 4, name: "Workflow Engine", emoji: "⚡", color: BRAND.orange, desc: "Automate the boring stuff" },
  { id: 5, name: "Sales Dashboard", emoji: "📊", color: BRAND.blueLight, desc: "See what actually matters" },
];

const ZONE_SCORES = [
  { radius: 32, points: 100, label: "BULLSEYE!", color: BRAND.blue },
  { radius: 62, points: 75, label: "GREAT HIT!", color: BRAND.purple },
  { radius: 95, points: 50, label: "SOLID!", color: BRAND.green },
  { radius: 130, points: 25, label: "CLOSE!", color: BRAND.orange },
];

const MESSAGES = {
  100: ["PERFECT deployment! 🚀", "Maximum ROI! 💰", "Nailed it!"],
  75: ["Strong implementation! 💪", "Nearly perfect!", "Great accuracy!"],
  50: ["Decent start! 📈", "Room to optimise!", "Getting there!"],
  25: ["Needs fine-tuning! 🔧", "Almost on target!", "Keep sweeping!"],
  0: ["That one went rogue! 😅", "Off the ice! 🥶", "Try again!"],
};

function getMessage(p) {
  const m = MESSAGES[p] || MESSAGES[0];
  return m[Math.floor(Math.random() * m.length)];
}

const RINK_W = 370;
const RINK_H = 800;
const TARGET_X = RINK_W / 2;
const TARGET_Y = 155;
const START_X = RINK_W / 2;
const START_Y = RINK_H - 80;
const STONE_R = 22;
const MAX_POWER = 16;
const FONT = "'Open Sans','Segoe UI',system-ui,sans-serif";

function TutorialOverlay({ step, onNext, stoneColor }) {
  const steps = [
    { title: "GRAB THE STONE", desc: "Tap and hold the coloured stone at the bottom of the rink.", icon: "👆", vis: "grab" },
    { title: "DRAG BACK TO AIM", desc: "Pull away from the target. A dotted line shows direction. The further you pull, the harder the throw.", icon: "↕️", vis: "drag" },
    { title: "RELEASE & SWEEP!", desc: "Let go to launch! Then tap the ice rapidly to SWEEP — this keeps the stone sliding further and straighter. Stones collide, so use strategy!", icon: "🧹", vis: "release" },
  ];
  const s = steps[step];
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(17,24,39,0.93)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, borderRadius: "16px", padding: "24px", backdropFilter: "blur(4px)" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {steps.map((_, i) => (<div key={i} style={{ width: "32px", height: "4px", borderRadius: "2px", background: i === step ? BRAND.blue : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />))}
      </div>
      <div style={{ width: "110px", height: "110px", borderRadius: "50%", background: `radial-gradient(circle,${BRAND.blue}22,transparent)`, border: `2px solid ${BRAND.blue}44`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", position: "relative" }}>
        {s.vis === "grab" && (<><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `radial-gradient(circle at 35% 35%,${stoneColor},${stoneColor}88)`, border: "3px solid rgba(255,255,255,0.5)", animation: "tutPulse 1.5s ease-in-out infinite" }} /><div style={{ position: "absolute", bottom: "10px", right: "18px", fontSize: "28px", animation: "tutTap 1.5s ease-in-out infinite" }}>👆</div></>)}
        {s.vis === "drag" && (<><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `radial-gradient(circle at 35% 35%,${stoneColor},${stoneColor}88)`, border: "3px solid rgba(255,255,255,0.5)", animation: "tutDrag 2s ease-in-out infinite" }} /><div style={{ position: "absolute", width: "2px", height: "40px", borderLeft: `2px dashed ${BRAND.blue}`, top: "15px", left: "50%", transform: "translateX(-50%)", animation: "tutLine 2s ease-in-out infinite" }} /></>)}
        {s.vis === "release" && (<div style={{ fontSize: "40px", animation: "tutSweep 1.5s ease-in-out infinite" }}>🧹</div>)}
      </div>
      <h3 style={{ fontFamily: FONT, fontSize: "18px", fontWeight: 700, color: BRAND.white, margin: "0 0 8px", letterSpacing: "1px" }}>{s.title}</h3>
      <p style={{ fontFamily: FONT, fontSize: "14px", color: BRAND.grayLight, textAlign: "center", lineHeight: 1.6, margin: "0 0 28px", maxWidth: "270px" }}>{s.desc}</p>
      <button onClick={onNext} style={{ fontFamily: FONT, background: `linear-gradient(135deg,${BRAND.blue},${BRAND.blueDark})`, border: "none", borderRadius: "10px", padding: "12px 36px", fontSize: "15px", fontWeight: 700, color: BRAND.white, cursor: "pointer", letterSpacing: "1px", boxShadow: `0 4px 20px ${BRAND.blue}44` }}>
        {step < 2 ? "NEXT →" : "LET'S GO! 🥌"}
      </button>
    </div>
  );
}

function PowerMeter({ power, color }) {
  const pct = Math.min(power / MAX_POWER, 1);
  const c = pct > 0.8 ? BRAND.red : pct > 0.5 ? BRAND.orange : BRAND.green;
  return (
    <div style={{ position: "absolute", right: "10px", top: "60px", bottom: "60px", width: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", zIndex: 15 }}>
      <span style={{ fontFamily: FONT, fontSize: "9px", fontWeight: 700, color: BRAND.grayLight, letterSpacing: "0.5px" }}>PWR</span>
      <div style={{ flex: 1, width: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${pct * 100}%`, background: `linear-gradient(to top,${c},${color})`, borderRadius: "4px", transition: "height 0.05s", boxShadow: pct > 0.5 ? `0 0 8px ${c}66` : "none" }} />
      </div>
      <span style={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: c }}>{Math.round(pct * 100)}</span>
    </div>
  );
}

export default function AICurlingGame() {
  const [screen, setScreen] = useState("title");
  const [currentStone, setCurrentStone] = useState(0);
  const [scores, setScores] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [stonePos, setStonePos] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [lastScore, setLastScore] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sweeping, setSweeping] = useState(false);
  const [trail, setTrail] = useState([]);
  const [tutStep, setTutStep] = useState(0);
  const [showTut, setShowTut] = useState(() => !localStorage.getItem('curling_tutorial_seen'));
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem('curling_best_score') || '0'));
  const [dragPower, setDragPower] = useState(0);
  const [sweepCount, setSweepCount] = useState(0);
  const [sweepMarks, setSweepMarks] = useState([]);
  // Landed stones are now physics objects that can be knocked
  const [landed, setLanded] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  // T1+T2: Dynamic rink scaling for mobile
  const [rinkScale, setRinkScale] = useState(1);
  const animRef = useRef(null);
  const sweepRef = useRef(false);
  const posRef = useRef(null);
  const velRef = useRef(null);
  const landedRef = useRef([]);
  // DOM refs for direct manipulation during animation (avoids per-frame React re-renders)
  const stoneDomRef = useRef(null);
  const trailDomRef = useRef(null);
  // Keyboard control state
  const [aimAngle, setAimAngle] = useState(-Math.PI / 2);
  const [keyCharging, setKeyCharging] = useState(false);
  const [keyPower, setKeyPower] = useState(0);
  const chargingRef = useRef(false);
  const chargeStartRef = useRef(null);
  const chargeAnimRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  // T11: Sound system refs and state
  const audioCtxRef = useRef(null);
  const lastCollisionSoundRef = useRef(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // T12: Haptic feedback helper
  const vibrate = useCallback((pattern) => {
    try { navigator.vibrate && navigator.vibrate(pattern); } catch (_) {}
  }, []);

  // T11: Sound effects using Web Audio API (no audio files needed)
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      if (type === "throw") {
        // Quick descending tone (300hz to 150hz over 200ms), sine wave
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "sweep") {
        // Short white noise burst (50ms)
        const bufferSize = Math.floor(ctx.sampleRate * 0.05);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
        const noise = ctx.createBufferSource();
        const gain = ctx.createGain();
        noise.buffer = buffer;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        noise.connect(gain).connect(ctx.destination);
        noise.start(now);
      } else if (type === "collide") {
        // Sharp click (800hz, 30ms, square wave)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.03);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === "score") {
        // Pleasant ascending tone (400hz to 800hz over 300ms, sine wave)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "perfect") {
        // Double ascending tone for 100-point scores (two quick ascending notes)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(400, now);
        osc1.frequency.linearRampToValueAtTime(800, now + 0.15);
        gain1.gain.setValueAtTime(0.25, now);
        gain1.gain.linearRampToValueAtTime(0, now + 0.15);
        osc1.connect(gain1).connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.15);
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(600, now + 0.18);
        osc2.frequency.linearRampToValueAtTime(1200, now + 0.33);
        gain2.gain.setValueAtTime(0.3, now + 0.18);
        gain2.gain.linearRampToValueAtTime(0, now + 0.33);
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start(now + 0.18);
        osc2.stop(now + 0.33);
      }
    } catch (_) {}
  }, [soundEnabled]);

  useEffect(() => { landedRef.current = landed; }, [landed]);

  // T1+T2: Dynamically scale rink to fit viewport
  useEffect(() => {
    const updateScale = () => {
      // Available height = viewport height minus HUD (~36px) + stone label (~40px) + footer (~28px) + padding (~30px)
      const hudAndChrome = 134;
      const availH = window.innerHeight - hudAndChrome;
      const availW = window.innerWidth - 20; // 10px padding each side
      const scaleH = availH / RINK_H;
      const scaleW = availW / RINK_W;
      setRinkScale(Math.min(scaleH, scaleW, 1.6)); // scale up on large screens, cap at 1.6
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    const handleOrientation = () => setTimeout(updateScale, 100);
    window.addEventListener('orientationchange', handleOrientation);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, []);

  // T3+T5: Lock body scroll during gameplay
  useEffect(() => {
    if (screen === "play") {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
        document.documentElement.style.overflow = '';
      };
    }
  }, [screen]);

  // Detect desktop (hover-capable device) for keyboard hint
  useEffect(() => {
    try { setIsDesktop(window.matchMedia('(hover: hover)').matches); } catch (_) {}
  }, []);

  const resetStone = useCallback(() => {
    setStonePos({ x: START_X, y: START_Y });
    posRef.current = { x: START_X, y: START_Y };
    velRef.current = null;
    setAnimating(false);
    setShowResult(false);
    setLastScore(null);
    setSweeping(false);
    setTrail([]);
    // Clear DOM trail container
    if (trailDomRef.current) trailDomRef.current.innerHTML = '';
    setDragPower(0);
    setSweepCount(0);
    setSweepMarks([]);
    sweepRef.current = false;
    setAimAngle(-Math.PI / 2);
    setKeyCharging(false);
    setKeyPower(0);
    chargingRef.current = false;
    chargeStartRef.current = null;
    if (chargeAnimRef.current) { cancelAnimationFrame(chargeAnimRef.current); chargeAnimRef.current = null; }
  }, []);

  useEffect(() => { if (screen === "play") resetStone(); }, [screen, currentStone, resetStone]);

  // T13: Persist high score when reaching results screen
  useEffect(() => {
    if (screen === "results") {
      const finalScore = scores.reduce((s, x) => s + x.points, 0);
      const currentBest = parseInt(localStorage.getItem('curling_best_score') || '0');
      if (finalScore > currentBest) {
        localStorage.setItem('curling_best_score', String(finalScore));
        setBestScore(finalScore);
      }
    }
  }, [screen, scores]);

  const scaleCoord = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (RINK_W / rect.width),
      y: (e.clientY - rect.top) * (RINK_H / rect.height),
    };
  };

  const handlePointerDown = (e) => {
    if (animating || screen !== "play" || showTut) return;
    const { x, y } = scaleCoord(e);
    if (Math.hypot(x - stonePos.x, y - stonePos.y) < 75) {
      setDragging(true);
      setDragStart({ x, y });
      setDragCurrent({ x, y });
      e.preventDefault();
    }
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const c = scaleCoord(e);
    setDragCurrent(c);
    setDragPower(Math.min(Math.hypot(dragStart.x - c.x, dragStart.y - c.y) * 0.09, MAX_POWER));
    e.preventDefault();
  };

  const handlePointerUp = () => {
    if (!dragging || !dragStart || !dragCurrent) return;
    setDragging(false);
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const power = Math.min(Math.hypot(dx, dy) * 0.09, MAX_POWER);
    if (power < 1.2) { setDragStart(null); setDragCurrent(null); setDragPower(0); return; }
    const angle = Math.atan2(dy, dx);
    const vel = { x: Math.cos(angle) * power, y: Math.sin(angle) * power };
    velRef.current = vel;
    posRef.current = { ...stonePos };
    setAnimating(true);
    setDragStart(null);
    setDragCurrent(null);
    setDragPower(0);
    // T11: Play throw sound
    playSound("throw");
  };

  const handleSweep = useCallback(() => {
    if (!animating) return;
    sweepRef.current = true;
    setSweeping(true);
    setSweepCount(p => p + 1);
    // Add sweep mark at stone position
    if (posRef.current) {
      setSweepMarks(prev => [...prev.slice(-20), {
        x: posRef.current.x + (Math.random() - 0.5) * 30,
        y: posRef.current.y + (Math.random() - 0.5) * 10,
        id: Date.now() + Math.random(),
      }]);
    }
    // T11: Play sweep sound | T12: Haptic pulse
    playSound("sweep");
    vibrate(10);
    setTimeout(() => { sweepRef.current = false; setSweeping(false); }, 180);
  }, [animating, playSound, vibrate]);

  // Keyboard controls useEffect
  useEffect(() => {
    if (screen !== "play") return;

    const handleKeyDown = (e) => {
      // Ignore keyboard when tutorial or score popup is showing
      if (showTut || showResult) return;

      const key = e.key;

      // During animation: spacebar triggers sweep
      if (animating) {
        if (key === " ") {
          e.preventDefault();
          handleSweep();
        }
        return;
      }

      // Aiming phase: stone is stationary, not animating, not showing result
      if (key === "ArrowLeft") {
        e.preventDefault();
        setAimAngle(prev => prev - 0.05);
      } else if (key === "ArrowRight") {
        e.preventDefault();
        setAimAngle(prev => prev + 0.05);
      } else if ((key === " " || key === "ArrowUp") && !e.repeat) {
        e.preventDefault();
        // Start charging power
        chargingRef.current = true;
        chargeStartRef.current = performance.now();
        setKeyCharging(true);
        setKeyPower(0);
      }
    };

    const handleKeyUp = (e) => {
      if (showTut || showResult) return;
      const key = e.key;

      // Fire stone on release of charge key (only during aiming phase)
      if ((key === " " || key === "ArrowUp") && chargingRef.current && !animating) {
        e.preventDefault();
        chargingRef.current = false;
        setKeyCharging(false);

        // Calculate final power from charge duration
        const elapsed = performance.now() - chargeStartRef.current;
        const power = Math.min((elapsed / 2000) * MAX_POWER, MAX_POWER);
        chargeStartRef.current = null;

        if (power < 1.2) {
          setKeyPower(0);
          return;
        }

        // Fire in the current aim direction
        const vel = { x: Math.cos(aimAngle) * power, y: Math.sin(aimAngle) * power };
        velRef.current = vel;
        posRef.current = { ...posRef.current };
        setAnimating(true);
        setKeyPower(0);
        playSound("throw");
        vibrate(15);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [screen, showTut, showResult, animating, aimAngle, handleSweep, playSound, vibrate]);

  // Power charging animation loop
  useEffect(() => {
    if (!keyCharging) {
      if (chargeAnimRef.current) { cancelAnimationFrame(chargeAnimRef.current); chargeAnimRef.current = null; }
      return;
    }

    const animateCharge = () => {
      if (!chargingRef.current || !chargeStartRef.current) return;
      const elapsed = performance.now() - chargeStartRef.current;
      const power = Math.min((elapsed / 2000) * MAX_POWER, MAX_POWER);
      setKeyPower(power);
      chargeAnimRef.current = requestAnimationFrame(animateCharge);
    };

    chargeAnimRef.current = requestAnimationFrame(animateCharge);
    return () => {
      if (chargeAnimRef.current) { cancelAnimationFrame(chargeAnimRef.current); chargeAnimRef.current = null; }
    };
  }, [keyCharging]);

  // Main physics loop — uses direct DOM manipulation to avoid per-frame React re-renders.
  // Stone position and trail are updated via refs (stoneDomRef, trailDomRef) during animation.
  // React state is only synced once when animation ends.
  useEffect(() => {
    if (!animating || !velRef.current) return;

    let pos = { ...posRef.current };
    let vel = { ...velRef.current };
    let trailCount = 0;
    let frameCount = 0;
    const MAX_TRAIL = 50;

    // Clear any previous trail dots from DOM
    if (trailDomRef.current) {
      trailDomRef.current.innerHTML = '';
    }

    const animate = () => {
      frameCount++;
      // Friction: sweeping reduces friction significantly
      const baseFriction = 0.991;
      const sweepFriction = 0.997;
      const friction = sweepRef.current ? sweepFriction : baseFriction;

      vel.x *= friction;
      vel.y *= friction;
      pos.x += vel.x;
      pos.y += vel.y;

      // Walls
      if (pos.x < STONE_R + 4) { pos.x = STONE_R + 4; vel.x *= -0.25; }
      if (pos.x > RINK_W - STONE_R - 4) { pos.x = RINK_W - STONE_R - 4; vel.x *= -0.25; }
      if (pos.y < STONE_R + 4) { pos.y = STONE_R + 4; vel.y *= -0.25; }
      if (pos.y > RINK_H - STONE_R - 4) { pos.y = RINK_H - STONE_R - 4; vel.y *= -0.25; }

      // ── STONE COLLISIONS ──
      const currentLanded = landedRef.current;
      let updatedLanded = [...currentLanded];
      let hadCollision = false;

      for (let i = 0; i < updatedLanded.length; i++) {
        const other = updatedLanded[i];
        const dx = pos.x - other.x;
        const dy = pos.y - other.y;
        const dist = Math.hypot(dx, dy);
        const minDist = STONE_R * 2 + 4;

        if (dist < minDist && dist > 0) {
          hadCollision = true;
          // Normalise collision vector
          const nx = dx / dist;
          const ny = dy / dist;

          // Relative velocity (other stone is stationary or has its own vel)
          const otherVx = other.vx || 0;
          const otherVy = other.vy || 0;
          const dvx = vel.x - otherVx;
          const dvy = vel.y - otherVy;
          const dvDotN = dvx * nx + dvy * ny;

          if (dvDotN < 0) {
            // Elastic collision with some energy loss
            const restitution = 0.75;
            vel.x -= restitution * dvDotN * nx;
            vel.y -= restitution * dvDotN * ny;

            // Push other stone
            updatedLanded[i] = {
              ...other,
              vx: (otherVx + restitution * dvDotN * nx * 0.85),
              vy: (otherVy + restitution * dvDotN * ny * 0.85),
              moving: true,
            };
          }

          // Separate overlapping stones
          const overlap = minDist - dist;
          pos.x += nx * overlap * 0.5;
          pos.y += ny * overlap * 0.5;
          updatedLanded[i] = {
            ...updatedLanded[i],
            x: other.x - nx * overlap * 0.5,
            y: other.y - ny * overlap * 0.5,
          };
        }
      }

      // T11: Collision sound (throttled to max 1 per 100ms) | T12: Haptic thud
      if (hadCollision) {
        const nowMs = performance.now();
        if (nowMs - lastCollisionSoundRef.current > 100) {
          lastCollisionSoundRef.current = nowMs;
          playSound("collide");
          vibrate(25);
        }
      }

      // Update landed stones physics (knocked stones slide)
      for (let i = 0; i < updatedLanded.length; i++) {
        const s = updatedLanded[i];
        if (s.moving) {
          const svx = (s.vx || 0) * 0.96;
          const svy = (s.vy || 0) * 0.96;
          let sx = s.x + svx;
          let sy = s.y + svy;

          // Wall bounds for knocked stones
          if (sx < STONE_R + 4) { sx = STONE_R + 4; }
          if (sx > RINK_W - STONE_R - 4) { sx = RINK_W - STONE_R - 4; }
          if (sy < STONE_R + 4) { sy = STONE_R + 4; }
          if (sy > RINK_H - STONE_R - 4) { sy = RINK_H - STONE_R - 4; }

          // Inter-landed-stone collisions
          for (let j = 0; j < updatedLanded.length; j++) {
            if (i === j) continue;
            const o = updatedLanded[j];
            const cdx = sx - o.x;
            const cdy = sy - o.y;
            const cd = Math.hypot(cdx, cdy);
            const md = STONE_R * 2 + 4;
            if (cd < md && cd > 0) {
              const cnx = cdx / cd;
              const cny = cdy / cd;
              const sep = md - cd;
              sx += cnx * sep * 0.5;
              sy += cny * sep * 0.5;
              updatedLanded[j] = {
                ...updatedLanded[j],
                x: o.x - cnx * sep * 0.5,
                y: o.y - cny * sep * 0.5,
                vx: (o.vx || 0) + cnx * Math.hypot(svx, svy) * 0.3,
                vy: (o.vy || 0) + cny * Math.hypot(svx, svy) * 0.3,
                moving: true,
              };
            }
          }

          const speed = Math.hypot(svx, svy);
          updatedLanded[i] = {
            ...s, x: sx, y: sy,
            vx: speed < 0.08 ? 0 : svx,
            vy: speed < 0.08 ? 0 : svy,
            moving: speed >= 0.08,
          };
        }
      }

      if (hadCollision || updatedLanded.some(s => s.moving)) {
        setLanded(updatedLanded);
        landedRef.current = updatedLanded;
      }

      // Update position ref (no React re-render)
      posRef.current = { ...pos };

      // Direct DOM update for stone position (skip React reconciliation)
      if (stoneDomRef.current) {
        stoneDomRef.current.style.left = (pos.x - STONE_R - 4) + 'px';
        stoneDomRef.current.style.top = (pos.y - STONE_R - 4) + 'px';
      }

      // Direct DOM update for trail (append dot, remove old ones beyond MAX_TRAIL)
      if (trailDomRef.current) {
        const dot = document.createElement('div');
        dot.style.cssText = `position:absolute;left:${pos.x - 2}px;top:${pos.y - 2}px;width:4px;height:4px;border-radius:50%;pointer-events:none;`;
        trailDomRef.current.appendChild(dot);
        trailCount++;
        // Remove oldest dots if over limit
        while (trailDomRef.current.childNodes.length > MAX_TRAIL) {
          trailDomRef.current.removeChild(trailDomRef.current.firstChild);
        }
        // Update opacity of all trail dots (oldest=faint, newest=visible)
        const children = trailDomRef.current.childNodes;
        const total = children.length;
        for (let ci = 0; ci < total; ci++) {
          children[ci].style.opacity = ((ci + 1) / total) * 0.2;
          children[ci].style.background = STONES[currentStone].color;
        }
      }

      const speed = Math.hypot(vel.x, vel.y);
      const allStopped = !updatedLanded.some(s => s.moving);

      if (speed < 0.1 && allStopped) {
        // Sync final position to React state (one render)
        setStonePos({ ...pos });
        // Clear trail DOM and React state
        if (trailDomRef.current) trailDomRef.current.innerHTML = '';
        setTrail([]);

        // Score based on final position
        const dist = Math.hypot(pos.x - TARGET_X, pos.y - TARGET_Y);
        let points = 0, label = "OFF TARGET";
        for (const z of ZONE_SCORES) {
          if (dist <= z.radius) { points = z.points; label = z.label; break; }
        }
        setLastScore({ points, label, message: getMessage(points) });
        setScores(prev => [...prev, { stone: STONES[currentStone], points }]);

        // T11: Play score or perfect sound | T12: Haptic patterns
        if (points === 100) {
          playSound("perfect");
          vibrate([50, 30, 50, 30, 100]);
        } else {
          playSound("score");
          vibrate([50, 30, 50]);
        }

        // Add current stone to landed
        const newLanded = [...landedRef.current, {
          ...STONES[currentStone], x: pos.x, y: pos.y, points,
          vx: 0, vy: 0, moving: false,
        }];
        setLanded(newLanded);
        landedRef.current = newLanded;

        setShowResult(true);
        setAnimating(false);
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      // Clean up trail DOM on unmount/re-run
      if (trailDomRef.current) trailDomRef.current.innerHTML = '';
    };
  }, [animating, currentStone, playSound, vibrate]);

  const nextStone = () => {
    if (currentStone < STONES.length - 1) setCurrentStone(p => p + 1);
    else setScreen("results");
  };

  const totalScore = scores.reduce((s, x) => s + x.points, 0);
  const maxScore = STONES.length * 100;

  const getGrade = () => {
    const pct = totalScore / maxScore;
    if (pct >= 0.9) return { grade: "AI Grandmaster", icon: "🏆", text: "Your business is READY for full automation. Seriously impressive.", color: BRAND.blue };
    if (pct >= 0.7) return { grade: "Automation Pro", icon: "🥇", text: "Strong instincts! A few tweaks and you'd be unstoppable.", color: BRAND.purple };
    if (pct >= 0.5) return { grade: "Digital Apprentice", icon: "🥈", text: "Good foundation — time to level up your automation game.", color: BRAND.green };
    if (pct >= 0.3) return { grade: "Manual Mode", icon: "📋", text: "You're still doing things the hard way. We can fix that.", color: BRAND.orange };
    return { grade: "Spreadsheet Survivor", icon: "📉", text: "Your processes need serious help. Let's talk!", color: BRAND.red };
  };

  /* ═══ TITLE ═══ */
  if (screen === "title") {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: `linear-gradient(160deg,${BRAND.dark} 0%,#0f1a2e 50%,${BRAND.darkMid} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: BRAND.white, overflow: "hidden", position: "relative", padding: "24px", boxSizing: "border-box" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(${BRAND.blue} 1px,transparent 1px),linear-gradient(90deg,${BRAND.blue} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />

        <div style={{ fontSize: "64px", animation: "float 3s ease-in-out infinite", marginBottom: "20px", filter: `drop-shadow(0 4px 20px ${BRAND.blue}44)` }}>🥌</div>

        <h1 style={{ fontSize: "clamp(32px,7vw,48px)", fontWeight: 800, textAlign: "center", margin: "0 0 4px", background: `linear-gradient(135deg,${BRAND.blue},${BRAND.white},${BRAND.blueLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shimmer 4s linear infinite,fadeUp 0.8s ease-out", letterSpacing: "2px" }}>
          AI CURLING
        </h1>
        <h2 style={{ fontSize: "clamp(13px,3vw,16px)", fontWeight: 700, textAlign: "center", margin: "0 0 36px", color: BRAND.blue, letterSpacing: "6px", textTransform: "uppercase", animation: "fadeUp 0.8s ease-out 0.15s both" }}>
          CHAMPIONSHIP
        </h2>

        <div style={{ animation: "fadeUp 0.8s ease-out 0.3s both", textAlign: "center", maxWidth: "330px", marginBottom: "40px" }}>
          <p style={{ fontSize: "16px", lineHeight: 1.7, color: BRAND.grayLight, margin: "0 0 16px", fontWeight: 400 }}>
            Slide 5 AI automation solutions onto the ROI target. Knock opponents off position. How's your strategy?
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {[["🎯","Drag to aim"],["🚀","Release to throw"],["🧹","Tap to sweep"],["💥","Stones collide!"]].map(([ic, t], i) => (
              <div key={i} style={{ padding: "5px 12px", borderRadius: "20px", background: `${BRAND.blue}12`, border: `1px solid ${BRAND.blue}28`, fontSize: "11px", color: BRAND.blueLight, fontWeight: 600 }}>{ic} {t}</div>
            ))}
          </div>
        </div>

        {bestScore > 0 && (
          <div style={{ animation: "fadeUp 0.8s ease-out 0.4s both", marginBottom: "20px", fontSize: "13px", fontWeight: 700, color: BRAND.blue, letterSpacing: "1px" }}>
            BEST: {bestScore}/{maxScore}
          </div>
        )}

        <button onClick={() => { setScreen("play"); setCurrentStone(0); setScores([]); setLanded([]); landedRef.current = []; const seen = localStorage.getItem('curling_tutorial_seen'); setShowTut(!seen); setTutStep(0); }}
          style={{ animation: "fadeUp 0.8s ease-out 0.5s both,pulse 2.5s ease-in-out 1.3s infinite", background: `linear-gradient(135deg,${BRAND.blue},${BRAND.blueDark})`, border: "none", borderRadius: "14px", padding: "18px 56px", fontSize: "18px", fontWeight: 800, color: BRAND.white, cursor: "pointer", letterSpacing: "2px", textTransform: "uppercase", boxShadow: `0 4px 30px ${BRAND.blue}55,0 1px 0 inset rgba(255,255,255,0.15)`, fontFamily: FONT }}>
          ▶ START GAME
        </button>

        <div style={{ animation: "fadeUp 0.8s ease-out 0.7s both", marginTop: "48px", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: BRAND.gray, letterSpacing: "2px", fontWeight: 600 }}>POWERED BY</span>
            <span style={{ fontSize: "15px", fontWeight: 800, color: BRAND.blue }}>BrandedAI</span>
          </div>
          <span style={{ fontSize: "11px", color: BRAND.gray }}>AI Automation That Actually Works</span>
        </div>
      </div>
    );
  }

  /* ═══ RESULTS ═══ */
  if (screen === "results") {
    const grade = getGrade();
    const isNewBest = totalScore > 0 && totalScore >= bestScore;
    const shareText = `🥌 I scored ${totalScore}/${maxScore} in BrandedAI's AI Curling Championship!\n\nMy grade: ${grade.icon} ${grade.grade}\n\nThink you can beat me? 👇\nhttps://curling.brandedai.net/`;
    const shareUrl = "https://curling.brandedai.net/";
    const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

    const handleShare = async () => {
      // Copy to clipboard
      navigator.clipboard?.writeText(shareText);
      setToastMessage("Copied! Share on LinkedIn \uD83D\uDE80");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);

      if (canNativeShare) {
        try {
          await navigator.share({ title: "AI Curling Championship", text: shareText, url: shareUrl });
        } catch (e) {
          // User cancelled or share failed — toast already shown
        }
      } else {
        window.open("https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(shareUrl), "_blank");
      }
    };

    return (
      <div style={{ width: "100%", minHeight: "100vh", background: `linear-gradient(160deg,${BRAND.dark} 0%,#0f1a2e 50%,${BRAND.darkMid} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, color: BRAND.white, overflow: "hidden", position: "relative", padding: "32px 20px", boxSizing: "border-box" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(${BRAND.blue} 1px,transparent 1px),linear-gradient(90deg,${BRAND.blue} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />

        <h2 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px", color: BRAND.grayLight, letterSpacing: "4px", animation: "fadeUp 0.6s ease-out" }}>FINAL SCORE</h2>

        {isNewBest && (
          <div style={{ animation: "fadeUp 0.6s ease-out 0.1s both, pulse 1.5s ease-in-out infinite", fontSize: "15px", fontWeight: 800, color: "#F59E0B", letterSpacing: "1px", margin: "8px 0 0" }}>
            🎉 NEW HIGH SCORE!
          </div>
        )}

        <div style={{ animation: "fadeUp 0.6s ease-out 0.2s both", fontSize: "clamp(56px,12vw,72px)", fontWeight: 800, margin: "12px 0 4px", background: `linear-gradient(135deg,${grade.color},${BRAND.white})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {totalScore}<span style={{ fontSize: "clamp(24px,5vw,32px)" }}>/{maxScore}</span>
        </div>

        {bestScore > 0 && (
          <div style={{ animation: "fadeUp 0.6s ease-out 0.25s both", fontSize: "12px", fontWeight: 700, color: BRAND.blue, letterSpacing: "1px", marginBottom: "4px" }}>
            BEST: {bestScore}
          </div>
        )}

        <div style={{ animation: "fadeUp 0.6s ease-out 0.35s both", display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "28px" }}>{grade.icon}</span>
          <span style={{ fontSize: "20px", fontWeight: 800, color: grade.color }}>{grade.grade}</span>
        </div>

        <p style={{ animation: "fadeUp 0.6s ease-out 0.45s both", fontSize: "14px", color: BRAND.grayLight, textAlign: "center", maxWidth: "300px", marginBottom: "28px", lineHeight: 1.6 }}>{grade.text}</p>

        <div style={{ animation: "fadeUp 0.6s ease-out 0.55s both", width: "100%", maxWidth: "350px", marginBottom: "28px" }}>
          {scores.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", marginBottom: "6px", borderLeft: `4px solid ${s.stone.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>{s.stone.emoji}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#d1d5db" }}>{s.stone.name}</span>
              </div>
              <span style={{ fontSize: "18px", fontWeight: 800, color: s.points >= 75 ? BRAND.blue : s.points >= 50 ? BRAND.green : s.points >= 25 ? BRAND.orange : BRAND.gray }}>{s.points}</span>
            </div>
          ))}
        </div>

        <div style={{ animation: "fadeUp 0.6s ease-out 0.7s both", display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "320px" }}>
          <button onClick={handleShare}
            style={{ fontFamily: FONT, background: "linear-gradient(135deg,#0077B5,#005885)", border: "none", borderRadius: "12px", padding: "14px 28px", fontSize: "14px", fontWeight: 700, color: BRAND.white, cursor: "pointer" }}>
            {canNativeShare ? "\uD83D\uDCE4 Share Score" : "\uD83D\uDCCB Share on LinkedIn"}
          </button>
          <button onClick={() => { setScreen("play"); setCurrentStone(0); setScores([]); setLanded([]); landedRef.current = []; setShowTut(false); }}
            style={{ fontFamily: FONT, background: `linear-gradient(135deg,${BRAND.blue},${BRAND.blueDark})`, border: "none", borderRadius: "12px", padding: "14px 28px", fontSize: "14px", fontWeight: 700, color: BRAND.white, cursor: "pointer" }}>
            🔄 Play Again
          </button>
          <a href="https://www.brandedai.net/" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", fontFamily: FONT, background: "rgba(255,255,255,0.05)", border: `1px solid ${BRAND.blue}44`, borderRadius: "12px", padding: "14px 28px", fontSize: "14px", fontWeight: 700, color: BRAND.blue, textAlign: "center", textDecoration: "none" }}>
            🚀 Book a Free Discovery Call
          </a>
        </div>

        <div style={{ marginTop: "32px", animation: "fadeUp 0.6s ease-out 0.9s both", textAlign: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 800, color: BRAND.blue }}>BrandedAI</span><br />
          <span style={{ fontSize: "11px", color: BRAND.gray }}>AI Automation That Actually Works • brandedai.net</span>
        </div>

        {/* Toast notification */}
        <style dangerouslySetInnerHTML={{ __html: "@keyframes toastSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toastFadeOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(10px)}}" }} />
        {showToast && (
          <div style={{
            position: "fixed",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            background: BRAND.dark,
            border: `1px solid ${BRAND.blue}`,
            borderRadius: "12px",
            padding: "14px 24px",
            fontSize: "14px",
            fontWeight: 700,
            color: BRAND.white,
            fontFamily: FONT,
            boxShadow: `0 4px 24px ${BRAND.blue}44, 0 2px 8px rgba(0,0,0,0.5)`,
            zIndex: 1000,
            whiteSpace: "nowrap",
            animation: "toastSlideUp 0.3s ease-out, toastFadeOut 0.4s ease-in 2.1s forwards",
          }}>
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  /* ═══ GAME SCREEN ═══ */
  const stone = STONES[currentStone];

  return (
    <div style={{ width: "100%", height: "100dvh", maxHeight: "100dvh", overflow: "hidden", position: "fixed", inset: 0, background: `linear-gradient(160deg,${BRAND.dark} 0%,#0f1a2e 50%,${BRAND.darkMid} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, color: BRAND.white, padding: "8px 10px 16px", boxSizing: "border-box" }}>

      {/* HUD */}
      <div style={{ width: "100%", maxWidth: `${RINK_W * rinkScale}px`, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", padding: "0 2px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: BRAND.grayLight, letterSpacing: "1px" }}>STONE {currentStone + 1}/{STONES.length}</div>
        <div style={{ display: "flex", gap: "4px" }}>
          {STONES.map((s, i) => (
            <div key={i} style={{ width: "26px", height: "26px", borderRadius: "7px", background: i < currentStone ? (scores[i]?.points >= 50 ? `${BRAND.green}33` : `${BRAND.orange}33`) : i === currentStone ? `${stone.color}22` : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: i < currentStone ? "11px" : "13px", fontWeight: 800, color: i < currentStone ? (scores[i]?.points >= 50 ? BRAND.green : BRAND.orange) : i === currentStone ? stone.color : BRAND.gray, border: i === currentStone ? `2px solid ${stone.color}` : "2px solid transparent" }}>
              {i < currentStone ? scores[i]?.points : s.emoji}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ fontSize: "15px", fontWeight: 800, color: BRAND.blue, background: `${BRAND.blue}11`, padding: "3px 10px", borderRadius: "7px" }}>
            {scores.reduce((s, x) => s + x.points, 0)}
          </div>
          <button onClick={() => { const next = !soundEnabled; setSoundEnabled(next); if (next && !audioCtxRef.current) { try { audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {} } if (next && audioCtxRef.current && audioCtxRef.current.state === "suspended") { audioCtxRef.current.resume(); } }} style={{ width: "24px", height: "24px", borderRadius: "50%", background: soundEnabled ? `${BRAND.blue}22` : "rgba(255,255,255,0.06)", border: `1.5px solid ${soundEnabled ? BRAND.blue : BRAND.gray}44`, color: BRAND.white, fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }} title={soundEnabled ? "Mute" : "Unmute"}>{soundEnabled ? "\uD83D\uDD0A" : "\uD83D\uDD07"}</button>
          <button onClick={() => { setShowTut(true); setTutStep(0); }} style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: BRAND.white, fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontFamily: FONT }}>?</button>
        </div>
      </div>

      {/* Stone label */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", padding: "6px 16px", borderRadius: "10px", background: `${stone.color}10`, border: `1px solid ${stone.color}33` }}>
        <span style={{ fontSize: "20px" }}>{stone.emoji}</span>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: stone.color }}>{stone.name}</div>
          <div style={{ fontSize: "10px", color: BRAND.grayLight, fontWeight: 600 }}>{stone.desc}</div>
        </div>
      </div>

      {/* ═══ RINK ═══ */}
      {/* Rink wrapper — takes up the scaled space in layout */}
      <div style={{
        width: RINK_W * rinkScale,
        height: RINK_H * rinkScale,
        flexShrink: 0,
        position: 'relative',
      }}>
        {/* Inner rink — full virtual size, scaled via CSS transform */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={animating ? handleSweep : undefined}
          style={{
            width: RINK_W, height: RINK_H,
            transform: `scale(${rinkScale})`,
            transformOrigin: 'top left',
            background: `linear-gradient(180deg,#162a46 0%,#1a3254 20%,#1b3356 50%,#19304e 75%,#152840 100%)`,
            borderRadius: "18px", position: "relative", overflow: "hidden",
            border: `2px solid ${BRAND.blue}22`,
            boxShadow: `0 0 60px ${BRAND.blue}0a,inset 0 0 80px rgba(0,0,0,0.2)`,
            cursor: animating ? "pointer" : dragging ? "grabbing" : "default",
            touchAction: "none", userSelect: "none",
            animation: sweeping ? "sweepFlash 0.25s ease" : "none",
          }}
        >
        {/* Ice lines */}
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${5 + i * 6}%`, height: "1px", background: "rgba(255,255,255,0.02)" }} />
        ))}

        {/* Hog line (halfway mark) */}
        <div style={{ position: "absolute", left: "15%", right: "15%", top: `${(RINK_H / 2 + 40)}px`, height: "2px", background: `${BRAND.blue}18`, borderRadius: "1px" }} />
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: `${(RINK_H / 2 + 30)}px`, fontSize: "8px", fontWeight: 700, color: `${BRAND.blue}30`, letterSpacing: "3px", fontFamily: FONT }}>HOG LINE</div>

        {/* Target zones */}
        {ZONE_SCORES.slice().reverse().map((z, i) => (
          <div key={i}>
            <div style={{ position: "absolute", left: TARGET_X - z.radius, top: TARGET_Y - z.radius, width: z.radius * 2, height: z.radius * 2, borderRadius: "50%", border: `2px solid ${z.color}30`, background: `radial-gradient(circle,${z.color}08,transparent)` }} />
            <div style={{ position: "absolute", left: TARGET_X + z.radius + 6, top: TARGET_Y - 8, fontSize: "11px", fontWeight: 800, color: `${z.color}55`, fontFamily: FONT }}>{z.points}</div>
          </div>
        ))}

        {/* Crosshair */}
        <div style={{ position: "absolute", left: TARGET_X - 1, top: TARGET_Y - 35, width: "2px", height: "70px", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", left: TARGET_X - 35, top: TARGET_Y - 1, width: "70px", height: "2px", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", left: TARGET_X - 6, top: TARGET_Y - 6, width: "12px", height: "12px", borderRadius: "50%", background: BRAND.blue, boxShadow: `0 0 20px ${BRAND.blue}55` }} />
        <div style={{ position: "absolute", left: TARGET_X, top: TARGET_Y - ZONE_SCORES[3].radius - 18, transform: "translateX(-50%)", fontSize: "9px", fontWeight: 800, letterSpacing: "3px", color: `${BRAND.blue}44`, fontFamily: FONT }}>ROI TARGET</div>

        {/* Sweep marks on ice */}
        {sweepMarks.map(m => (
          <div key={m.id} style={{
            position: "absolute", left: m.x - 15, top: m.y - 3,
            width: "30px", height: "6px", borderRadius: "3px",
            background: `${BRAND.blueLight}25`,
            animation: "sweepMark 1s ease-out forwards",
            pointerEvents: "none",
          }} />
        ))}

        {/* Landed stones */}
        {landed.map((ls, i) => (
          <div key={`l-${i}`} style={{
            position: "absolute",
            left: ls.x - STONE_R + 2, top: ls.y - STONE_R + 2,
            width: (STONE_R - 2) * 2, height: (STONE_R - 2) * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%,${ls.color}cc,${ls.color}55)`,
            border: "2px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", opacity: 0.7, zIndex: 3,
            transition: ls.moving ? "none" : "all 0.1s",
          }}>{ls.emoji}</div>
        ))}

        {/* Trail — React-rendered when not animating, DOM-managed during animation */}
        {!animating && trail.map((t, i) => (
          <div key={i} style={{ position: "absolute", left: t.x - 2, top: t.y - 2, width: "4px", height: "4px", borderRadius: "50%", background: stone.color, opacity: (i / trail.length) * 0.2, pointerEvents: "none" }} />
        ))}
        {/* Trail container for direct DOM manipulation during animation */}
        <div ref={trailDomRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }} />

        {/* Current stone */}
        {stonePos && !showResult && (
          <div ref={stoneDomRef} style={{
            position: "absolute",
            left: stonePos.x - STONE_R - 4, top: stonePos.y - STONE_R - 4,
            width: (STONE_R + 4) * 2, height: (STONE_R + 4) * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%,${stone.color},${stone.color}88)`,
            border: "3px solid rgba(255,255,255,0.5)",
            boxShadow: `0 4px 24px ${stone.color}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", zIndex: 10,
            cursor: !animating ? "grab" : "default",
            transform: dragging ? "scale(1.12)" : "scale(1)",
            transition: animating ? "none" : "transform 0.15s",
            animation: !animating && !dragging ? "stonePulse 2s ease-in-out infinite" : "none",
          }}>{stone.emoji}</div>
        )}

        {/* Drag aim line */}
        {dragging && dragStart && dragCurrent && (
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 8 }}>
            <line x1={stonePos.x} y1={stonePos.y}
              x2={stonePos.x + (dragStart.x - dragCurrent.x) * 1.5}
              y2={stonePos.y + (dragStart.y - dragCurrent.y) * 1.5}
              stroke={stone.color} strokeWidth="2.5" strokeDasharray="8 5" opacity="0.7" />
            <circle
              cx={stonePos.x + (dragStart.x - dragCurrent.x) * 1.5}
              cy={stonePos.y + (dragStart.y - dragCurrent.y) * 1.5}
              r="8" fill="none" stroke={stone.color} strokeWidth="2" opacity="0.4" />
          </svg>
        )}

        {/* Keyboard aim line (shown when not dragging, not animating, not showing result) */}
        {!dragging && !animating && !showResult && !showTut && stonePos && (
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 8 }}>
            <line x1={stonePos.x} y1={stonePos.y}
              x2={stonePos.x + Math.cos(aimAngle) * (keyCharging ? Math.max(keyPower * 12, 60) : 120)}
              y2={stonePos.y + Math.sin(aimAngle) * (keyCharging ? Math.max(keyPower * 12, 60) : 120)}
              stroke={stone.color} strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
            <circle
              cx={stonePos.x + Math.cos(aimAngle) * (keyCharging ? Math.max(keyPower * 12, 60) : 120)}
              cy={stonePos.y + Math.sin(aimAngle) * (keyCharging ? Math.max(keyPower * 12, 60) : 120)}
              r="6" fill="none" stroke={stone.color} strokeWidth="1.5" opacity="0.35" />
          </svg>
        )}

        {/* Power meter (drag or keyboard charging) */}
        {dragging && <PowerMeter power={dragPower} color={stone.color} />}
        {keyCharging && <PowerMeter power={keyPower} color={stone.color} />}

        {/* Sweep prompt */}
        {animating && (
          <div style={{
            position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
            padding: "10px 20px", borderRadius: "12px",
            background: sweeping ? `${BRAND.blue}33` : "rgba(255,255,255,0.06)",
            border: sweeping ? `2px solid ${BRAND.blue}` : "2px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: "8px",
            pointerEvents: "none", fontFamily: FONT,
          }}>
            <span style={{ fontSize: "18px", animation: sweeping ? "broomSwing 0.2s ease infinite" : "none" }}>🧹</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: sweeping ? BRAND.blue : BRAND.grayLight, letterSpacing: "0.5px" }}>
              {sweeping ? "SWEEPING!" : "TAP ICE TO SWEEP!"}
            </span>
            {sweepCount > 0 && (
              <span style={{ fontSize: "12px", fontWeight: 800, color: BRAND.blueLight, background: `${BRAND.blue}22`, padding: "2px 8px", borderRadius: "8px" }}>
                ×{sweepCount}
              </span>
            )}
          </div>
        )}

        {/* Start hint */}
        {!animating && !showResult && !dragging && !showTut && (
          <div style={{ position: "absolute", bottom: START_Y - STONE_R - 55, left: "50%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: "20px", marginBottom: "4px", animation: "float 1.5s ease-in-out infinite" }}>👆</div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: BRAND.grayLight, letterSpacing: "1px", fontFamily: FONT, whiteSpace: "nowrap" }}>DRAG THE STONE TO AIM</div>
            {isDesktop && (
              <div style={{ fontSize: "10px", fontWeight: 600, color: BRAND.gray, marginTop: "4px", letterSpacing: "0.5px", fontFamily: FONT }}>Arrow keys + Space</div>
            )}
          </div>
        )}

        {/* Tutorial */}
        {showTut && (
          <TutorialOverlay step={tutStep} stoneColor={stone.color}
            onNext={() => { if (tutStep < 2) setTutStep(p => p + 1); else { localStorage.setItem('curling_tutorial_seen', 'true'); setShowTut(false); } }} />
        )}

        {/* Score popup */}
        {showResult && lastScore && (
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", animation: "popIn 0.5s ease-out forwards", zIndex: 50 }}>
            <div style={{ background: `${BRAND.dark}dd`, borderRadius: "20px", padding: "20px 28px", border: `2px solid ${lastScore.points >= 50 ? BRAND.blue : BRAND.orange}44`, boxShadow: "0 12px 48px rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: BRAND.grayLight, letterSpacing: "2px", marginBottom: "4px" }}>{lastScore.label}</div>
              <div style={{ fontSize: "40px", fontWeight: 800, margin: "8px 0", color: lastScore.points >= 75 ? BRAND.blue : lastScore.points >= 50 ? BRAND.green : lastScore.points >= 25 ? BRAND.orange : BRAND.gray }}>+{lastScore.points}</div>
              <div style={{ fontSize: "14px", color: BRAND.grayLight, marginBottom: "20px", fontWeight: 600 }}>{lastScore.message}</div>
              <button onClick={nextStone} style={{ fontFamily: FONT, background: `linear-gradient(135deg,${BRAND.blue},${BRAND.blueDark})`, border: "none", borderRadius: "12px", padding: "12px 32px", fontSize: "14px", fontWeight: 800, color: BRAND.white, cursor: "pointer", letterSpacing: "1px", boxShadow: `0 4px 16px ${BRAND.blue}44` }}>
                {currentStone < STONES.length - 1 ? "NEXT STONE →" : "SEE RESULTS 🏆"}
              </button>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: 800, color: BRAND.blue }}>BrandedAI</span>
        <span style={{ color: BRAND.gray }}>•</span>
        <span style={{ fontSize: "11px", color: BRAND.gray, fontWeight: 600 }}>brandedai.net</span>
      </div>
    </div>
  );
}
