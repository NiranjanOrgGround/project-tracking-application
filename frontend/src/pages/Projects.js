import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    project_id: '',
    po_number: '',
    po_date: '',
    client: '',
    start_date: '',
    end_date: '',
    po_amount: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.create({
        ...formData,
        po_amount: parseFloat(formData.po_amount)
      });
      setShowForm(false);
      setFormData({
        name: '',
        project_id: '',
        po_number: '',
        po_date: '',
        client: '',
        start_date: '',
        end_date: '',
        po_amount: ''
      });
      fetchProjects();
    } catch (err) {
      setError('Failed to create project');
      console.error('Create project error:', err);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Add New Project</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Project ID</label>
                <input
                  type="text"
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>PO Number</label>
                <input
                  type="text"
                  name="po_number"
                  value={formData.po_number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>PO Date</label>
                <input
                  type="date"
                  name="po_date"
                  value={formData.po_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Client</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>PO Amount</label>
                <input
                  type="number"
                  step="0.01"
                  name="po_amount"
                  value={formData.po_amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <button type="submit" className="btn">Create Project</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2>All Projects</h2>
        {projects.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project ID</th>
                <th>Client</th>
                <th>PO Amount</th>
                <th>Budget (70%)</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.project_id}</td>
                  <td>{project.client}</td>
                  <td>${project.po_amount?.toLocaleString()}</td>
                  <td>${project.project_budget?.toLocaleString()}</td>
                  <td>{project.start_date}</td>
                  <td>{project.end_date}</td>
                  <td>
                    <span className={`status-${project.status?.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No projects found. Create your first project using the "Add Project" button.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;