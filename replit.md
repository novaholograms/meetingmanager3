## Overview
A dynamic web application for comprehensive meeting management, designed to enhance team collaboration through intelligent task tracking, real-time interactions, and advanced collaboration features. It supports detailed meeting documentation, including PDF export. The project aims to streamline workflows, improve meeting efficiency, and provide robust tools for organizational management.

## User Preferences
- Comprehensive testing before deployment
- Ensure all functionality works identically in production as in development
- Fix deployment issues without affecting development functionality
- Provide working production deployment at https://consultator.replit.app/
- **CRITICAL**: Understand Excel data structure correctly - distinguish between meeting titles, committee/project names, and task themes
- Excel column mapping: A=Meeting Title, B=Committee/Project, G=Task/Theme, J=Code, K=Objective, L=Instrument

## System Architecture
The application is built with a modular component architecture.
- **Frontend**: React with TypeScript, utilizing Vite for tooling and Tailwind CSS for responsive UI design. Includes custom state management hooks.
- **Backend**: Express.js, handling authentication, WebSocket communication, and database interactions.
- **Database**: PostgreSQL, managed with Drizzle ORM.
- **Real-time Communication**: Implemented via WebSockets for live updates and interactive features.
- **Authentication**: Managed using Passport.js with robust session handling and user management.
- **File Handling**: Multer is used for file uploads, specifically for user avatars and Excel imports.
- **Key Features**:
    - **Meeting Management**: Comprehensive tools for creating, tracking, and documenting meetings, including PDF export of meeting summaries.
    - **Task Management**: Intelligent task tracking with hierarchical linking (Project/Committee → Objective/Group → Instrument/Subgroup → Task/Theme) and automatic sequential task code generation. Supports search by task name or code.
    - **Excel Import**: Unified Excel importer with intelligent error analysis and reporting for efficient data ingestion. Supports specific user Excel formats and validates data for correct committee, project, and task associations.
    - **Collaboration Tools**: Real-time user interactions, editable meeting notes, and enhanced proposal/response management with correct user attribution.
    - **UI/UX**: Redesigned authentication pages for a modern, focused experience. Improved interaction models for notes editing and hierarchical navigation.
    - **Data Validation**: Comprehensive validation system to prevent incomplete data entries and guide users through correction.
    - **Gantt Chart & Calendar**: Visualization of tasks in Gantt charts and meetings in a calendar view, ensuring proper date parsing and display.
    - **Unification Strategy**: Ongoing effort to unify "Level 4" data (tasks and keypoints) to eliminate duplication and enhance data consistency, employing a phased migration approach with full documentation and rollback capabilities.

## External Dependencies
- PostgreSQL (Database)
- Drizzle ORM
- Tailwind CSS
- Express.js
- Passport.js
- Multer
- WebSocket (for real-time communication)
- Vite (Frontend tooling)
- date-fns (for date parsing)
- FullCalendar (for calendar visualization)