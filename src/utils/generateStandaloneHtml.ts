export function getStandaloneHtml(customGifUrl?: string): string {
  const gifUrl = customGifUrl || 'https://i.pinimg.com/originals/9c/41/96/9c419620fb275cf5ab408b6485d438e5.jpg';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>A Special Question for You 💕</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-cream: #FFFDF9;
      --blush-100: #FFE4E6;
      --blush-200: #FECDD3;
      --blush-500: #F43F5E;
      --blush-600: #E11D48;
      --peach-100: #FFEDD5;
      --peach-500: #FB923C;
      --text-main: #4A3B32;
      --text-muted: #8C7A70;
      --card-bg: rgba(255, 255, 255, 0.94);
      --card-border: rgba(254, 205, 211, 0.7);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: var(--text-main);
      background: linear-gradient(135deg, #FFF8F3 0%, #FEECE9 25%, #FDE2E4 50%, #FFF3EC 75%, #FFFDF8 100%);
      background-size: 300% 300%;
      animation: gentleShift 16s ease infinite;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-x: hidden;
      position: relative;
    }

    @keyframes gentleShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* Floating background hearts */
    .floating-hearts-container {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    }

    .heart-particle {
      position: absolute;
      bottom: -40px;
      opacity: 0;
      animation: floatUp linear infinite;
      user-select: none;
    }

    @keyframes floatUp {
      0% {
        transform: translateY(0) scale(0.8) rotate(0deg);
        opacity: 0;
      }
      15% { opacity: 0.55; }
      85% { opacity: 0.65; }
      100% {
        transform: translateY(-110vh) translateX(var(--drift)) scale(1.1) rotate(var(--rot));
        opacity: 0;
      }
    }

    /* Floating Balloons */
    .floating-balloon {
      position: absolute;
      bottom: -130px;
      user-select: none;
      pointer-events: none;
      opacity: 0;
      animation: floatBalloon linear infinite;
    }

    @keyframes floatBalloon {
      0% {
        transform: translateY(0);
        opacity: 0;
      }
      8% { opacity: 0.95; }
      90% { opacity: 0.95; }
      100% {
        transform: translateY(-135vh) translateX(var(--drift));
        opacity: 0;
      }
    }

    @keyframes balloonSway {
      0%, 100% {
        transform: rotate(-4deg) translateX(-6px);
      }
      50% {
        transform: rotate(4deg) translateX(6px);
      }
    }

    .balloon-sway {
      animation: balloonSway ease-in-out infinite alternate;
      transform-origin: bottom center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .balloon-body {
      width: 74px;
      height: 92px;
      border-radius: 50% 50% 50% 50% / 44% 44% 56% 56%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 18px -2px rgba(244, 63, 94, 0.28), inset -3px -3px 8px rgba(0,0,0,0.1);
    }

    .balloon-body::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 10px;
      width: 16px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.1));
      transform: rotate(-25deg);
      pointer-events: none;
    }

    .balloon-text {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      font-size: 13px;
      line-height: 1;
      text-shadow: 0 1px 2px rgba(0,0,0,0.18);
      letter-spacing: 0.03em;
    }

    .balloon-knot {
      width: 10px;
      height: 7px;
      clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
      margin-top: -1px;
    }

    .balloon-string {
      margin-top: -1px;
      opacity: 0.7;
    }

    /* Floating Music Play/Pause Button */
    .music-widget {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
      user-select: none;
    }

    .music-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid rgba(244, 63, 94, 0.35);
      background: rgba(255, 255, 255, 0.95);
      color: #372A23;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 14px rgba(244, 63, 94, 0.16);
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .music-btn:hover {
      box-shadow: 0 6px 18px rgba(244, 63, 94, 0.25);
      transform: translateY(-1px);
    }

    .music-btn.is-playing {
      background: #F43F5E;
      color: #FFFFFF;
      border-color: #E11D48;
      box-shadow: 0 6px 20px rgba(244, 63, 94, 0.35);
    }

    .music-waves {
      display: none;
      align-items: flex-end;
      gap: 2px;
      height: 10px;
      margin-left: 2px;
    }

    .music-btn.is-playing .music-waves {
      display: inline-flex;
    }

    .music-waves span {
      width: 2px;
      background: #FFFFFF;
      border-radius: 2px;
      animation: wave 0.8s ease-in-out infinite alternate;
    }
    .music-waves span:nth-child(1) { height: 6px; animation-delay: 0.1s; }
    .music-waves span:nth-child(2) { height: 10px; animation-delay: 0.3s; }
    .music-waves span:nth-child(3) { height: 5px; animation-delay: 0.2s; }

    @keyframes wave {
      0% { height: 3px; }
      100% { height: 10px; }
    }

    /* Romantic Photo Showcase Styles */
    .photo-showcase-section {
      width: 100%;
      max-width: 860px;
      margin: 32px auto 20px auto;
      z-index: 10;
      position: relative;
    }

    .photo-showcase-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .photo-showcase-header h2 {
      font-size: 20px;
      font-weight: 700;
      color: #372A23;
      margin: 4px 0;
    }

    .photo-showcase-header p {
      font-size: 12px;
      color: #7C685B;
    }

    .photo-grid {
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: 16px;
    }

    @media (min-width: 640px) {
      .photo-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (min-width: 840px) {
      .photo-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    .polaroid-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(244, 63, 94, 0.15);
      border-radius: 20px;
      padding: 12px;
      box-shadow: 0 10px 24px -6px rgba(244, 63, 94, 0.08);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      flex-col: column;
      flex-direction: column;
      justify-content: space-between;
    }

    .polaroid-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 32px -4px rgba(244, 63, 94, 0.16);
      border-color: rgba(244, 63, 94, 0.35);
    }

    .polaroid-img-frame {
      position: relative;
      aspect-ratio: 4 / 5;
      width: 100%;
      border-radius: 14px;
      overflow: hidden;
      background: #FDF2F4;
    }

    .polaroid-img-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .polaroid-card:hover .polaroid-img-frame img {
      transform: scale(1.04);
    }

    .polaroid-info {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
    }

    .polaroid-title {
      font-size: 13px;
      font-weight: 700;
      color: #372A23;
    }

    .polaroid-tag {
      font-size: 10px;
      font-weight: 600;
      color: #E11D48;
      margin-top: 2px;
    }

    .polaroid-quote {
      font-size: 11px;
      font-style: italic;
      color: #5C4B40;
      line-height: 1.45;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(244, 63, 94, 0.12);
    }

    /* Flanking Sparkle & Glitter Layout */
    .ask-sparkle-container {
      width: 100%;
      max-width: 1060px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      position: relative;
      z-index: 10;
    }

    .side-sparkle-cluster {
      display: none;
      width: 220px;
      height: 420px;
      position: relative;
      pointer-events: none;
      user-select: none;
      flex-shrink: 0;
    }

    @media (min-width: 860px) {
      .side-sparkle-cluster {
        display: block;
      }
    }

    .sparkle-aura {
      position: absolute;
      width: 180px;
      height: 180px;
      border-radius: 9999px;
      filter: blur(40px);
      opacity: 0.6;
      animation: auraPulse 5s ease-in-out infinite;
    }

    .sparkle-aura-left {
      top: 120px;
      right: 10px;
      background: radial-gradient(circle, rgba(254, 205, 211, 0.7) 0%, rgba(254, 240, 138, 0.35) 60%, transparent 100%);
    }

    .sparkle-aura-right {
      top: 120px;
      left: 10px;
      background: radial-gradient(circle, rgba(253, 230, 138, 0.6) 0%, rgba(251, 207, 232, 0.45) 60%, transparent 100%);
    }

    @keyframes auraPulse {
      0%, 100% { transform: scale(0.9); opacity: 0.45; }
      50% { transform: scale(1.15); opacity: 0.75; }
    }

    @keyframes twinkleStar {
      0%, 100% { transform: scale(0.7) rotate(0deg); opacity: 0.35; }
      50% { transform: scale(1.25) rotate(90deg); opacity: 1; }
    }

    @keyframes floatMote {
      0%, 100% { transform: translateY(0); opacity: 0.3; }
      50% { transform: translateY(-16px); opacity: 0.95; }
    }

    @keyframes floatHeartSide {
      0%, 100% { transform: translateY(0) rotate(-6deg); }
      50% { transform: translateY(-14px) rotate(8deg); }
    }

    .side-whisper-pill {
      position: absolute;
      bottom: 24px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(244, 63, 94, 0.18);
      box-shadow: 0 4px 12px rgba(244, 63, 94, 0.08);
      font-size: 11px;
      font-style: italic;
      color: #9F1239;
      animation: floatMote 4.5s ease-in-out infinite;
    }

    .side-sparkle-left .side-whisper-pill {
      right: 12px;
    }

    .side-sparkle-right .side-whisper-pill {
      left: 12px;
    }

    /* Main Container Cards */
    .app-card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--card-border);
      border-radius: 28px;
      box-shadow: 0 16px 36px -8px rgba(244, 63, 94, 0.12), 0 4px 16px rgba(0, 0, 0, 0.03);
      width: 100%;
      max-width: 480px;
      padding: 32px 24px;
      text-align: center;
      position: relative;
      z-index: 10;
      transition: all 0.3s ease;
    }

    @media (min-width: 640px) {
      .app-card {
        padding: 40px 36px;
        border-radius: 32px;
      }
    }

    /* Image / GIF container */
    .gif-frame {
      width: 140px;
      height: 140px;
      margin: 0 auto 20px auto;
      border-radius: 24px;
      overflow: hidden;
      border: 2px solid #FFE4E6;
      box-shadow: 0 8px 20px rgba(244, 114, 182, 0.15);
      background: #FFF5F5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (min-width: 640px) {
      .gif-frame {
        width: 160px;
        height: 160px;
      }
    }

    .gif-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px;
      border-radius: 999px;
      background: #FFF1F2;
      border: 1px solid #FFE4E6;
      color: #E11D48;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
      letter-spacing: 0.02em;
    }

    h1, h2 {
      font-family: 'Playfair Display', Georgia, serif;
      color: #2D221C;
      line-height: 1.35;
    }

    .headline {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 28px;
      color: #372A23;
    }

    @media (min-width: 640px) {
      .headline {
        font-size: 23px;
      }
    }

    /* Buttons row */
    .button-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      position: relative;
      min-height: 56px;
    }

    .btn {
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      padding: 13px 30px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.2s;
      outline: none;
      user-select: none;
    }

    .btn:active {
      transform: scale(0.96);
    }

    .btn-yes {
      background: linear-gradient(135deg, #F43F5E 0%, #FB7185 100%);
      color: #FFFFFF;
      box-shadow: 0 8px 20px rgba(244, 63, 94, 0.35);
    }

    .btn-yes:hover {
      box-shadow: 0 10px 24px rgba(244, 63, 94, 0.45);
      transform: translateY(-1px);
    }

    .btn-no {
      background: rgba(255, 255, 255, 0.9);
      color: #78665B;
      border: 1px solid #E7D7CE;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      white-space: nowrap;
    }

    .btn-no.is-evading {
      position: fixed;
      z-index: 9999;
      box-shadow: 0 12px 28px rgba(244, 63, 94, 0.25);
      border-color: #FDA4AF;
      animation: popBounce 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes popBounce {
      0% { transform: scale(0.85); }
      70% { transform: scale(1.08); }
      100% { transform: scale(1); }
    }

    /* Form Card Styles */
    .form-section {
      text-align: left;
      margin-bottom: 20px;
    }

    .form-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      color: #372A23;
      margin-bottom: 8px;
    }

    .form-sublabel {
      font-size: 11px;
      color: #E11D48;
      font-weight: 500;
      background: #FFF1F2;
      padding: 2px 8px;
      border-radius: 6px;
    }

    /* Quick Date Chips */
    .dates-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 2px 10px 2px;
      scrollbar-width: thin;
      scrollbar-color: #FECDD3 transparent;
      -webkit-overflow-scrolling: touch;
    }

    .date-chip {
      flex-shrink: 0;
      min-width: 64px;
      padding: 10px 6px;
      border-radius: 16px;
      border: 1px solid #E7D7CE;
      background: #FFFDFB;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .date-chip .day-name {
      font-size: 10px;
      text-transform: uppercase;
      color: #8C7A70;
      font-weight: 600;
    }

    .date-chip .day-num {
      font-size: 16px;
      font-weight: 700;
      color: #372A23;
      margin: 2px 0;
    }

    .date-chip .month-name {
      font-size: 10px;
      color: #8C7A70;
    }

    .date-chip.active {
      background: linear-gradient(180deg, #F43F5E 0%, #E11D48 100%);
      border-color: #E11D48;
      box-shadow: 0 6px 16px rgba(225, 29, 72, 0.3);
      transform: scale(1.05);
    }

    .date-chip.active .day-name,
    .date-chip.active .day-num,
    .date-chip.active .month-name {
      color: #FFFFFF;
    }

    .native-date-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 6px;
      background: #FFF8F6;
      border: 1px solid #FFE4E6;
      border-radius: 12px;
      padding: 8px 12px;
    }

    .native-date-row span {
      font-size: 12px;
      color: #5F4F46;
    }

    .native-date-input {
      font-family: inherit;
      font-size: 12px;
      padding: 5px 8px;
      border-radius: 8px;
      border: 1px solid #E5D5CB;
      background: #FFFFFF;
      color: #372A23;
      outline: none;
    }

    .text-input, textarea {
      width: 100%;
      font-family: inherit;
      font-size: 14px;
      padding: 12px 14px;
      border-radius: 16px;
      border: 1px solid #E5D5CB;
      background: #FFFDFB;
      color: #372A23;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      resize: none;
    }

    .text-input:focus, textarea:focus {
      border-color: #F43F5E;
      box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.15);
      background: #FFFFFF;
    }

    /* Suggestion pills */
    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .pill-btn {
      background: #FFF1F2;
      border: 1px solid #FFE4E6;
      color: #9F1239;
      font-size: 11px;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 999px;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s;
    }

    .pill-btn:hover {
      background: #FFE4E6;
    }

    .pill-btn:active {
      transform: scale(0.97);
    }

    /* Ticket / Confirmation */
    .ticket {
      background: linear-gradient(135deg, #FFF5F5 0%, #FFF8F3 100%);
      border: 1px dashed #FDA4AF;
      border-radius: 20px;
      padding: 20px;
      text-align: left;
      margin: 20px 0;
    }

    .ticket-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }

    .ticket-row:last-child {
      margin-bottom: 0;
    }

    .ticket-icon {
      font-size: 18px;
      line-height: 1;
    }

    .ticket-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      color: #E11D48;
      letter-spacing: 0.05em;
    }

    .ticket-val {
      font-size: 15px;
      font-weight: 700;
      color: #2D221C;
    }

    .action-row {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 18px;
    }

    @media (min-width: 480px) {
      .action-row {
        flex-direction: row;
      }
    }

    .btn-whatsapp {
      flex: 1;
      background: #10B981;
      color: #FFFFFF;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
    }

    .btn-whatsapp:hover {
      background: #059669;
    }

    .btn-copy {
      flex: 1;
      background: #F3ECE7;
      color: #4A3B32;
    }

    .btn-copy:hover {
      background: #E8DDD6;
    }

    .link-edit {
      display: inline-block;
      margin-top: 16px;
      font-size: 12px;
      color: #8C7A70;
      text-decoration: underline;
      cursor: pointer;
      background: none;
      border: none;
      font-family: inherit;
    }

    .link-edit:hover {
      color: #E11D48;
    }

    /* Canvas for heart burst */
    #heart-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9998;
    }

    .hidden {
      display: none !important;
    }
  </style>
</head>
<body>

  <!-- Floating hearts container -->
  <div class="floating-hearts-container" id="floating-hearts"></div>

  <!-- Floating Srija balloons container -->
  <div class="floating-hearts-container" id="floating-balloons"></div>

  <!-- Hidden YouTube Music Player Container (embedded across all screens) -->
  <div id="yt-player" style="position:fixed; bottom:-999px; right:-999px; width:4px; height:4px; opacity:0; pointer-events:none; overflow:hidden;"></div>

  <!-- Floating Play/Pause Button -->
  <div class="music-widget">
    <button type="button" class="music-btn is-playing" id="music-btn" title="Pause or play background song">
      <span id="music-icon">⏸️</span>
      <span id="music-label">Pause Song</span>
      <span class="music-waves">
        <span></span><span></span><span></span>
      </span>
    </button>
  </div>

  <!-- Burst canvas -->
  <canvas id="heart-canvas"></canvas>

  <!-- STEP 1: Main Ask Section with Flanking Romantic Sparkles -->
  <div class="ask-sparkle-container" id="ask-sparkle-wrap">
    <!-- Left Romantic Sparkles & Stardust -->
    <div class="side-sparkle-cluster side-sparkle-left" aria-hidden="true">
      <div class="sparkle-aura sparkle-aura-left"></div>

      <!-- Constellation Trail SVG -->
      <svg style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none;" viewBox="0 0 220 420">
        <path d="M 40,40 Q 150,110 70,210 T 130,370" fill="none" stroke="rgba(244,63,94,0.3)" stroke-width="1.8" stroke-dasharray="4 6" stroke-linecap="round" />
        <circle cx="40" cy="40" r="3" fill="#FBBF24" />
        <circle cx="105" cy="160" r="2.5" fill="#FB7185" />
        <circle cx="70" cy="210" r="3" fill="#F59E0B" />
        <circle cx="130" cy="370" r="2.5" fill="#EC4899" />
      </svg>

      <!-- Twinkling 4-Point Stars -->
      <svg style="position:absolute; left:30px; top:50px; width:26px; height:26px; animation: twinkleStar 2.8s ease-in-out infinite;" viewBox="0 0 24 24" fill="#FB7185">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>
      <svg style="position:absolute; right:35px; top:80px; width:18px; height:18px; animation: twinkleStar 3.2s ease-in-out infinite 0.7s;" viewBox="0 0 24 24" fill="#F59E0B">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>
      <svg style="position:absolute; left:60px; top:180px; width:28px; height:28px; animation: twinkleStar 2.6s ease-in-out infinite 1.2s;" viewBox="0 0 24 24" fill="#F43F5E">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>
      <svg style="position:absolute; right:25px; top:230px; width:20px; height:20px; animation: twinkleStar 3.4s ease-in-out infinite 0.4s;" viewBox="0 0 24 24" fill="#FBBF24">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>
      <svg style="position:absolute; left:80px; top:310px; width:22px; height:22px; animation: twinkleStar 3.0s ease-in-out infinite 1.5s;" viewBox="0 0 24 24" fill="#EC4899">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>

      <!-- Floating Fairy Hearts -->
      <div style="position:absolute; left:90px; top:110px; font-size:16px; animation: floatHeartSide 4.2s ease-in-out infinite; filter: drop-shadow(0 0 6px rgba(244,63,94,0.5));">💖</div>
      <div style="position:absolute; left:30px; top:260px; font-size:18px; animation: floatHeartSide 3.8s ease-in-out infinite 1.4s; filter: drop-shadow(0 0 6px rgba(244,63,94,0.5));">💕</div>

      <!-- Shimmering Stardust Motes -->
      <div style="position:absolute; left:45px; top:130px; width:6px; height:6px; border-radius:50%; background:#FBBF24; box-shadow:0 0 8px #F59E0B; animation: floatMote 3.2s ease-in-out infinite 0.3s;"></div>
      <div style="position:absolute; right:50px; top:160px; width:5px; height:5px; border-radius:50%; background:#FDA4AF; box-shadow:0 0 8px #F43F5E; animation: floatMote 2.8s ease-in-out infinite 0.9s;"></div>
      <div style="position:absolute; left:70px; top:220px; width:7px; height:7px; border-radius:50%; background:#FDE047; box-shadow:0 0 8px #FBBF24; animation: floatMote 3.5s ease-in-out infinite 1.1s;"></div>
      <div style="position:absolute; right:40px; top:290px; width:5px; height:5px; border-radius:50%; background:#FB7185; box-shadow:0 0 8px #E11D48; animation: floatMote 3.0s ease-in-out infinite 0.6s;"></div>

      <!-- Whisper pill -->
      <div class="side-whisper-pill">
        <span>✨</span>
        <span>Warm heartbeats</span>
        <span>💖</span>
      </div>
    </div>

    <!-- Main Ask Card -->
    <div class="app-card" id="card-ask">
      <div class="badge">
        <span>✨ A Question For Srija 🌸</span>
      </div>

      <!-- Cute placeholder / GIF -->
      <div class="gif-frame">
        <img
          id="date-gif"
          src="${gifUrl}"
          alt="Cute shy character"
          loading="eager"
        />
      </div>

      <h1 class="headline">
        "I've really enjoyed all our conversations lately, and I was wondering... would you like to go on a date with me?"
      </h1>

      <div class="button-group">
        <button type="button" class="btn btn-yes" id="yes-btn">
          <span>Yes</span>
          <span>💕</span>
        </button>

        <button type="button" class="btn btn-no" id="no-btn">
          <span id="no-label">No</span>
        </button>
      </div>
    </div>

    <!-- Right Romantic Sparkles & Stardust -->
    <div class="side-sparkle-cluster side-sparkle-right" aria-hidden="true">
      <div class="sparkle-aura sparkle-aura-right"></div>

      <!-- Constellation Trail SVG -->
      <svg style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none;" viewBox="0 0 220 420">
        <path d="M 180,40 Q 70,110 150,210 T 90,370" fill="none" stroke="rgba(245,158,11,0.3)" stroke-width="1.8" stroke-dasharray="4 6" stroke-linecap="round" />
        <circle cx="180" cy="40" r="3" fill="#FB7185" />
        <circle cx="115" cy="160" r="2.5" fill="#FBBF24" />
        <circle cx="150" cy="210" r="3" fill="#F43F5E" />
        <circle cx="90" cy="370" r="2.5" fill="#F59E0B" />
      </svg>

      <!-- Twinkling 4-Point Stars -->
      <svg style="position:absolute; right:30px; top:45px; width:26px; height:26px; animation: twinkleStar 3.0s ease-in-out infinite 0.5s;" viewBox="0 0 24 24" fill="#F43F5E">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>
      <svg style="position:absolute; left:35px; top:85px; width:18px; height:18px; animation: twinkleStar 2.7s ease-in-out infinite 1.1s;" viewBox="0 0 24 24" fill="#FBBF24">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>
      <svg style="position:absolute; right:55px; top:185px; width:28px; height:28px; animation: twinkleStar 3.3s ease-in-out infinite 0.2s;" viewBox="0 0 24 24" fill="#F59E0B">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>
      <svg style="position:absolute; left:25px; top:225px; width:20px; height:20px; animation: twinkleStar 2.9s ease-in-out infinite 1.6s;" viewBox="0 0 24 24" fill="#EC4899">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>
      <svg style="position:absolute; right:85px; top:315px; width:22px; height:22px; animation: twinkleStar 3.1s ease-in-out infinite 0.8s;" viewBox="0 0 24 24" fill="#FB7185">
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"/>
      </svg>

      <!-- Floating Fairy Hearts -->
      <div style="position:absolute; left:40px; top:120px; font-size:16px; animation: floatHeartSide 4.0s ease-in-out infinite 0.8s; filter: drop-shadow(0 0 6px rgba(244,63,94,0.5));">💖</div>
      <div style="position:absolute; right:35px; top:265px; font-size:18px; animation: floatHeartSide 4.3s ease-in-out infinite 0.3s; filter: drop-shadow(0 0 6px rgba(244,63,94,0.5));">💕</div>

      <!-- Shimmering Stardust Motes -->
      <div style="position:absolute; right:45px; top:125px; width:6px; height:6px; border-radius:50%; background:#FDE047; box-shadow:0 0 8px #F59E0B; animation: floatMote 3.1s ease-in-out infinite 0.8s;"></div>
      <div style="position:absolute; left:50px; top:165px; width:5px; height:5px; border-radius:50%; background:#FB7185; box-shadow:0 0 8px #F43F5E; animation: floatMote 2.7s ease-in-out infinite 1.2s;"></div>
      <div style="position:absolute; right:70px; top:215px; width:7px; height:7px; border-radius:50%; background:#FBBF24; box-shadow:0 0 8px #F59E0B; animation: floatMote 3.4s ease-in-out infinite 0.4s;"></div>
      <div style="position:absolute; left:45px; top:300px; width:5px; height:5px; border-radius:50%; background:#FDA4AF; box-shadow:0 0 8px #E11D48; animation: floatMote 2.9s ease-in-out infinite 1.4s;"></div>

      <!-- Whisper pill -->
      <div class="side-whisper-pill">
        <span>💖</span>
        <span>Sweet memories</span>
        <span>✨</span>
      </div>
    </div>
  </div>

  <!-- Romantic 4-Photo Showcase for Srija on Landing Page -->
  <div class="photo-showcase-section" id="photo-showcase">
    <div class="photo-showcase-header">
      <h2>Moments of Srija 🌸</h2>
      <p>Every picture holds a feeling, a spark, and a memory I cherish dearly.</p>
    </div>

    <div class="photo-grid">
      <!-- Card 1: White & Blue Saree -->
      <div class="polaroid-card" id="polaroid-1">
        <div class="polaroid-img-frame">
          <img src="/Screenshot 2026-09-14 173310.png" alt="A Quiet Grace" onerror="this.src='/date-illustration.jpg'" />
        </div>
        <div class="polaroid-info">
          <div>
            <div class="polaroid-title">A Quiet Grace 🌿</div>
            <div class="polaroid-tag">White & Blue Saree • Green Foliage</div>
          </div>
          <div class="polaroid-quote">
            "In a world full of noise, your elegance is the gentlest poetry. One look from you, and everything else simply fades away."
          </div>
        </div>
      </div>

      <!-- Card 2: Red Saree in Sunlight -->
      <div class="polaroid-card" id="polaroid-2">
        <div class="polaroid-img-frame">
          <img src="/Screenshot 2026-09-14 173511.png" alt="Sunshine & Silk" onerror="this.src='/date-illustration.jpg'" />
        </div>
        <div class="polaroid-info">
          <div>
            <div class="polaroid-title">Sunshine & Silk ✨</div>
            <div class="polaroid-tag">Crimson Red Saree • Golden Hour</div>
          </div>
          <div class="polaroid-quote">
            "They say the golden hour is the most magical time of day, but they haven't seen your smile caught in the warm sunlight."
          </div>
        </div>
      </div>

      <!-- Card 3: Purple Saree with Holi Gulal -->
      <div class="polaroid-card" id="polaroid-3">
        <div class="polaroid-img-frame">
          <img src="/Screenshot 2026-09-14 173551.png" alt="Colors of Joy" onerror="this.src='/date-illustration.jpg'" />
        </div>
        <div class="polaroid-info">
          <div>
            <div class="polaroid-title">Colors of Joy 🎨</div>
            <div class="polaroid-tag">Purple Saree • Festive Holi Abir</div>
          </div>
          <div class="polaroid-quote">
            "All the colors of spring couldn't hold a candle to the vibrant light in your eyes and that playful, infectious laugh."
          </div>
        </div>
      </div>

      <!-- Card 4: Reading at Maidan Sunset -->
      <div class="polaroid-card" id="polaroid-4">
        <div class="polaroid-img-frame">
          <img src="/Screenshot 2026-09-14 173742.png" alt="My Favorite Story" onerror="this.src='/date-illustration.jpg'" />
        </div>
        <div class="polaroid-info">
          <div>
            <div class="polaroid-title">My Favorite Story 📖</div>
            <div class="polaroid-tag">Sunset at Maidan • Reading Books</div>
          </div>
          <div class="polaroid-quote">
            "Lost in pages and golden sunsets — you look like the most beautiful story someone waited a lifetime to read."
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- STEP 2: Date & Place Selection Card -->
  <div class="app-card hidden" id="card-plan">
    <div class="badge">
      <span>🎉 She Said Yes!</span>
    </div>

    <h2 style="font-size: 24px; margin-bottom: 6px;">Let's Make It Special</h2>
    <p style="font-size: 13px; color: #6B594E; margin-bottom: 24px;">
      Pick any day between <strong style="color: #E11D48;">Sept 16</strong> and <strong style="color: #E11D48;">Oct 5</strong>, and tell me where you'd love to go.
    </p>

    <!-- Date selector -->
    <div class="form-section">
      <div class="form-label">
        <span>Choose our date 🗓️</span>
        <span class="form-sublabel">Sept 16 – Oct 5</span>
      </div>

      <div class="dates-scroll" id="dates-scroll">
        <!-- Date chips injected by JS -->
      </div>

      <div class="native-date-row">
        <span id="selected-date-preview">Selected: <strong>Sat, Sep 19</strong></span>
        <input
          type="date"
          id="native-date-picker"
          class="native-date-input"
          min="2026-09-16"
          max="2026-10-05"
          value="2026-09-19"
        />
      </div>
    </div>

    <!-- Tell me a place section -->
    <div class="form-section">
      <div class="form-label">
        <span>Tell me a place 📍</span>
        <span style="font-size: 11px; color: #8C7A70; font-weight: normal;">Wherever you'd like!</span>
      </div>

      <textarea
        id="place-input"
        rows="2"
        placeholder="A cozy quiet cafe, a sunset stroll with dessert, your favorite Italian spot, or that place you've been wanting to try..."
      ></textarea>

      <div style="font-size: 11px; color: #8C7A70; margin-top: 8px; margin-bottom: 4px;">
        Need ideas? Tap one to auto-fill:
      </div>
      <div class="pill-list">
        <button type="button" class="pill-btn" onclick="fillPlace('A cozy cafe with great matcha & pastries ☕')">Cozy Cafe & Matcha ☕</button>
        <button type="button" class="pill-btn" onclick="fillPlace('Sunset walk & ice cream by the water 🍦🌅')">Sunset Walk & Ice Cream 🍦</button>
        <button type="button" class="pill-btn" onclick="fillPlace('A quiet bookstore + dessert date 📚🍰')">Bookstore + Dessert 📚</button>
        <button type="button" class="pill-btn" onclick="fillPlace('Delicious pasta or ramen dinner 🍝')">Dinner Date 🍝</button>
      </div>
    </div>

    <!-- Optional Notes -->
    <div class="form-section" style="margin-bottom: 24px;">
      <div class="form-label">
        <span>Any little notes or preferences? (Optional)</span>
      </div>
      <input
        type="text"
        id="note-input"
        class="text-input"
        placeholder="e.g., Around 6:30 PM, I love iced drinks, comfy vibe..."
      />
    </div>

    <button type="button" class="btn btn-yes" id="confirm-btn" style="width: 100%;">
      <span>Lock In Our Date</span>
      <span>💕</span>
    </button>
  </div>

  <!-- STEP 3: Confirmation Ticket -->
  <div class="app-card hidden" id="card-confirm">
    <div class="gif-frame" style="width: 130px; height: 130px;">
      <img
        src="https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif"
        alt="Happy celebration"
      />
    </div>

    <div class="badge">
      <span>✨ It's a Date!</span>
    </div>

    <h2 style="font-size: 24px; margin-bottom: 6px;">I Can't Wait! 🥰</h2>
    <p style="font-size: 13px; color: #6B594E;">
      Here is our plan:
    </p>

    <div class="ticket">
      <div class="ticket-row">
        <div class="ticket-icon">🗓️</div>
        <div>
          <div class="ticket-label">When</div>
          <div class="ticket-val" id="ticket-date">Saturday, Sep 19</div>
        </div>
      </div>
      <div class="ticket-row">
        <div class="ticket-icon">📍</div>
        <div>
          <div class="ticket-label">Where</div>
          <div class="ticket-val" id="ticket-place">Cozy cafe</div>
        </div>
      </div>
      <div class="ticket-row" id="ticket-note-row" style="display: none;">
        <div class="ticket-icon">💬</div>
        <div>
          <div class="ticket-label">Note</div>
          <div class="ticket-val" id="ticket-note" style="font-size: 13px; font-weight: normal; font-style: italic;"></div>
        </div>
      </div>
    </div>

    <div class="action-row">
      <a href="#" id="whatsapp-link" target="_blank" class="btn btn-whatsapp">
        <span>Send on WhatsApp</span>
        <span>💬</span>
      </a>
      <button type="button" class="btn btn-copy" id="copy-btn">
        <span id="copy-label">Copy Details 📋</span>
      </button>
    </div>

    <button type="button" class="link-edit" id="edit-plan-btn">
      Need to adjust the date or place? Tap here
    </button>
  </div>

  <!-- Footer Dedication -->
  <footer style="position: relative; z-index: 10; text-align: center; font-size: 12px; color: #57534E; padding: 18px 16px 28px; font-weight: 500;">
    <span>Made with immense passion by your most likely favourite senior, Aritra Hazra ✨</span>
  </footer>

  <script>
    // --- 0. Built-in Romantic Music with Play/Pause Control ---
    let ytMusicPlayer = null;
    let isMusicPlaying = true;
    let manuallyPaused = false;
    const musicBtn = document.getElementById('music-btn');
    const musicLabel = document.getElementById('music-label');
    const musicIcon = document.getElementById('music-icon');

    function updateMusicButtonUI(playing) {
      isMusicPlaying = playing;
      if (playing) {
        musicBtn.classList.add('is-playing');
        musicIcon.innerText = '⏸️';
        musicLabel.innerText = 'Pause Song';
      } else {
        musicBtn.classList.remove('is-playing');
        musicIcon.innerText = '▶️';
        musicLabel.innerText = 'Play Song';
      }
    }

    function playMusicDirectly() {
      if (!manuallyPaused && ytMusicPlayer && typeof ytMusicPlayer.playVideo === 'function') {
        try {
          ytMusicPlayer.unMute();
          ytMusicPlayer.setVolume(85);
          ytMusicPlayer.playVideo();
          updateMusicButtonUI(true);
        } catch (e) {}
      }
    }

    window.onYouTubeIframeAPIReady = function() {
      ytMusicPlayer = new YT.Player('yt-player', {
        height: '80',
        width: '80',
        videoId: 'fjBaWNRYPGk',
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: 'fjBaWNRYPGk',
          playsinline: 1,
          modestbranding: 1
        },
        events: {
          onReady: function(e) {
            try {
              if (!manuallyPaused) {
                e.target.unMute();
                e.target.setVolume(85);
                e.target.playVideo();
                updateMusicButtonUI(true);
              }
            } catch (err) {}
          },
          onStateChange: function(e) {
            if (e.data === YT.PlayerState.PLAYING) {
              updateMusicButtonUI(true);
            } else if (e.data === YT.PlayerState.PAUSED && manuallyPaused) {
              updateMusicButtonUI(false);
            } else if (e.data === YT.PlayerState.ENDED) {
              if (!manuallyPaused) {
                try { e.target.playVideo(); } catch (err) {}
              }
            }
          }
        }
      });
    };

    // Load YouTube API script
    const ytScript = document.createElement('script');
    ytScript.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(ytScript);

    // Auto-trigger audio on first touch/click anywhere on the page when opened
    window.addEventListener('click', playMusicDirectly, { capture: true });
    window.addEventListener('touchstart', playMusicDirectly, { capture: true, passive: true });
    window.addEventListener('pointerdown', playMusicDirectly, { capture: true });

    // Toggle button handler
    musicBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!ytMusicPlayer) return;
      try {
        if (isMusicPlaying) {
          manuallyPaused = true;
          ytMusicPlayer.pauseVideo();
          updateMusicButtonUI(false);
        } else {
          manuallyPaused = false;
          ytMusicPlayer.unMute();
          ytMusicPlayer.playVideo();
          updateMusicButtonUI(true);
        }
      } catch (err) {}
    });

    // --- 1. Gentle Floating Hearts Background ---
    (function createFloatingHearts() {
      const container = document.getElementById('floating-hearts');
      const symbols = ['❤️', '💖', '🌸', '✨', '💕', '🌷', '🤍'];
      const count = window.innerWidth < 600 ? 14 : 22;

      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'heart-particle';
        el.innerText = symbols[i % symbols.length];
        const left = Math.random() * 94 + 3;
        const duration = 12 + Math.random() * 12;
        const delay = Math.random() * 10;
        const size = 12 + Math.random() * 18;
        const drift = (Math.random() - 0.5) * 80 + 'px';
        const rot = (Math.random() - 0.5) * 60 + 'deg';

        el.style.left = left + '%';
        el.style.fontSize = size + 'px';
        el.style.animationDuration = duration + 's';
        el.style.animationDelay = '-' + delay + 's';
        el.style.setProperty('--drift', drift);
        el.style.setProperty('--rot', rot);
        container.appendChild(el);
      }
    })();

    // --- 1b. Continuous Floating Balloons named 'Srija' ---
    (function createFloatingBalloons() {
      const container = document.getElementById('floating-balloons');
      if (!container) return;

      const palettes = [
        { bg: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6) 0%, transparent 40%), linear-gradient(145deg, #FDA4AF 0%, #F43F5E 100%)', text: '#FFFFFF', knot: '#E11D48', str: 'rgba(244, 63, 94, 0.4)' },
        { bg: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.65) 0%, transparent 40%), linear-gradient(145deg, #FDBA74 0%, #FB7185 100%)', text: '#FFFFFF', knot: '#F43F5E', str: 'rgba(251, 113, 133, 0.4)' },
        { bg: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6) 0%, transparent 40%), linear-gradient(145deg, #F472B6 0%, #EC4899 100%)', text: '#FFFFFF', knot: '#DB2777', str: 'rgba(236, 72, 153, 0.4)' },
        { bg: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75) 0%, transparent 40%), linear-gradient(145deg, #FFE4E6 0%, #FDA4AF 100%)', text: '#9F1239', knot: '#FB7185', str: 'rgba(251, 113, 133, 0.35)' },
        { bg: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.65) 0%, transparent 40%), linear-gradient(145deg, #FBCFE8 0%, #F472B6 100%)', text: '#831843', knot: '#DB2777', str: 'rgba(219, 39, 119, 0.35)' }
      ];

      const leftPositions = [5, 14, 24, 72, 82, 91, 18, 79];
      const count = window.innerWidth < 600 ? 6 : 8;

      for (let i = 0; i < count; i++) {
        const pal = palettes[i % palettes.length];
        const baseLeft = leftPositions[i % leftPositions.length];
        const left = Math.min(93, Math.max(4, baseLeft + (Math.random() * 6 - 3)));
        const duration = 16 + (i * 2) % 8 + Math.random() * 3;
        const delay = -((i * 3.8) % duration);
        const drift = (Math.random() - 0.5) * 50 + 'px';
        const swayDuration = (3.5 + Math.random() * 2) + 's';
        const scale = 0.85 + (i % 3) * 0.1;

        const balloonEl = document.createElement('div');
        balloonEl.className = 'floating-balloon';
        balloonEl.style.left = left + '%';
        balloonEl.style.animationDuration = duration + 's';
        balloonEl.style.animationDelay = delay + 's';
        balloonEl.style.setProperty('--drift', drift);

        balloonEl.innerHTML = \`
          <div class="balloon-sway" style="animation-duration: \${swayDuration}; transform: scale(\${scale});">
            <div class="balloon-body" style="background: \${pal.bg};">
              <span class="balloon-text" style="color: \${pal.text};">Srija</span>
              <span style="font-size: 9px; line-height: 1; margin-top: 2px; color: \${pal.text};">💕</span>
            </div>
            <div class="balloon-knot" style="background-color: \${pal.knot};"></div>
            <svg width="24" height="55" viewBox="0 0 24 55" fill="none" class="balloon-string">
              <path d="M12 0 C 9 12, 16 22, 11 34 C 7 44, 14 48, 12 55" stroke="\${pal.str}" stroke-width="1.25" stroke-linecap="round"/>
            </svg>
          </div>
        \`;

        container.appendChild(balloonEl);
      }
    })();

    // --- 2. Playfully Evasive "No" Button ---
    (function setupEvasiveNo() {
      const noBtn = document.getElementById('no-btn');
      const noLabel = document.getElementById('no-label');
      let evasions = 0;
      let lastX = null;
      let lastY = null;

      const playfulPhrases = [
        'No',
        'Are you sure? 🥺',
        'Nice try! 💨',
        'Too slow! 🤭',
        'Oops! 🏃‍♀️',
        'Nope! 🙈',
        'Wrong button! 👉',
        'Think again! 💕',
        'Can\'t catch me! ✨',
        'Almost! 😜',
        'Still here! 💃',
        'Just say yes! 🥰'
      ];

      function evade(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        // Move to document.body so parent card's backdrop-filter does not clip or offset it!
        if (noBtn.parentElement !== document.body) {
          const placeholder = document.createElement('div');
          placeholder.style.width = noBtn.offsetWidth + 'px';
          placeholder.style.height = noBtn.offsetHeight + 'px';
          placeholder.style.visibility = 'hidden';
          noBtn.parentElement.appendChild(placeholder);
          document.body.appendChild(noBtn);
        }

        const btnWidth = noBtn.offsetWidth || 110;
        const btnHeight = noBtn.offsetHeight || 44;
        const padX = 20;
        const padY = 50;

        const vpW = window.visualViewport ? window.visualViewport.width : window.innerWidth;
        const vpH = window.visualViewport ? window.visualViewport.height : window.innerHeight;

        const maxW = Math.max(padX, vpW - btnWidth - padX);
        const maxH = Math.max(padY, vpH - btnHeight - padY);

        let newX = Math.floor(Math.random() * (maxW - padX) + padX);
        let newY = Math.floor(Math.random() * (maxH - padY) + padY);

        if (lastX !== null && lastY !== null) {
          for (let i = 0; i < 8; i++) {
            const dist = Math.hypot(newX - lastX, newY - lastY);
            if (dist >= 110) break;
            newX = Math.floor(Math.random() * (maxW - padX) + padX);
            newY = Math.floor(Math.random() * (maxH - padY) + padY);
          }
        }
        lastX = newX;
        lastY = newY;

        noBtn.classList.add('is-evading');
        noBtn.style.position = 'fixed';
        noBtn.style.zIndex = '99999';
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';

        evasions++;
        noLabel.innerText = playfulPhrases[evasions % playfulPhrases.length];
      }

      noBtn.addEventListener('mouseenter', evade);
      noBtn.addEventListener('mousemove', evade);
      noBtn.addEventListener('touchstart', evade, { passive: false });
      noBtn.addEventListener('pointerdown', evade);
      noBtn.addEventListener('click', evade);

      window.addEventListener('resize', () => {
        if (noBtn.classList.contains('is-evading') && lastX !== null && lastY !== null) {
          const btnWidth = noBtn.offsetWidth || 110;
          const btnHeight = noBtn.offsetHeight || 44;
          const vpW = window.visualViewport ? window.visualViewport.width : window.innerWidth;
          const vpH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
          const clampedX = Math.min(Math.max(20, lastX), vpW - btnWidth - 20);
          const clampedY = Math.min(Math.max(50, lastY), vpH - btnHeight - 50);
          noBtn.style.left = clampedX + 'px';
          noBtn.style.top = clampedY + 'px';
        }
      });
    })();

    // --- 3. Heart Burst Canvas Animation (High Performance & Snappy Blast) ---
    const htmlSpriteCache = {};
    function getHtmlEmojiSprite(char) {
      if (htmlSpriteCache[char]) return htmlSpriteCache[char];
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const cCtx = c.getContext('2d');
      if (cCtx) {
        cCtx.font = '46px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        cCtx.textAlign = 'center';
        cCtx.textBaseline = 'middle';
        cCtx.fillText(char, 32, 34);
      }
      htmlSpriteCache[char] = c;
      return c;
    }

    function triggerHeartBurst(originX, originY) {
      const canvas = document.getElementById('heart-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';

      const particles = [];
      const symbols = ['❤️', '💖', '💕', '✨', '🌸', '🤍', '💗', '🥰'];
      const glitterColors = ['#F43F5E', '#FB7185', '#F59E0B', '#FBBF24', '#EC4899', '#FDA4AF'];
      const count = window.innerWidth < 600 ? 45 : 70;

      // Pre-render sprites
      for (let s of symbols) getHtmlEmojiSprite(s);

      const ox = (originX || window.innerWidth / 2) * dpr;
      const oy = (originY || window.innerHeight / 2) * dpr;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (9 + Math.random() * 15) * dpr;
        const isEmoji = i % 3 !== 0;

        particles.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (4.5 + Math.random() * 3) * dpr,
          isEmoji: isEmoji,
          char: isEmoji ? symbols[Math.floor(Math.random() * symbols.length)] : null,
          color: !isEmoji ? glitterColors[Math.floor(Math.random() * glitterColors.length)] : null,
          size: isEmoji ? (20 + Math.random() * 22) * dpr : (6 + Math.random() * 8) * dpr,
          opacity: 1,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.28,
          life: 0,
          maxLife: Math.floor(45 + Math.random() * 22)
        });
      }

      let lastTime = performance.now();

      function animate(now) {
        const dt = Math.min((now - lastTime) / 16.67, 2.0);
        lastTime = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = 0;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.life += dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += (0.32 * dpr) * dt;
          p.vx *= Math.pow(0.95, dt);
          p.vy *= Math.pow(0.97, dt);
          p.rot += p.vRot * dt;

          const progress = p.life / p.maxLife;
          if (progress < 0.6) {
            p.opacity = 1;
          } else {
            p.opacity = Math.max(0, 1 - (progress - 0.6) / 0.4);
          }

          if (p.life < p.maxLife && p.opacity > 0) {
            alive++;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.globalAlpha = p.opacity;

            if (p.isEmoji && p.char) {
              const sprite = getHtmlEmojiSprite(p.char);
              ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
            } else if (p.color) {
              ctx.fillStyle = p.color;
              ctx.beginPath();
              const s = p.size;
              ctx.moveTo(0, -s);
              ctx.lineTo(s * 0.35, -s * 0.35);
              ctx.lineTo(s, 0);
              ctx.lineTo(s * 0.35, s * 0.35);
              ctx.lineTo(0, s);
              ctx.lineTo(-s * 0.35, s * 0.35);
              ctx.lineTo(-s, 0);
              ctx.lineTo(-s * 0.35, -s * 0.35);
              ctx.closePath();
              ctx.fill();
            }

            ctx.restore();
          }
        }

        if (alive > 0) {
          requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      requestAnimationFrame(animate);
    }

    // --- 4. Date Logic: Strictly Sept 16 to Oct 5 (2026) ---
    const MIN_DATE = '2026-09-16';
    const MAX_DATE = '2026-10-05';
    let selectedDate = '2026-09-19';

    const allowableDates = [];
    (function generateAllowableDates() {
      const cur = new Date(2026, 8, 16); // Sept 16
      const end = new Date(2026, 9, 5);  // Oct 5

      while (cur <= end) {
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, '0');
        const d = String(cur.getDate()).padStart(2, '0');
        const dateStr = y + '-' + m + '-' + d;

        const dayName = cur.toLocaleDateString('en-US', { weekday: 'short' });
        const monthName = cur.toLocaleDateString('en-US', { month: 'short' });
        const dayNum = cur.getDate();

        allowableDates.push({
          dateStr: dateStr,
          dayName: dayName,
          monthName: monthName,
          dayNum: dayNum,
          formatted: dayName + ', ' + monthName + ' ' + dayNum
        });

        cur.setDate(cur.getDate() + 1);
      }
    })();

    function renderDateChips() {
      const scroll = document.getElementById('dates-scroll');
      scroll.innerHTML = '';

      allowableDates.forEach(item => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'date-chip' + (item.dateStr === selectedDate ? ' active' : '');
        chip.innerHTML = '<span class="day-name">' + item.dayName + '</span>' +
                         '<span class="day-num">' + item.dayNum + '</span>' +
                         '<span class="month-name">' + item.monthName + '</span>';

        chip.addEventListener('click', () => {
          selectDate(item.dateStr);
        });
        scroll.appendChild(chip);
      });

      updateDatePreviews();
    }

    function selectDate(dateStr) {
      if (dateStr < MIN_DATE) dateStr = MIN_DATE;
      if (dateStr > MAX_DATE) dateStr = MAX_DATE;
      selectedDate = dateStr;

      document.querySelectorAll('.date-chip').forEach((chip, idx) => {
        if (allowableDates[idx].dateStr === selectedDate) {
          chip.classList.add('active');
          chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
          chip.classList.remove('active');
        }
      });

      document.getElementById('native-date-picker').value = selectedDate;
      updateDatePreviews();
    }

    function updateDatePreviews() {
      const match = allowableDates.find(d => d.dateStr === selectedDate);
      const text = match ? match.formatted : selectedDate;
      document.getElementById('selected-date-preview').innerHTML = 'Selected: <strong>' + text + '</strong>';
    }

    document.getElementById('native-date-picker').addEventListener('change', (e) => {
      selectDate(e.target.value);
    });

    function fillPlace(val) {
      const input = document.getElementById('place-input');
      input.value = val;
      input.focus();
    }

    // --- 5. Step Transitions ---
    const cardAsk = document.getElementById('card-ask');
    const cardPlan = document.getElementById('card-plan');
    const cardConfirm = document.getElementById('card-confirm');
    const yesBtn = document.getElementById('yes-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    const editBtn = document.getElementById('edit-plan-btn');

    // Click "Yes" -> Heart Burst -> Show Plan Card
    yesBtn.addEventListener('click', (e) => {
      const rect = yesBtn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      triggerHeartBurst(originX, originY);

      // Hide runaway button if floating
      const noBtn = document.getElementById('no-btn');
      noBtn.style.display = 'none';

      setTimeout(() => {
        const askSparkleWrap = document.getElementById('ask-sparkle-wrap');
        if (askSparkleWrap) askSparkleWrap.classList.add('hidden');
        cardAsk.classList.add('hidden');
        const photoShowcase = document.getElementById('photo-showcase');
        if (photoShowcase) photoShowcase.classList.add('hidden');
        cardPlan.classList.remove('hidden');
        renderDateChips();
      }, 400);
    });

    // Confirm Plan -> Show Ticket
    confirmBtn.addEventListener('click', () => {
      const place = document.getElementById('place-input').value.trim();
      if (!place) {
        alert('Please enter a place you\\'d love to go so we can make it happen! 🌸');
        document.getElementById('place-input').focus();
        return;
      }

      const note = document.getElementById('note-input').value.trim();
      const match = allowableDates.find(d => d.dateStr === selectedDate);
      const formattedDate = match ? match.formatted : selectedDate;

      // Update Ticket
      document.getElementById('ticket-date').innerText = formattedDate;
      document.getElementById('ticket-place').innerText = place;

      const noteRow = document.getElementById('ticket-note-row');
      if (note) {
        noteRow.style.display = 'flex';
        document.getElementById('ticket-note').innerText = '"' + note + '"';
      } else {
        noteRow.style.display = 'none';
      }

      // WhatsApp link setup
      const shareMsg = "Hey! I'd love to go on our date on " + formattedDate + " at " + place + "! 🥰✨" + (note ? " (" + note + ")" : "");
      document.getElementById('whatsapp-link').href = "https://api.whatsapp.com/send?text=" + encodeURIComponent(shareMsg);

      // Copy setup
      const copyBtn = document.getElementById('copy-btn');
      const copyLabel = document.getElementById('copy-label');
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(shareMsg).then(() => {
          copyLabel.innerText = 'Copied! 💕';
          setTimeout(() => { copyLabel.innerText = 'Copy Details 📋'; }, 2200);
        }).catch(() => {
          copyLabel.innerText = 'Copied! 💕';
          setTimeout(() => { copyLabel.innerText = 'Copy Details 📋'; }, 2200);
        });
      };

      // Confetti burst
      triggerHeartBurst();

      cardPlan.classList.add('hidden');
      cardConfirm.classList.remove('hidden');
    });

    // Edit plan button
    editBtn.addEventListener('click', () => {
      cardConfirm.classList.add('hidden');
      cardPlan.classList.remove('hidden');
    });
  </script>
</body>
</html>`;
}
