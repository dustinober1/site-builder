# Save/Load/Templates Feature - Visual Overview

## User Interface Flow

### Welcome Screen
```
┌─────────────────────────────────────┐
│     Site Builder                    │
│                                     │
│   [Get Started →]                   │
└─────────────────────────────────────┘
         ↓
    (to Project List)
```

### Project List Screen

```
┌─────────────────────────────────────────────────────────────────┐
│ 📚 Courses    [5 projects]                              [← Back] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [+ Blank] [📋 Template] [Search...] [Sort: Newest ▼] [📤 Import] │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│ │ Difficult Conv. │  │ Business 101    │  │ Technical Docs  │ │
│ │ 📋 4 pages     │  │    3 pages      │  │    5 pages      │ │
│ │ Dec 15, 2024   │  │ Dec 14, 2024    │  │ Dec 10, 2024    │ │
│ │                 │  │                 │  │                 │ │
│ │ [Open] [D][📥][🗑]│ │[Open] [D][📥][🗑]│ │[Open] [D][📥][🗑]│
│ └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│ ┌─────────────────┐  ┌─────────────────┐                       │
│ │ My First Course │  │ Course Copy     │                       │
│ │ 1 page          │  │ 4 pages         │                       │
│ │ Dec 9, 2024     │  │ Dec 8, 2024     │                       │
│ │                 │  │                 │                       │
│ │ [Open] [D][📥][🗑]│ │[Open] [D][📥][🗑]│                       │
│ └─────────────────┘  └─────────────────┘                       │
│                                                                 │
│ ✓ Project saved                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Legend:
  D = Duplicate
  📥 = Export
  🗑 = Delete
  ✓ = Auto-save indicator
```

### Template Gallery Modal

```
┌────────────────────────────────────────────────────────────┐
│ Explore Course Templates                              [✕]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Getting Started        Environmental      Business        │
│ ┌─────────────┐       ┌─────────────┐   ┌─────────────┐  │
│ │ Blank       │       │ Difficult   │   │ Business    │  │
│ │ Course      │       │ Conserv.    │   │ Training    │  │
│ └─────────────┘       └─────────────┘   └─────────────┘  │
│                                                            │
│ Technical                                                  │
│ ┌─────────────┐                                           │
│ │ Technical   │                                           │
│ │ Document.   │                                           │
│ └─────────────┘                                           │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Selected: Difficult Conservation                           │
│ Pages: 4                                                   │
│ Modules: 15+                                               │
│                                                            │
│ Course Name: [______________________]                     │
│                                                            │
│ [Create Course] [Back] [Cancel]                           │
└────────────────────────────────────────────────────────────┘
```

### Editor Screen with Auto-Save

```
┌──────────────────────────────────────────────────────────────────┐
│ [← Back] My Conservation Course ✓ Auto-saved  [👁 Preview][↓ Export]
├──────────────────────────────────────────────────────────────────┤
│  [+ Text] [+ Image] [+ Heading] [+ List] [+ Button]             │
├─────────────────────────────┬──────────────────────────────────┤
│                             │                                  │
│ Course Content              │  Properties Panel               │
│                             │  ┌──────────────────────────┐  │
│ ┌───────────────────────┐   │  │ Block: Heading            │  │
│ │ Welcome              │   │  │                           │  │
│ │ 🔲                   │   │  │ Content:                 │  │
│ ├───────────────────────┤   │  │ [___________________]    │  │
│ │ Taxonomy             │   │  │                           │  │
│ │ 🔲                   │ ⟵─┼─→ │ [Delete Block]           │  │
│ │ 🔲                   │   │  │                           │  │
│ │ 🔲                   │   │  │ [Save Changes]           │  │
│ ├───────────────────────┤   │  └──────────────────────────┘  │
│ │ Add Block...        │   │                                  │
│ │ ▼                   │   │                                  │
│ └───────────────────────┘   │                                  │
│                             │                                  │
└─────────────────────────────┴──────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────────┐
│    App Start     │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────┐
│ getAllProjects()                 │
│ from localStorage                │
└────────┬─────────────────────────┘
         │
         ├──────────────────────────────────┐
         ↓                                  ↓
    Has Projects              No Projects
         │                         │
         ↓                         ↓
    Projects List             Welcome Screen
    (display all)             (call to action)
         │                         │
         ├─────────────┬───────────┤
         │             │           │
         ↓             ↓           ↓
      Create       Create from   Back to
      Blank        Template      Welcome
         │             │           │
         └─────────────┼───────────┘
                       │
                       ↓
              ┌────────────────────┐
              │ createProjectFrom   │
              │ Template()          │
              │ OR                  │
              │ saveProject()       │
              └────────┬───────────┘
                       │
                       ↓
              ┌────────────────────┐
              │ Open in Editor     │
              │ (project loaded)   │
              └────────┬───────────┘
                       │
    ┌──────────────────┼──────────────────┐
    ↓                  ↓                  ↓
Edit Content      Export Project    Auto-Save
    │                  │                  │
    ↓                  ↓                  ↓
Trigger          exportProject()    autoSaveProject()
Auto-Save             │                  │
    │                 ↓                  ↓
    └────→ updateProject() ←─────────────┘
           saveProject()
           (to localStorage)
```

## State Management

### ProjectList State
```javascript
{
  projectName: string,           // New project name
  projects: Project[],           // All loaded projects
  showForm: boolean,             // Show new project form
  showTemplates: boolean,        // Show template gallery
  searchQuery: string,           // Search filter text
  message: {
    text: string,
    type: 'success' | 'error'
  },
  selectedSort: string           // Sort option (newest/oldest/name)
}
```

### Editor State
```javascript
{
  currentPage: Page,             // Currently editing page
  blocks: ContentBlock[],        // Blocks on current page
  selectedBlockId: number,       // Currently selected block
  isGenerating: boolean,         // Export in progress
  message: string,               // Export message
  isPreviewOpen: boolean,        // Preview modal open
  autoSaveStatus: string         // "✓ Auto-saved" text
}
```

## Template Structure

```javascript
AVAILABLE_TEMPLATES = {
  blank: {
    id: "blank",
    name: "Blank Course",
    category: "Getting Started",
    description: "Start with a blank course",
    pages: [
      {
        id: 1,
        title: "Welcome",
        slug: "welcome",
        content: []
      }
    ]
  },
  "difficult-conservation": {
    id: "difficult-conservation",
    name: "Difficult Conservation",
    category: "Environmental",
    description: "Comprehensive course on conservation challenges",
    pages: [
      { /* Taxonomy page */ },
      { /* Ecology page */ },
      { /* Climate Change page */ },
      { /* Human Impacts page */ }
    ]
  },
  // ... more templates
}
```

## Feature Timeline

```
User Journey → Feature
──────────────────────

1. App Opens
   ↓
   Check localStorage for projects
   ↓
   Decide: New Project OR Load Existing

2. New Project Path
   ↓
   Choose: Blank OR Template
   ↓
   Enter Name
   ↓
   Open in Editor
   ↓
   Edit Content → Auto-Save
   ↓
   Export for Backup

3. Load Project Path
   ↓
   View Project List
   ↓
   Search/Sort Projects
   ↓
   Select Action:
   ├─ Open → Edit → Auto-Save
   ├─ Duplicate → New Copy Created
   ├─ Export → JSON Downloaded
   ├─ Delete → Removed
   └─ Import → Restore from JSON
```

## CSS Component Hierarchy

```
ProjectList.css
├── .project-list (container)
├── .project-header (gradient header)
├── .toolbar (search, sort, buttons)
├── .search-input (search field)
├── .sort-select (sort dropdown)
├── .create-button (new project)
├── .template-button (from template)
├── .import-label (import button)
├── .message (toast notification)
│   ├── .success (green)
│   └── .error (red)
├── .projects-grid (project card layout)
├── .project-card (individual card)
│   ├── .card-header (title)
│   ├── .template-badge (if template)
│   ├── .project-info (metadata)
│   │   ├── .pages-count (page badge)
│   │   └── .date (creation date)
│   └── .card-actions (buttons)
│       ├── .open-button
│       ├── .duplicate-button
│       ├── .export-button
│       └── .delete-button
└── .empty-state (no projects)

TemplateGallery.css
├── .template-gallery (modal overlay)
├── .gallery-header (gradient header)
├── .gallery-grid (template cards)
├── .template-card (individual template)
├── .template-detail (selected template)
├── .detail-actions (buttons)
└── @media queries (responsive)

Editor.css
├── .editor-header
├── .header-left
├── .header-right
├── .auto-save-status (new)
└── @keyframes fadeInOut (new)
```

## localStorage Keys and Format

```
Key: "siteBuilder_projects"
Value: [
  {
    id: 1702632000000,
    name: "Difficult Conservation",
    description: "...",
    pages: [...],
    templateId: "difficult-conservation",
    createdAt: "2024-12-15T10:00:00Z",
    updatedAt: "2024-12-15T12:30:00Z",
    lastAutoSave: "2024-12-15T12:30:00Z"
  },
  ...
]

Key: "siteBuilder_templates"
Value: {
  blank: {...},
  "difficult-conservation": {...},
  "business-training": {...},
  "technical-documentation": {...}
}
```

## Responsive Breakpoints

```
Desktop (1000px+)
┌───────────────────────────────┐
│ Toolbar: 1 row, all visible  │
│ Project Grid: 3+ columns     │
│ Card Actions: 4 buttons      │
└───────────────────────────────┘

Tablet (768px - 999px)
┌──────────────────────┐
│ Toolbar: 2 rows     │
│ Project Grid: 2 col │
│ Card Actions: 2 row │
└──────────────────────┘

Mobile (480px - 767px)
┌──────────────┐
│ Toolbar: 3+ rows
│ Project Grid: 1 col
│ Card Actions: 2x2
└──────────────┘

Small Mobile (<480px)
┌────────────┐
│ Toolbar: stacked
│ Grid: 1 col
│ Actions: full width
└────────────┘
```

---

This visual overview provides a quick reference for understanding the save/load/templates feature architecture and user experience.
