import React, { useState, useEffect } from 'react';
import { milestoneService, projectService } from '../services/api';

const Milestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    name: '',
    description: '',
    scheduled_date: '',
    billing_amount: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchMilestones(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProject(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async (projectId) => {
    try {
      setLoading(true);
      const response = await milestoneService.getByProject(projectId);
      setMilestones(response.data);
    } catch (err) {
      setError('Failed to fetch milestones');
      console.error('Milestones error:', err);
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
      await milestoneService.create({
        ...formData,
        project_id: parseInt(formData.project_id),
        billing_amount: formData.billing_amount ? parseFloat(formData.billing_amount) : null
      });
      setShowForm(false);
      setFormData({
        project_id: '',
        name: '',
        description: '',
        scheduled_date: '',
        billing_amount: ''
      });
      if (selectedProject) {
        fetchMilestones(selectedProject);
      }
    } catch (err) {
      setError('Failed to create milestone');
      console.error('Create milestone error:', err);
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  if (loading) return <div className="loading">Loading milestones...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Milestones</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Milestone'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {projects.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Filter by Project</h2>
          <div className="form-group">
            <label>Select Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.project_id})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Add New Milestone</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Project</label>
                <select
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.project_id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Milestone Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Scheduled Date</label>
                <input
                  type="date"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Billing Amount</label>
                <input
                  type="number"
                  step="0.01"
                  name="billing_amount"
                  value={formData.billing_amount}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn">Create Milestone</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Milestones for {getProjectName(parseInt(selectedProject))}</h2>
        {milestones.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Scheduled Date</th>
                <th>Actual Date</th>
                <th>Billing Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((milestone) => (
                <tr key={milestone.id}>
                  <td>{milestone.name}</td>
                  <td>{milestone.description}</td>
                  <td>{milestone.scheduled_date}</td>
                  <td>{milestone.actual_date || 'Not completed'}</td>
                  <td>${milestone.billing_amount?.toLocaleString()}</td>
                  <td>
                    <span className={`status-${milestone.status?.toLowerCase()}`}>
                      {milestone.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No milestones found for this project. Create your first milestone using the "Add Milestone" button.</p>
        )}
      </div>
    </div>
  );
};

export default Milestones;