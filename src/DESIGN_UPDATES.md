# Design Updates - LoL Client Theme

## Overview
The application has been completely redesigned to match the League of Legends client aesthetic, featuring:
- Dark teal/emerald color scheme inspired by Summoner's Rift
- Mystical forest background from the LoL client
- Champion icons as position markers on the analysis map
- Cohesive teal-cyan-blue gradient accents throughout

## Color Palette

### Primary Colors
- **Background**: `#0a1428` (Deep blue-black)
- **Card Background**: `#0f1b2e` (Darker blue)
- **Accent Colors**: Teal (#0bc5ea), Cyan (#22d3ee), Blue (#5b9bd5)
- **Border Colors**: Teal/900 with 30-50% opacity

### Team Colors
- **Blue Team**: Blue 400-600 range
- **Red Team**: Red 400-600 range

### Status Colors
- **Victory**: Blue shades
- **Defeat**: Red shades
- **Stats**: Teal (KDA), Green (Kills), Red (Deaths), Cyan (Assists), Yellow (Gold)

## Key Changes

### 1. Landing Page
- Background uses imported LoL forest image with blur and gradient overlays
- Teal-cyan-blue gradient for title text
- Cards have teal/cyan/blue accent borders on hover
- Input fields and selects styled with teal borders

### 2. Profile Dashboard
- Dark cards with teal borders
- Style DNA section uses teal-cyan-emerald gradient background
- Progress bars color-coded: teal (aggression), green (farming), yellow (vision), cyan (teamfighting)
- Match history cards show color-coded KDA (green/red/cyan)

### 3. Game Review Page
- Summoner's Rift Map:
  - Uses LoL forest background
  - Champion icons as position markers (fetched from Community Dragon CDN)
  - Blue/red team borders on champion avatars
  - Teal-emerald gradient overlay
  - Selected champions get yellow ring highlight
  
### 4. Game Timeline
- Horizontal timeline bar with teal gradient
- Time markers in teal color
- Event icons positioned on timeline
- Smooth hover effects with tooltips
- Color-coded event badges (kills=green, deaths=red, objectives=purple, towers=orange)

### 5. AI Chatbot
- Teal-cyan-blue gradient for bot avatar
- Dark message bubbles with teal borders
- Animated typing indicator with teal dots
- Send button with teal-cyan gradient

## Technical Implementation

### Champion Icons
Champion positions on the map now use actual champion icons from Community Dragon CDN:
```typescript
const getChampionIcon = (championName: string) => {
  const formattedName = championName.replace(/[' ]/g, '');
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${getChampionId(championName)}.png`;
};
```

### Background Image
The mystical forest background is imported and used with overlay effects:
```typescript
import bgImage from 'figma:asset/1253b31725a9efc07506531e701b34309fbd8d57.png';

// Applied with blur and gradient overlays
<div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${bgImage})`, ... }}>
```

### Global CSS Updates
Updated color tokens in `/styles/globals.css` to use LoL-inspired dark blue and teal color scheme.

## User Experience Improvements
- Consistent hover states across all interactive elements
- Color-coded information for quick scanning (KDA, team colors, event types)
- Champion icons provide visual recognition on the map
- Atmospheric background creates immersion
- Smooth transitions and animations
