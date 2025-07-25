import React, { useState, useEffect } from 'react';
import { resourceService } from '../services/api';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    resource_id: '',
    email: '',
    phone: '',
    salary: '',
    hourly_rate: '',
    experience_years: '',
    skills: '',
    certifications: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceService.getAll();
      setResources(response.data);
    } catch (err) {
      setError('Failed to fetch resources');
      console.error('Resources error:', err);
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
      await resourceService.create({
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null
      });
      setShowForm(false);
      setFormData({
        name: '',
        resource_id: '',
        email: '',
        phone: '',
        salary: '',
        hourly_rate: '',
        experience_years: '',
        skills: '',
        certifications: ''
      });
      fetchResources();
    } catch (err) {
      setError('Failed to create resource');
      console.error('Create resource error:', err);
    }
  };

  if (loading) return <div className="loading">Loading resources...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Resources</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Resource'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Add New Resource</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Resource ID</label>
                <input
                  type="text"
                  name="resource_id"
                  value={formData.resource_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  step="0.01"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Hourly Rate</label>
                <input
                  type="number"
                  step="0.01"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Skills</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Certifications</label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                placeholder="e.g., AWS Certified, PMP"
              />
            </div>
            <button type="submit" className="btn">Create Resource</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2>All Resources</h2>
        {resources.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Resource ID</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Skills</th>
                <th>Hourly Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td>{resource.name}</td>
                  <td>{resource.resource_id}</td>
                  <td>{resource.email}</td>
                  <td>{resource.experience_years} years</td>
                  <td>{resource.skills}</td>
                  <td>${resource.hourly_rate}</td>
                  <td>
                    <span className={`status-${resource.status?.toLowerCase()}`}>
                      {resource.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No resources found. Create your first resource using the "Add Resource" button.</p>
        )}
      </div>
    </div>
  );
};

export default Resources;