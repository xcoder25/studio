# Quick Integration Guide

This guide shows you how to add the new Trendix features to your existing pages.

---

## 🤖 AI Assistant (Already Integrated!)

The AI Assistant is **already live** throughout your app! It was added to the main layout.

**What you see:**
- Floating purple chat button (bottom-right)
- Click to open the assistant
- Context changes based on current page

**No action needed** - it's working now! 🎉

---

## 🎓 Adding Onboarding Tours

### Dashboard Tour

Add this to `src/app/(main)/dashboard/page.tsx`:

```typescript
import { OnboardingTour, DASHBOARD_TOUR } from '@/components/onboarding/onboarding-tour';
import { useState, useEffect } from 'react';

// Inside your component
const [showTour, setShowTour] = useState(false);

// Check if user has seen the tour
useEffect(() => {
  const hasSeenTour = localStorage.getItem('dashboard-tour-seen');
  if (!hasSeenTour && user) {
    // Show tour after a short delay for better UX
    setTimeout(() => setShowTour(true), 1000);
  }
}, [user]);

const handleTourComplete = () => {
  localStorage.setItem('dashboard-tour-seen', 'true');
  setShowTour(false);
};

// Add data-tour attributes to elements you want to highlight
// Example:
<div data-tour="social-stats">
  {/* Your social stats grid */}
</div>

<div data-tour="engagement">
  {/* Your engagement chart */}
</div>

<div data-tour="trends">
  {/* Your trends section */}
</div>

<Button data-tour="create-button">
  Create Post
</Button>

// At the end of your JSX return
return (
  <>
    {/* Your existing dashboard content */}
    
    <OnboardingTour
      steps={DASHBOARD_TOUR}
      isOpen={showTour}
      onComplete={handleTourComplete}
      onSkip={handleTourComplete}
    />
  </>
);
```

### Video Editor Tour

Add this to `src/app/(main)/video-generator/editor/page.tsx`:

```typescript
import { OnboardingTour, VIDEO_EDITOR_TOUR } from '@/components/onboarding/onboarding-tour';

// Add data-tour attributes
<div data-tour="ai-tools">
  {/* Your AI tools tabs */}
</div>

<div data-tour="effects">
  {/* Effects panel (when you add it) */}
</div>

<Button data-tour="export">
  Export Video
</Button>

// Add tour component
<OnboardingTour
  steps={VIDEO_EDITOR_TOUR}
  isOpen={showVideoTour}
  onComplete={() => {
    localStorage.setItem('video-editor-tour-seen', 'true');
    setShowVideoTour(false);
  }}
  onSkip={() => setShowVideoTour(false)}
/>
```

### Composer Tour

Add to `src/app/(main)/composer/page.tsx`:

```typescript
import { OnboardingTour, COMPOSER_TOUR } from '@/components/onboarding/onboarding-tour';

// Add data-tour attributes where needed
<div data-tour="ai-generate">
  {/* AI generation section */}
</div>

<div data-tour="platforms">
  {/* Platform selection */}
</div>

<div data-tour="schedule">
  {/* Schedule section */}
</div>
```

---

## 🎬 Video Editor Enhancements

### Adding the Toolbar

Update `src/app/(main)/video-generator/editor/page.tsx`:

```typescript
import { VideoEditorToolbar } from '@/components/video-editor/video-editor-toolbar';

// Add state for video editor features
const [isPlaying, setIsPlaying] = useState(false);
const [history, setHistory] = useState([]);
const [future, setFuture] = useState([]);

// Add handlers
const handleSplit = () => {
  // Split video at current playhead position
  console.log('Split video');
};

const handleAddText = () => {
  // Open text editor
  console.log('Add text');
};

const handleEffects = () => {
  // Show effects panel
  setShowEffects(true);
};

// In your JSX, add before the main content
<VideoEditorToolbar
  onSplit={handleSplit}
  onDuplicate={() => console.log('Duplicate')}
  onDelete={() => console.log('Delete')}
  onUndo={() => console.log('Undo')}
  onRedo={() => console.log('Redo')}
  onAddText={handleAddText}
  onAddImage={() => console.log('Add image')}
  onAddVideo={() => console.log('Add video')}
  onAddAudio={() => console.log('Add audio')}
  onEffects={handleEffects}
  onFilters={() => console.log('Filters')}
  onColorGrade={() => console.log('Color grade')}
  onAIEnhance={() => console.log('AI enhance')}
  onExport={() => console.log('Export')}
  onSave={() => console.log('Save')}
  isPlaying={isPlaying}
  canUndo={history.length > 0}
  canRedo={future.length > 0}
/>
```

### Adding the Effects Panel

Add to your video editor layout:

```typescript
import { EffectsPanel } from '@/components/video-editor/effects-panel';

// Update your layout to include the effects panel
<div className="grid grid-cols-12 gap-4">
  {/* Left sidebar - AI tools */}
  <div className="col-span-3">
    {/* Your existing AI tools */}
  </div>
  
  {/* Center - Video preview */}
  <div className="col-span-6">
    {/* Your video preview */}
  </div>
  
  {/* Right sidebar - Effects panel */}
  <div className="col-span-3">
    <EffectsPanel />
  </div>
</div>
```

---

## 🎨 Customizing the AI Assistant

### Update Knowledge Base

Edit `src/components/trendix-assistant.tsx`:

```typescript
// Add more entries to KNOWLEDGE_BASE
const KNOWLEDGE_BASE = {
  // ... existing entries ...
  
  "custom feature": "Your answer about your custom feature...",
  "another topic": "Another helpful response...",
};
```

### Add Context-Specific Help

```typescript
// Add new quick help for custom pages
const QUICK_HELP = {
  // ... existing entries ...
  
  "custom-page": [
    "How do I use feature X?",
    "What is feature Y?",
    "How to configure Z?",
  ],
};
```

---

## 📱 Adding Tour Data Attributes

For any element you want to highlight in a tour, add the `data-tour` attribute:

```typescript
// Social stats section
<div data-tour="social-stats" className="grid grid-cols-4 gap-4">
  {/* Your stats cards */}
</div>

// Engagement chart
<Card data-tour="engagement">
  <CardHeader>
    <CardTitle>Engagement Overview</CardTitle>
  </CardHeader>
  {/* Chart content */}
</Card>

// Trend finder
<Card data-tour="trends">
  <CardHeader>
    <CardTitle>Trend Finder</CardTitle>
  </CardHeader>
  {/* Trends list */}
</Card>

// Create button
<Button data-tour="create-button" asChild>
  <Link href="/composer">
    <PenSquare className="mr-2" /> Create Post
  </Link>
</Button>
```

---

## 🎯 Best Practices

### Onboarding Tours

1. **Show once** - Use localStorage to track if user has seen tour
2. **Short & sweet** - Keep tours to 5 steps or less
3. **Add delay** - Wait 1-2 seconds after page load before showing tour
4. **Skippable** - Always allow users to skip
5. **Clear targets** - Make sure data-tour elements exist

### AI Assistant

1. **Keep responses short** - One paragraph max
2. **Add examples** - Show users exactly what to do
3. **Link to docs** - For complex topics, point to detailed docs
4. **Use emojis** - Make it friendly and engaging

### Video Editor

1. **Progressive disclosure** - Don't show all tools at once
2. **Tooltips** - Every button should have a tooltip
3. **Pro badges** - Clearly mark premium features
4. **Keyboard shortcuts** - Add for power users

---

## 🐛 Troubleshooting

### Tour not showing?

Check:
1. Is the tour open state true?
2. Do the data-tour elements exist?
3. Check localStorage - clear it to test again
4. Look for console errors

### Assistant not appearing?

Check:
1. Is it imported in layout.tsx?
2. Is the component rendering? (Check React DevTools)
3. Look for z-index conflicts
4. Check if it's hidden off-screen

### Effects not applying?

1. Implement the actual effect logic
2. Connect to video processing library
3. Add loading states
4. Show success/error feedback

---

## 📚 Example: Complete Dashboard Integration

Here's a complete example of adding everything to the dashboard:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { OnboardingTour, DASHBOARD_TOUR } from '@/components/onboarding/onboarding-tour';
// ... other imports

export default function DashboardPage() {
  const [showTour, setShowTour] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Show tour for first-time users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('dashboard-tour-seen');
    if (!hasSeenTour && user) {
      setTimeout(() => setShowTour(true), 1500);
    }
  }, [user]);

  const handleTourComplete = () => {
    localStorage.setItem('dashboard-tour-seen', 'true');
    setShowTour(false);
    // Optional: Show success toast
    toast({
      title: "Tour Complete! 🎉",
      description: "You're all set. Start creating amazing content!",
    });
  };

  return (
    <div className="grid gap-6">
      {/* Social Stats - with tour target */}
      <div data-tour="social-stats" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.socialStats.map((stat) => (
          <StatsCard key={stat.platform} {...stat} />
        ))}
      </div>

      {/* Engagement Chart - with tour target */}
      <Card data-tour="engagement">
        <CardHeader>
          <CardTitle>Engagement Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <EngagementChart data={dashboardData.engagementChartData} />
        </CardContent>
      </Card>

      {/* Trends - with tour target */}
      <Card data-tour="trends">
        <CardHeader>
          <CardTitle>Trend Finder</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Trends list */}
        </CardContent>
      </Card>

      {/* Create Button - with tour target */}
      <Button data-tour="create-button" asChild>
        <Link href="/composer">
          <PenSquare className="mr-2" /> Create Post
        </Link>
      </Button>

      {/* Onboarding Tour */}
      <OnboardingTour
        steps={DASHBOARD_TOUR}
        isOpen={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourComplete}
      />
    </div>
  );
}
```

---

## 🚀 What's Next?

1. **Add tours to all pages** - Use the examples above
2. **Customize AI responses** - Update the knowledge base
3. **Connect video effects** - Implement actual processing
4. **Test everything** - Try the user flow from start to finish
5. **Gather feedback** - See what users love and improve

---

**Need Help?**

Ask the Trendix AI Assistant! It's already integrated and ready to help. 😊

---

*Happy coding!* 🎉

