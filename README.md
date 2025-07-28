# Project Tracking Application

A comprehensive web application for managing projects, resources, milestones, and financial tracking with real-time monitoring and reporting capabilities.

## Features

### 🎯 Core Modules

1. **Project Management Module**
   - Create, edit, and archive project details
   - Track PO details, budgets, and timelines
   - Automatic budget calculation (70% of PO amount)
   - Resource allocation linking

2. **Resource Management Module**
   - Maintain detailed resource profiles
   - Track cost details and experience
   - Monitor resource utilization across projects
   - Skills and certification management

3. **Milestone Management Module**
   - Define and track project milestones
   - Monitor scheduled vs actual completion dates
   - Billing milestone integration
   - Status indicators and progress tracking

4. **Financial Tracking Module**
   - Budget vs actual spending tracking
   - Real-time expenditure monitoring
   - Billing milestone management
   - Budget overrun alerts

5. **Monitoring and Reporting Module**
   - Track effort and duration slippage
   - Generate project status reports
   - Financial summaries and analysis
   - Resource utilization reports

## Technology Stack

- **Frontend**: React 18+ with React Router
- **Backend**: Node.js with Express.js
- **Database**: SQLite (development) / SQL Server (production)
- **Deployment**: Azure Web Apps
- **CI/CD**: GitHub Actions

## Quick Start

### Prerequisites

- Node.js 14+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NiranjanOrgGround/project-tracking-application.git
   cd project-tracking-application
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
   Backend will run on http://localhost:5000

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm start
   ```
   Frontend will run on http://localhost:3000

## Project Structure

```
project-tracking-application/
├── backend/                 # Node.js API server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── .github/workflows/      # GitHub Actions CI/CD
└── README.md              # This file
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create new resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Milestones
- `GET /api/milestones/:projectId` - Get milestones for project
- `POST /api/milestones` - Create new milestone
- `PUT /api/milestones/:id` - Update milestone
- `DELETE /api/milestones/:id` - Delete milestone

### Dashboard
- `GET /api/dashboard` - Get dashboard summary data

## Development

### Running Tests

Backend tests:
```bash
cd backend
npm test
```

Frontend tests:
```bash
cd frontend
npm test
```

### Building for Production

Build frontend:
```bash
cd frontend
npm run build
```

### Database Schema

The application uses SQLite for development with the following tables:
- `projects` - Project information and budgets
- `resources` - Resource profiles and rates
- `milestones` - Project milestones and billing
- `resource_allocations` - Resource-project assignments
- `financial_records` - Financial transactions

## Deployment

The application is configured for deployment on Azure Web Apps using GitHub Actions:

1. **Set up Azure Web App**
2. **Configure GitHub Secrets**:
   - `AZURE_WEBAPP_NAME`
   - `AZURE_WEBAPP_PUBLISH_PROFILE`
3. **Push to main branch** - Automatic deployment via GitHub Actions

## Business Requirements Compliance

✅ **Project Management**: Full CRUD operations for projects with PO tracking  
✅ **Resource Management**: Comprehensive resource profiles with cost tracking  
✅ **Milestone Management**: Scheduled vs actual tracking with billing integration  
✅ **Financial Tracking**: Budget monitoring and billing milestone management  
✅ **Reporting**: Dashboard analytics and utilization reports  
✅ **Integration**: Seamless data flow between all modules  
✅ **Minimalistic Design**: Clean, intuitive user interface  
✅ **Technology Stack**: Node.js backend + React frontend  
✅ **CI/CD**: GitHub Actions deployment pipeline  
✅ **Cloud Deployment**: Azure Web Apps ready

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.