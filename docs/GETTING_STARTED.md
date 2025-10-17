# Getting Started Guide

## Overview

This guide will walk you through creating your first accessible e-learning course with the Site Builder in 5 minutes.

## Step 1: Start the Application (2 minutes)

### Terminal 1 - Start Backend

```bash
cd site-builder/backend
npm install
npm start
```

You should see:
```
Site Builder backend running on http://localhost:5000
```

### Terminal 2 - Start Frontend

```bash
cd site-builder/frontend
npm install
npm start
```

Your browser will open to `http://localhost:3000`

## Step 2: Create Your First Course (1 minute)

1. Click **"Create Your First Course"** button
2. Click **"Create New Course"** button  
3. Enter a course name like `"Introduction to Web Basics"`
4. Click **"Create Course"** button

You're now in the editor!

## Step 3: Build Your Course (2 minutes)

### Add a Welcome Heading

1. In the **Toolbar** (left panel), click **📌 Heading**
2. A new heading block appears in the canvas
3. In the **Properties Panel** (right side), update the text:
   ```
   Welcome to Web Basics
   ```

### Add an Introduction

1. Click **📝 Text** in the toolbar
2. Edit the text to:
   ```
   This course covers the fundamentals of web development. 
   You'll learn about HTML, CSS, and JavaScript through 
   interactive lessons and practical examples.
   ```

### Add an Image

1. Click **🖼️ Image** in the toolbar
2. In Properties Panel, add:
   - **URL**: `https://via.placeholder.com/500x300?text=Web+Development`
   - **Alt Text** (required for accessibility): 
     ```
     A colorful illustration representing web development 
     with code symbols and a laptop
     ```
   - **Title** (optional): `Web Development Illustration`

### Add a Video Link

1. Click **🎥 Video** in the toolbar
2. In Properties Panel, add:
   - **URL**: `https://www.w3schools.com/html/mov_bbb.mp4`
   - **Description** (required): 
     ```
     Sample video demonstrating basic HTML structure 
     and common web development tools in action
     ```
   - **Title**: `Introduction Video`

## Step 4: Export Your Site

1. Click the **"↓ Export Site"** button (top right)
2. Wait for the success message
3. Your site is now generated!

## Step 5: View Your Course

Open your browser to:
```
http://localhost:5000/sites/Introduction%20to%20Web%20Basics/index.html
```

You should see a complete, accessible course webpage!

## Key Features You Just Used

### ✓ Drag-and-Drop Content
- Add multiple types of content blocks
- Reorder blocks with up/down arrows
- Delete blocks with the × button

### ✓ 508 Accessibility
- Alt text requirement for images ensures screen reader access
- Video descriptions help deaf/blind users understand content
- Keyboard navigation works throughout
- High contrast colors for readability

### ✓ Static Site Generation
- One click export
- No database or server required
- Can host anywhere (GitHub Pages, S3, etc.)

## Next Steps

### Customize Your Site

Edit the generated files in:
```
output-sites/Introduction to Web Basics/
```

- `index.html` - Main page
- `styles.css` - Styling
- Add your own JavaScript for interactivity

### Host Your Course

**Option 1: Local Server**
```bash
cd output-sites/Introduction\ to\ Web\ Basics
python3 -m http.server 8000
```
Visit: `http://localhost:8000`

**Option 2: GitHub Pages**
1. Push to GitHub
2. Enable Pages in repository settings
3. Share the public URL

**Option 3: Cloud Hosting**
- Netlify (drop files and done)
- Vercel (GitHub integration)
- AWS S3 + CloudFront

### Test Accessibility

1. **Keyboard Only**: Browse using only Tab and Enter keys
2. **Screen Reader**: 
   - Windows: Download NVDA (free)
   - Mac: Use built-in VoiceOver
3. **Color Contrast**: Use axe DevTools extension
4. **Mobile**: Test on phone and tablet

## Tips & Best Practices

### Writing Good Alt Text

❌ Bad: "Image of a graph"
✓ Good: "Line graph showing sales growth of 35% from January to March 2024"

### Video Descriptions

Include:
- Main topic/learning objective
- Key points covered
- Visual elements being shown
- Any important text displayed

### Content Organization

- **Heading**: Course title
- **Text**: Introduction/learning objectives
- **Heading**: Main topic
- **Text**: Explanation
- **Image**: Visual reinforcement
- **Heading**: Next topic
- **Video**: Demonstration or example

### Performance Tips

- Use compressed images (< 1MB each)
- Use MP4 format for videos (best browser support)
- Keep text concise and scannable
- Use headings to structure content

## Troubleshooting

### "Cannot GET /sites/course-name/index.html"

**Problem**: After exporting, can't see the site

**Solutions**:
1. Make sure backend is running: `http://localhost:5000/api/health`
2. Check browser console for errors
3. Click export button again
4. Check your course name has no special characters

### Images/Videos Not Loading

**Problem**: Broken image/video icons

**Solutions**:
1. Verify the URL is complete (starts with http:// or https://)
2. Test the URL in a new tab first
3. For videos, use MP4 format (.mp4 extension)
4. Check image size isn't too large

### Styling Looks Wrong

**Problem**: Generated site doesn't look right

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5 or Cmd+Shift+R)
3. Try a different browser
4. Check styles.css exists in output folder

## Quick Reference

| Action | How To |
|--------|--------|
| Add content | Click button in Toolbar (left panel) |
| Edit content | Click block, edit in Properties (right panel) |
| Reorder blocks | Click ↑ or ↓ buttons on block |
| Delete block | Click × button on block |
| Save course | Automatically saved when exported |
| Export to HTML | Click "↓ Export Site" button |

## Accessibility Checklist

Before sharing your course:

- [ ] All images have descriptive alt text
- [ ] All videos have descriptions
- [ ] Site works without a mouse (keyboard only)
- [ ] You can read it in a screen reader
- [ ] Text is readable (good contrast)
- [ ] Works on mobile devices

## Learn More

- **ACCESSIBILITY.md** - Complete 508 compliance guide
- **README.md** - Full documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/) - Accessibility resources

---

Ready to create amazing, accessible courses? 🚀

Need help? Check the troubleshooting section above or review the main README.
