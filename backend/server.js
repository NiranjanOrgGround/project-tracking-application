const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Projects table
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    project_id TEXT UNIQUE NOT NULL,
    po_number TEXT,
    po_date TEXT,
    client TEXT,
    start_date TEXT,
    end_date TEXT,
    po_amount REAL,
    project_budget REAL,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Resources table
  db.run(`CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    resource_id TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    salary REAL,
    hourly_rate REAL,
    experience_years INTEGER,
    skills TEXT,
    certifications TEXT,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Milestones table
  db.run(`CREATE TABLE IF NOT EXISTS milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    scheduled_date TEXT,
    actual_date TEXT,
    billing_amount REAL,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id)
  )`);

  // Resource allocations table
  db.run(`CREATE TABLE IF NOT EXISTS resource_allocations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    resource_id INTEGER,
    allocation_percentage REAL,
    start_date TEXT,
    end_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id),
    FOREIGN KEY (resource_id) REFERENCES resources (id)
  )`);

  // Financial records table
  db.run(`CREATE TABLE IF NOT EXISTS financial_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    type TEXT NOT NULL,
    amount REAL,
    description TEXT,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id)
  )`);
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Project Tracking API is running' });
});

// Projects endpoints
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/projects', (req, res) => {
  const { name, project_id, po_number, po_date, client, start_date, end_date, po_amount } = req.body;
  const project_budget = po_amount * 0.7; // 70% of PO amount

  const stmt = db.prepare(`INSERT INTO projects 
    (name, project_id, po_number, po_date, client, start_date, end_date, po_amount, project_budget) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  stmt.run([name, project_id, po_number, po_date, client, start_date, end_date, po_amount, project_budget], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Project created successfully' });
  });
  stmt.finalize();
});

// Resources endpoints
app.get('/api/resources', (req, res) => {
  db.all('SELECT * FROM resources ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/resources', (req, res) => {
  const { name, resource_id, email, phone, salary, hourly_rate, experience_years, skills, certifications } = req.body;
  
  const stmt = db.prepare(`INSERT INTO resources 
    (name, resource_id, email, phone, salary, hourly_rate, experience_years, skills, certifications) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  stmt.run([name, resource_id, email, phone, salary, hourly_rate, experience_years, skills, certifications], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Resource created successfully' });
  });
  stmt.finalize();
});

// Milestones endpoints
app.get('/api/milestones/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  db.all('SELECT * FROM milestones WHERE project_id = ? ORDER BY scheduled_date', [projectId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/milestones', (req, res) => {
  const { project_id, name, description, scheduled_date, billing_amount } = req.body;
  
  const stmt = db.prepare(`INSERT INTO milestones 
    (project_id, name, description, scheduled_date, billing_amount) 
    VALUES (?, ?, ?, ?, ?)`);
  
  stmt.run([project_id, name, description, scheduled_date, billing_amount], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Milestone created successfully' });
  });
  stmt.finalize();
});

// Dashboard data endpoint
app.get('/api/dashboard', (req, res) => {
  const data = {};
  
  // Get project counts
  db.get('SELECT COUNT(*) as total FROM projects', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    data.totalProjects = result.total;
    
    // Get resource counts
    db.get('SELECT COUNT(*) as total FROM resources', (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      data.totalResources = result.total;
      
      // Get milestone counts
      db.get('SELECT COUNT(*) as total FROM milestones', (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        data.totalMilestones = result.total;
        
        // Get recent projects
        db.all('SELECT * FROM projects ORDER BY created_at DESC LIMIT 5', (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          data.recentProjects = rows;
          res.json(data);
        });
      });
    });
  });
});

// Only start server if this file is run directly (not required as module)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;