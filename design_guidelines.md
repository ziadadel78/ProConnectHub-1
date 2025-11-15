# ProConnect Hub - Design Guidelines

## Design Approach
**Hybrid System**: Drawing from modern SaaS marketplaces (Upwork, Fiverr) for marketplace features and productivity tools (Linear, Notion) for dashboards and admin interfaces. This creates a professional, trustworthy platform that balances marketplace energy with productivity tool efficiency.

## Typography
- **Primary Font**: Inter (Google Fonts) - clean, professional, excellent readability
- **Headings**: 
  - H1: 3xl (36px), font-semibold
  - H2: 2xl (24px), font-semibold  
  - H3: xl (20px), font-medium
- **Body**: base (16px), font-normal
- **Small/Meta**: sm (14px), font-normal
- **UI Elements**: medium weight for buttons, semibold for emphasis

## Layout System
**Tailwind Spacing Primitives**: Use 2, 4, 6, 8, 12, 16, 24 as core spacing units
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-24
- Grid gaps: gap-4, gap-6, gap-8
- Container: max-w-7xl for main content, max-w-6xl for focused sections

## Component Library

### Navigation
- **Main Header**: Fixed top navigation with logo left, search bar center, auth/profile right
- **Dashboard Sidebar**: Collapsible left sidebar (280px expanded, 64px collapsed) with icon + label navigation
- **Tab Navigation**: Horizontal tabs for switching between views (Jobs/Proposals, Active/Completed)

### Marketplace Components
- **Job Cards**: Grid layout (3 columns desktop, 2 tablet, 1 mobile) with title, budget, skills tags, posted time, proposals count
- **Freelancer Cards**: Avatar, name, title, rating stars, hourly rate, featured skills
- **Search Bar**: Prominent search with filters dropdown, category selector, budget range
- **Filter Sidebar**: Checkbox groups for skills, experience level, location, availability

### Portfolio System
- **Portfolio Grid**: Masonry or equal-height grid (3 columns) showcasing project thumbnails
- **Project Detail Modal**: Full-screen overlay with image gallery, description, tech stack tags, metrics
- **Upload Interface**: Drag-and-drop zone with preview thumbnails

### Dashboard Components
- **Analytics Cards**: 4-column stat cards (Total Earnings, Active Jobs, Proposals Sent, Success Rate) with icon, number, trend indicator
- **Chart Widgets**: Line/bar charts for earnings over time, job completion rates
- **Activity Feed**: Timeline-style list showing recent actions, messages, job updates
- **Quick Actions**: Primary CTA buttons for "Post Job", "Browse Freelancers", "Create Proposal"

### Messaging System
- **Chat Interface**: Two-column layout - conversation list left (320px), message thread right with message bubbles, timestamp, status indicators
- **Message Composer**: Text input with attachment button, emoji picker, send button

### Forms & Inputs
- **Input Fields**: Consistent height (h-12), rounded borders (rounded-lg), focus states with ring
- **Textareas**: Min height h-32 for descriptions
- **Dropdowns**: Custom styled select menus with icon indicators
- **File Upload**: Bordered dashed upload zone with icon and helper text
- **Buttons**: 
  - Primary: Solid background, h-12, px-6, rounded-lg
  - Secondary: Outlined border, same dimensions
  - Icon buttons: Square 40x40px

### Admin Panel
- **Data Tables**: Sortable columns, row hover states, action dropdowns
- **Metrics Dashboard**: Large stat cards with comparison percentages
- **User Management**: List view with search, filters, bulk actions
- **Moderation Queue**: Card-based review interface with approve/reject actions

### Marketing Tools
- **Campaign Builder**: Step-by-step wizard interface with progress indicator
- **Analytics Display**: Mixed card and chart layout showing campaign performance
- **Template Gallery**: Grid of pre-built marketing templates with preview

## Images

### Hero Section (Landing/Marketing Pages)
- **Main Hero**: Full-width background image (1920x800px) showing diverse freelancers collaborating or working on laptops in modern workspace
- **Treatment**: Subtle overlay gradient to ensure text readability
- **CTA Buttons**: Blurred background (backdrop-blur-sm) with semi-transparent background

### Dashboard & Portfolio
- **User Avatars**: 40x40px (small), 64x64px (medium), 120x120px (large profile)
- **Portfolio Project Images**: 400x300px thumbnails, maintain 4:3 aspect ratio
- **Job/Company Logos**: 48x48px square avatars

### Placeholder Strategy
- Use avatar placeholder icons for users without photos
- Use image icon placeholders for portfolio items being uploaded
- Gradient backgrounds for empty states

## Key Principles
1. **Information Density**: Dashboards and admin interfaces prioritize data display efficiency
2. **Card-Based Design**: Consistent use of elevated cards (shadow-sm) for content grouping
3. **Clear Hierarchy**: Strong visual distinction between primary, secondary, and tertiary actions
4. **Responsive Grid**: Mobile-first approach with breakpoints at sm(640px), md(768px), lg(1024px), xl(1280px)
5. **Status Indicators**: Color-coded badges for job status (open, in-progress, completed), proposal states
6. **Trust Signals**: Rating stars, verification badges, review counts prominently displayed
7. **Progressive Disclosure**: Use modals, drawers, and expandable sections to manage complexity