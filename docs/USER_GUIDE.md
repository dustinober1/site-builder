# Site Builder - Complete User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Creating Your First Project](#creating-your-first-project)
3. [Working with Content Blocks](#working-with-content-blocks)
4. [Managing Pages](#managing-pages)
5. [Previewing Your Site](#previewing-your-site)
6. [Exporting and Publishing](#exporting-and-publishing)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Tips and Best Practices](#tips-and-best-practices)

## Getting Started

### Welcome Screen
When you first launch Site Builder, you'll see the welcome screen with:
- Overview of features
- Quick start guide
- Option to create your first course or view existing projects

### Creating Your First Project

1. **Click "Get Started"** on the welcome screen
2. **Click "Create New Course"** button
3. **Enter your project name** (e.g., "Employee Safety Training")
4. **Click "Create"** to open the editor

Your project is automatically saved to your browser's local storage.

## Working with Content Blocks

### Available Block Types

#### 1. **Heading Block**
- Creates large, prominent section titles
- Use for main section headers
- Automatically formatted as semantic `<h2>` tags for accessibility
- **How to add:** Click "Heading" button in the toolbar

#### 2. **Text Block**
- For paragraphs, descriptions, and longer content
- Supports multiple lines
- Best for body content and instructions
- **How to add:** Click "Text" button in the toolbar

#### 3. **Image Block**
- Displays images in your course
- **Required:** Alt text for accessibility
- Optional title/caption
- Supports: JPG, PNG, GIF, SVG formats
- **How to add:** Click "Image" button in the toolbar
- **Best practices:**
  - Use descriptive alt text (e.g., "Safety equipment diagram showing helmet, gloves, and boots")
  - Keep file sizes reasonable (< 2MB per image)
  - Use web-optimized formats

#### 4. **Video Block**
- Embeds video content
- **Required:** Video description for accessibility
- Supports: MP4, WebM, OGG formats
- Includes playback controls
- **How to add:** Click "Video" button in the toolbar

#### 5. **Knowledge Check (Quiz)**
- Create interactive quiz questions
- Multiple choice format
- Immediate feedback for learners
- Track correct answers
- **How to add:** Click "Knowledge Check" button

#### 6. **Advanced Question**
- Complex quiz with multiple question types
- Detailed feedback options
- Custom scoring
- **How to add:** Click "Advanced Question" button

#### 7. **Branching Scenario**
- Create decision-based learning paths
- Multiple outcomes based on choices
- Ideal for scenario-based training
- **How to add:** Click "Branching" button

### Editing Content Blocks

1. **Click on any block** to select it
2. The **Properties Panel** opens on the right
3. **Edit the content** in the form fields
4. Changes are **saved automatically** as you type

### Managing Block Order

- Use the **up/down arrows** on each block to reorder
- Blocks move one position at a time
- Reordering is instant with no page reload

### Deleting Blocks

1. **Select the block** you want to remove
2. **Click the "Delete Block" button** in the Properties Panel
3. Block is removed immediately (no undo, so be careful!)

## Managing Pages

### Multi-Page Courses

Your course can have multiple pages:

1. **View page list** in the editor sidebar
2. **Add new pages** with the "Add Page" button
3. **Switch between pages** by clicking page names
4. **Reorder pages** using drag handles
5. **Delete pages** with the trash icon

### Page Settings

Each page has:
- **Title:** Display name (e.g., "Module 1: Introduction")
- **Slug:** URL-friendly name (e.g., "module-1-introduction")
- **Content:** All blocks added to that page

## Previewing Your Site

### Preview Mode

1. **Click "Preview" button** in the header
2. View your site **exactly as learners will see it**
3. Test all interactions and navigation
4. **Close preview** to return to editing

### What You'll See in Preview

- Full navigation between pages
- All content blocks rendered
- Interactive elements functional
- Mobile-responsive layout
- 508-compliant accessibility features

## Exporting and Publishing

### Standard Export

1. **Click "Generate Site"** button in the header
2. Wait for "Site generated successfully" message
3. Your site is saved to `output-sites/[project-name]/`
4. **View your site** at `http://localhost:5000/sites/[project-name]/index.html`

### What Gets Generated

- `index.html` - Landing page with navigation
- `[page-slug].html` - Individual page files
- `styles.css` - Complete styling
- All content embedded and ready to deploy

### SCORM Export

For Learning Management System (LMS) deployment:

1. **Click "Export as SCORM"** (coming soon)
2. Choose SCORM 1.2 or SCORM 2004
3. Download the .zip package
4. Upload to your LMS (Moodle, Canvas, etc.)

### Hosting Your Site

Your generated site is 100% static HTML/CSS and can be hosted anywhere:

**Free Options:**
- Netlify (drag & drop)
- GitHub Pages
- Vercel
- Surge.sh

**Cloud Hosting:**
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps

**Traditional Hosting:**
- Any web hosting with FTP access
- Upload files via FTP/SFTP
- Point domain to folder

## Keyboard Shortcuts

### Editor Navigation
- `Tab` - Move focus to next element
- `Shift + Tab` - Move focus to previous element
- `Enter` - Activate buttons/links
- `Space` - Activate buttons
- `Esc` - Close dialogs/panels

### Efficiency Tips
- Use Tab to quickly navigate between blocks
- Arrow keys work in the Properties Panel
- Enter to submit forms

## Tips and Best Practices

### Content Writing

1. **Keep it concise** - Break long content into multiple blocks
2. **Use headings** - Structure content with clear headings
3. **Add visuals** - Include images to break up text
4. **Write descriptively** - Use clear, simple language

### Accessibility

1. **Always add alt text** - Required for images
2. **Use descriptive headings** - Help screen reader users navigate
3. **Provide video descriptions** - Essential for deaf/hard-of-hearing users
4. **Test with keyboard** - Navigate without mouse
5. **Check color contrast** - Use high contrast for readability

### Performance

1. **Optimize images** - Compress before uploading
2. **Limit video file sizes** - Use streaming if possible
3. **Don't overload pages** - Split long courses into multiple pages
4. **Test loading times** - Preview on slow connections

### Organization

1. **Name projects clearly** - Use descriptive names
2. **Plan page structure** - Outline before building
3. **Group related content** - Keep topics together
4. **Review regularly** - Check for outdated content

### Save and Backup

1. **Projects auto-save** - Saved to browser local storage
2. **Export regularly** - Generate sites as backups
3. **Browser data can be cleared** - Export important projects
4. **Multiple browsers** - Each browser has separate storage

### Common Mistakes to Avoid

❌ **Don't:**
- Skip alt text on images
- Create pages that are too long
- Forget to preview before exporting
- Use low-contrast colors
- Ignore accessibility warnings

✅ **Do:**
- Test on different devices
- Preview frequently while building
- Use consistent formatting
- Keep accessibility in mind
- Save/export your work

## Troubleshooting

### Project Won't Save
- Check browser storage isn't full
- Try a different browser
- Clear old projects if needed

### Images Not Appearing
- Verify URL is correct and accessible
- Check file format is supported
- Ensure URL is publicly accessible (not local files)

### Preview Not Working
- Refresh the page
- Check for browser console errors
- Ensure backend server is running

### Export Failed
- Verify project has at least one page
- Check that project name is valid
- Ensure backend server is running at localhost:5000

### Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Not Supported:**
- Internet Explorer (any version)

## Getting Help

If you encounter issues:

1. Check this guide first
2. Review the troubleshooting section
3. Check browser console for errors (F12)
4. Verify backend server is running
5. Try in a different browser

---

**Happy Course Building!** 🚀

*Last updated: October 2025*
