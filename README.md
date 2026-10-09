# 🍮 Pudding Timer — Cute Pomodoro Web App

A fluid, tactile Pomodoro web application with adorable cartoon mascots, gentle ambient floaters, and **Apple WWDC Human Interface Guidelines** design.

Designed to be deployed seamlessly on **Vercel**.

📖 **[Lihat Dokumentasi Arsitektur, Alur Data & Sequence Diagram (WHITEBOARD_ARCHITECTURE.md)](./WHITEBOARD_ARCHITECTURE.md)**

---

## ✨ Features & Apple Design Highlights

1. **Fluid Interface Physics**:
   - Critically damped spring animations (`damping: 1.0`, response `0.3-0.4s`).
   - Latency-free tactile touch states (`scale(0.95)` on pointer-down).
   - Direct manipulation: click and drag around the circular timer dial with pointer capture to scrub time in real time.

2. **iOS & macOS Translucent Materials**:
   - `backdrop-filter: blur(28px) saturate(190%)` frosted glass styling.
   - Dynamic Island / Live Activity top bar with live audio equalizer indicators and spring-expandable quick controls.
   - iOS-style Segmented Glass Control for Focus (25m), Short Break (5m), and Long Break (15m).
   - Seamless Light and Dark mode transitions adhering to macOS Sequoia / iOS 18 color tokens.

3. **Multimodal Audio & Haptic Feedback (Web Audio API)**:
   - Apple-style tactile click sound on touch and adjustments.
   - Harmonious harmonic chord bell chime on sprint completion.
   - Procedural ambient sound generator: Gentle Rain, Pink Noise, and White Noise (no external MP3 dependencies).
   - Vibration API haptics on supported mobile devices.

4. **Productivity Tools**:
   - **Apple Fitness Style Activity Rings**: Concentric rings tracking daily Focus Minutes, Completed Sessions, and Mindful Breaks.
   - **Apple Reminders Style Task Checklist**: Pin your primary focus task directly into the Dynamic Island.
   - **Zen Fullscreen Mode**: Distraction-free flow state view.
   - **Keyboard Shortcuts**:
     - `Space` : Play / Pause
     - `R` : Reset current timer
     - `S` : Skip to next session
     - `F` : Fullscreen Zen mode
     - `1` / `2` / `3` : Switch mode (Focus / Short Break / Long Break)
     - `Esc` : Close modals

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Cara Deploy ke Vercel

Aplikasi ini sudah dilengkapi dengan file `vercel.json` dan Vite build setup standar yang langsung didukung oleh Vercel.

### Cara 1: Menggunakan Vercel CLI (Paling Cepat)
```bash
# Install Vercel CLI jika belum terpasang
npm i -g vercel

# Login dan deploy langsung dari folder project:
vercel
```
Pilih opsi default (`y`), Vercel akan otomatis mendeteksi konfigurasi Vite dan men-deploy web app kamu dalam hitungan detik.

### Cara 2: Melalui Git & Dashboard Vercel (GitHub / GitLab)
1. Inisialisasi Git & push ke repository GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Apple Design Pomodoro Web App"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
2. Buka dashboard [vercel.com](https://vercel.com) -> Klik **"Add New Project"**.
3. Import repository GitHub kamu.
4. Framework Preset akan otomatis terdeteksi sebagai **Vite**.
5. Klik **"Deploy"**!

---

## 🛠️ Tech Stack
- **React 19** + **Vite**
- **Vanilla CSS (Design Tokens & Glassmorphism)**
- **Web Audio API** (Procedural synthesis)
- **Lucide Icons**
- **Canvas Confetti**
