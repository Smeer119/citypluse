# CityPulse - Real-time Civic Dashboard

## Team Jarvis - Hack Fest 2025

A modern, responsive civic issue dashboard with AI-powered prioritization and real-time analytics for smart city management.

## 🚀 Features

### ✅ Implemented (MVP Ready)
- **Beautiful, Responsive UI** - Dark theme with professional civic design system
- **Multi-page Navigation** - Home, Dashboard, Report Form, Analytics
- **Smart Design System** - Semantic tokens, gradients, and consistent styling
- **Issue Prioritization Badges** - Urgent, High, Medium, Low priority system
- **Mock Data Integration** - Realistic demo data for all features
- **Accessibility Ready** - WCAG-compliant structure and ARIA labels
- **SEO Optimized** - Proper meta tags and semantic HTML

### 🔄 Ready for Backend Integration
- **Supabase Schema Ready** - Connect backend for real data persistence
- **Form Validation** - Issue reporting with complete validation
- **Real-time Filters** - Category and status filtering system
- **Analytics Dashboard** - Stats cards and visualization components

## 🏗️ Tech Stack

### Frontend (Current Implementation)
- **React 18** + **TypeScript** - Component-based architecture
- **Vite** - Fast development and build tool
- **Tailwind CSS** - Utility-first styling with custom design system
- **Shadcn/ui** - Accessible, customizable component library
- **React Router** - Client-side navigation
- **Lucide React** - Beautiful, consistent icons

### Ready to Integrate
- **Supabase** - PostgreSQL database, real-time subscriptions, authentication
- **Leaflet.js** - Interactive maps and heatmaps (packages installed)
- **Chart.js** - Data visualizations (packages installed)
- **Python NLP** - Via Supabase Edge Functions for urgency scoring

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn/ui components
│   ├── Navigation.tsx         # Main navigation bar
│   ├── StatusBadge.tsx        # Priority status badges
│   └── StatsCard.tsx          # Analytics metric cards
├── pages/
│   ├── Home.tsx              # Landing page with hero section
│   ├── Dashboard.tsx         # Issue monitoring and filtering
│   ├── ReportIssue.tsx       # Citizen complaint form
│   ├── Analytics.tsx         # Data insights and predictions
│   └── NotFound.tsx          # 404 error page
├── assets/
│   └── hero-city.jpg         # Generated hero image
├── index.css                 # Design system tokens and CSS variables
└── App.tsx                   # Main routing and app configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Civic Blue (`hsl(217 91% 60%)`) - Main brand color
- **Secondary**: Professional Gray - Card backgrounds
- **Status Colors**: 
  - Urgent: Red (`hsl(0 84% 60%)`)
  - High: Orange (`hsl(38 92% 50%)`)
  - Medium: Blue (`hsl(199 89% 48%)`)
  - Low: Green (`hsl(142 76% 36%)`)

### Key Features
- **Semantic Tokens** - All colors defined in CSS variables
- **Gradients & Glows** - Modern visual effects
- **Responsive Grid** - Mobile-first design approach
- **Accessibility** - High contrast and keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend features)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd citypulse

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Supabase Integration Setup

### 1. Connect to Supabase
Click the green **Supabase** button in the Lovable interface to activate the native integration.

### 2. Database Schema (Recommended)
```sql
-- Complaints table for issue tracking
CREATE TABLE complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  priority TEXT NOT NULL,
  urgency_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Allow public read access for dashboard
CREATE POLICY "Public read access" ON complaints
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated insert" ON complaints
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 3. API Integration Points
- **Twitter/X API** - Via Supabase Edge Functions
- **OpenStreetMap** - For location validation and mapping
- **Translation API** - For multilingual support

## 🤖 AI Features (Integration Ready)

### NLP Urgency Scoring
Python microservice template for processing issue descriptions:

```python
# Supabase Edge Function Template
import spacy
from typing import Dict, Any

def analyze_urgency(text: str) -> Dict[str, Any]:
    """
    Analyze text for urgency indicators
    Returns urgency score (0-100) and keywords
    """
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    
    # Urgency keywords and weights
    urgent_keywords = {
        'emergency': 100, 'dangerous': 90, 'urgent': 85,
        'safety': 75, 'broken': 60, 'leak': 70
    }
    
    score = 0
    found_keywords = []
    
    for token in doc:
        if token.lemma_.lower() in urgent_keywords:
            score += urgent_keywords[token.lemma_.lower()]
            found_keywords.append(token.text)
    
    return {
        'urgency_score': min(score, 100),
        'keywords': found_keywords,
        'category_suggestion': classify_category(doc)
    }
```

## 📊 Data Visualization Integration

### Chart.js Setup (Ready)
```javascript
// Example: Issue trends chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IssuesTrendChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Reported Issues',
        data: data.map(item => item.reported),
        backgroundColor: 'hsl(217 91% 60% / 0.8)',
      },
      {
        label: 'Resolved Issues', 
        data: data.map(item => item.resolved),
        backgroundColor: 'hsl(142 76% 36% / 0.8)',
      }
    ]
  };

  return <Bar data={chartData} options={chartOptions} />;
};
```

### Leaflet Maps Setup (Ready)
```javascript
// Example: Issue heatmap component
import { MapContainer, TileLayer, HeatmapLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const IssueHeatmap = ({ issues }) => {
  const heatmapData = issues.map(issue => [
    issue.latitude, 
    issue.longitude, 
    issue.urgency_score / 100
  ]);

  return (
    <MapContainer center={[40.7128, -74.0060]} zoom={11}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HeatmapLayer data={heatmapData} />
    </MapContainer>
  );
};
```

## 🔐 Authentication Setup

Use Supabase Auth for user management:
```javascript
// Login/Signup with Supabase
import { supabase } from '@/integrations/supabase/client';

const handleSignUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) console.error('Error:', error.message);
  return data;
};
```

## 📱 Mobile Optimization

- **Responsive Breakpoints** - sm:, md:, lg:, xl: classes throughout
- **Touch-Friendly UI** - Large touch targets and gestures
- **Progressive Enhancement** - Works on all device types
- **Offline Support** - Ready for service worker integration

## 🧪 Testing & Debugging

### Mock Data Usage
All components currently use realistic mock data that matches the expected Supabase schema structure. This allows for:
- Full UI testing without backend
- Rapid prototyping and iteration
- Easy transition to real data

### Browser DevTools
- **React DevTools** - Component inspection
- **Network Tab** - API call monitoring  
- **Lighthouse** - Performance and accessibility auditing

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Lovable Deployment
Click **Publish** in the Lovable interface for instant deployment.

## 🎯 Next Steps for Full Implementation

1. **Connect Supabase** - Enable backend integration
2. **Add Authentication** - User login/signup system
3. **Implement Maps** - Leaflet.js heatmap integration
4. **Add Charts** - Chart.js data visualization
5. **NLP Service** - Python Edge Function for urgency scoring
6. **API Integrations** - Twitter, government data sources
7. **Real-time Updates** - Supabase subscriptions
8. **File Upload** - Image attachments for reports

## 👥 Team Jarvis Skills Alignment

- **Next.js/React** ✅ - Fully implemented with modern React patterns
- **Python** 🔄 - Ready for Supabase Edge Functions integration
- **Supabase** 🔄 - Schema designed, integration ready
- **UI/UX** ✅ - Professional, accessible design system
- **TypeScript** ✅ - Full type safety throughout

## 📄 License

Built for Hack Fest 2025 - Team Jarvis

---

**Ready to deploy and integrate!** 🚀 The frontend is complete and beautiful, all backend connections are prepared for rapid integration.