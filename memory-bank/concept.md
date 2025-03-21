Below is a simple Product Requirements Document (PRD) for our game.

---

### **Product Requirements Document (PRD)**

#### **Overview**

This is a multiplayer web-based game where players connect via their phones using a unique code, similar to Jackbox. The game combines _Cards Against Humanity_-style gameplay with a battle royale twist, built with Three.js for pixel art graphics and a cozy, story-driven atmosphere. It will be hosted on a Next.js 15 website.

---

#### **Tech Stack**

The simplest tech stack to make this work includes:

- **Frontend:**

  - **Next.js 15**: Hosts the website and game interface.
  - **Three.js (JavaScript)**: Renders pixel art graphics for the game.

- **Backend:**

  - **Supabase Realtime Database**: Manages game rooms, player connections, and real-time game state.

- **Hosting:**

  - **Vercel**: Deploys the Next.js application.

- **Player Devices:**
  - Mobile-optimized pages served by Next.js for players to join and submit answers.

---

#### **Notes**

- Focus on core functionality (multiplayer, prompts, eliminations).
- Use Supabase for real-time updates and Three.js for the pixel art game display.

---
