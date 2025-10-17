# Save, Load & Template Features

## Overview

The Site Builder now includes comprehensive project persistence and template management features, allowing users to save their work, load existing projects, create courses from templates, and share projects via import/export.

## Features

### 1. Project Persistence

**Auto-Save**
- Projects are automatically saved to browser localStorage after any changes
- Auto-save triggers 2 seconds after the last change (debounced)
- Status indicator shows "✓ Auto-saved" in the editor header
- Auto-save timestamp tracked as `lastAutoSave`

**Manual Save**
- Create blank projects from Project List
- Save with project name and optional description
- Each project receives a unique ID based on timestamp
- Metadata tracked: `createdAt`, `updatedAt`, `lastAutoSave`

### 2. Project Management

**View All Projects**
- Project List displays all saved courses
- Shows project count badge in header
- Displays project info:
  - Project name
  - Number of pages
  - Page count badge
  - Creation date
  - Template badge (if created from template)

**Search Projects**
- Real-time search by project name
- Search input in toolbar
- Results update as you type

**Sort Projects**
- Sort options available:
  - Newest First (default)
  - Oldest First
  - By Name (alphabetical)
- Dropdown selector in toolbar

**Quick Actions**
- **Open**: Load project into editor
- **Duplicate**: Create a copy of project
- **Export**: Download as JSON file
- **Delete**: Remove project with confirmation

### 3. Template System

**Available Templates**

1. **Blank Course** (Getting Started)
   - Single welcome page
   - No pre-configured content
   - Best for: Starting from scratch

2. **Difficult Conservation** (Environmental)
   - 4-page comprehensive course
   - Modules on taxonomy, ecology, climate change, human impacts
   - 15+ lesson modules
   - 5 detailed case studies
   - Best for: Environmental education

3. **Business Training** (Business)
   - Multi-module business course
   - Communication, ethics, management topics
   - Professional content blocks
   - Best for: Corporate training

4. **Technical Documentation** (Technical)
   - Documentation-focused structure
   - Code examples and technical content
   - Reference materials
   - Best for: Technical education

**Creating from Template**
1. Click "From Template" in Project List
2. Browse templates by category
3. Select a template to view details
4. Enter course name
5. Click "Create Course"
6. Project created with all template pages and content
7. Ready to edit and customize

**Template Features**
- All templates include complete page structures
- Pre-configured content blocks with styling
- Proper heading hierarchies
- Image placeholders where applicable
- All IDs regenerated on creation (no duplicates)

### 4. Import/Export

**Export Project**
- Save project as JSON file
- Download to local computer
- Preserves all project data:
  - Project name and description
  - All pages and content
  - Formatting and styling
  - Timestamps
- Filename format: `{projectName}_export.json`

**Import Project**
- Load previously exported JSON files
- Import button in Project List toolbar
- Select JSON file from computer
- Project imported with:
  - New unique ID (prevents conflicts)
  - New creation timestamp
  - `importedAt` metadata
  - Original project name with "[Imported]" prefix

**Use Cases**
- Backup projects to computer
- Share projects with colleagues
- Migrate projects between devices
- Version control via file system

### 5. Data Storage

**Storage Location**
- Browser's localStorage
- Data persists between sessions
- Storage quota: ~5-10MB per origin

**Storage Keys**
- `siteBuilder_projects`: All saved projects
- `siteBuilder_templates`: Template definitions

**Data Structure**
```javascript
{
  id: number,
  name: string,
  description: string,
  pages: [
    {
      id: number,
      title: string,
      slug: string,
      content: [
        {
          id: number,
          type: string,
          content: string,
          // ... other properties
        }
      ]
    }
  ],
  templateId: string (optional),
  createdAt: ISO timestamp,
  updatedAt: ISO timestamp,
  lastAutoSave: ISO timestamp (optional),
  importedAt: ISO timestamp (optional)
}
```

## User Interface

### Project List

**Toolbar Components**
- New Blank Course button (+ icon)
- From Template button (📋 icon)
- Search input field
- Sort dropdown
- Import button

**Project Cards**
- Project name with ellipsis overflow handling
- Template badge (📋) if from template
- Page count and creation date
- Four action buttons:
  - Open (blue, 2x width)
  - Duplicate (gray icon button)
  - Export (gray icon button)
  - Delete (gray icon button)

**Message System**
- Toast notifications for user feedback
- Auto-dismisses after 4 seconds
- Success messages (green background)
- Error messages (red background)

### Editor

**Auto-Save Indicator**
- Appears next to project title
- Shows "✓ Auto-saved" briefly
- Fades out after 3 seconds
- Light blue color for visibility

## API Reference

### projectStorage.js Functions

```javascript
// Get all projects
getAllProjects() → Project[]

// Save or update a project
saveProject(project) → boolean

// Delete a project
deleteProject(projectId) → boolean

// Export project as JSON
exportProject(project) → void (downloads file)

// Import project from JSON file
importProject(file) → Promise<Project|null>

// Create new project from template
createProjectFromTemplate(templateId, projectName) → Project

// Get all available templates
getAvailableTemplates() → Template[]

// Duplicate existing project
duplicateProject(projectId) → Project|null

// Search projects by name
searchProjects(query) → Project[]

// Get project statistics
getProjectStats(projectId) → Object

// Auto-save project with timestamp
autoSaveProject(project) → boolean
```

## Best Practices

### For Users

1. **Name Projects Clearly**
   - Use descriptive names
   - Include course topic or department
   - Helps with searching and organizing

2. **Regular Exports**
   - Export important projects periodically
   - Store backups in cloud or external drive
   - Maintains version history

3. **Use Templates**
   - Start with template matching your content type
   - Saves time on initial setup
   - Provides structure and best practices

4. **Organize with Search**
   - Use search bar to find projects quickly
   - Sort by date or name as needed
   - Delete old draft projects

### For Developers

1. **localStorage Quota**
   - Monitor total size of projects
   - Implement archiving for very large projects
   - Consider cloud sync for future scalability

2. **Error Handling**
   - Check return values of save operations
   - Handle JSON parsing errors on import
   - Provide clear error messages to users

3. **Timestamp Management**
   - Always use ISO strings for timestamps
   - Update `updatedAt` on project modifications
   - Set `lastAutoSave` on auto-save operations

## Technical Details

### Auto-Save Implementation

```javascript
// 2-second debounce on changes
useEffect(() => {
  const timer = setTimeout(() => {
    autoSaveProject(updatedProject);
    setAutoSaveStatus('✓ Auto-saved');
    setTimeout(() => setAutoSaveStatus(''), 3000);
  }, 2000);
  
  return () => clearTimeout(timer);
}, [blocks, currentPage, project]);
```

### Template Creation

```javascript
// Creates project from template with new IDs
const project = createProjectFromTemplate(templateId, projectName);
// - Generates new project ID
// - Regenerates all page IDs
// - Regenerates all content block IDs
// - Sets templateId reference
// - Creates timestamps
```

### Search Implementation

```javascript
// Real-time search with filter
const filtered = projects.filter(p =>
  p.name.toLowerCase().includes(query.toLowerCase())
);
```

## Limitations & Future Enhancements

### Current Limitations
- localStorage limited to ~5-10MB
- No automatic cloud backup
- Single browser/device storage
- Manual backup required

### Planned Enhancements
- Cloud storage integration (Google Drive, Dropbox)
- Collaborative editing
- Project sharing with links
- Version history tracking
- Scheduled automatic backups
- Cross-device synchronization

## Troubleshooting

### Projects Not Saving
- Check browser storage settings
- Ensure localStorage is enabled
- Clear browser cache if issues persist
- Try exporting to backup

### Import Failed
- Verify JSON file is valid export
- Check file hasn't been modified
- Try re-exporting from another browser
- Contact support if file is corrupted

### Storage Full
- Export and delete unused projects
- Clear browser cache
- Use cloud storage for backups
- Consider archiving old projects

## Accessibility

All save/load features include:
- ARIA labels on all buttons
- Keyboard navigation support
- Focus-visible states
- Clear status messages
- Confirmation dialogs for destructive actions
- Color-blind friendly indicator styles

---

**Last Updated**: 2024
**Version**: 1.0
