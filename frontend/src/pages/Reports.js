import React, { useState, useEffect } from 'react';
import { projectService, resourceService, milestoneService } from '../services/api';

const Reports = () => {
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [projectsRes, resourcesRes] = await Promise.all([
        projectService.getAll(),
        resourceService.getAll()
      ]);
      setProjects(projectsRes.data);
      setResources(resourcesRes.data);
    } catch (err) {
      setError('Failed to fetch report data');
      console.error('Reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalBudget = () => {
    return projects.reduce((total, project) => total + (project.project_budget || 0), 0);
  };

  const calculateTotalPOAmount = () => {
    return projects.reduce((total, project) => total + (project.po_amount || 0), 0);
  };

  const getProjectsByStatus = () => {
    const statusCounts = projects.reduce((acc, project) => {
      const status = project.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return statusCounts;
  };

  const getResourceUtilization = () => {
    return resources.map(resource => ({
      ...resource,
      utilizationRate: Math.floor(Math.random() * 100) // Mock utilization rate
    }));
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  const statusCounts = getProjectsByStatus();
  const resourceUtilization = getResourceUtilization();

  return (
    <div>
      <h1>Reports & Analytics</h1>

      {error && <div className="error">{error}</div>}

      {/* Financial Summary */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Financial Summary</h2>
        <div className="grid grid-3">
          <div className="stats-card">
            <div className="stats-number">${calculateTotalPOAmount().toLocaleString()}</div>
            <div className="stats-label">Total PO Amount</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">${calculateTotalBudget().toLocaleString()}</div>
            <div className="stats-label">Total Project Budget</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{projects.length}</div>
            <div className="stats-label">Active Projects</div>
          </div>
        </div>
      </div>

      {/* Project Status Distribution */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Project Status Distribution</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(statusCounts).map(([status, count]) => (
              <tr key={status}>
                <td>
                  <span className={`status-${status.toLowerCase()}`}>
                    {status}
                  </span>
                </td>
                <td>{count}</td>
                <td>{projects.length > 0 ? ((count / projects.length) * 100).toFixed(1) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Project Details */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Project Financial Details</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>PO Amount</th>
              <th>Budget (70%)</th>
              <th>Variance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const variance = (project.po_amount || 0) - (project.project_budget || 0);
              return (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.client}</td>
                  <td>${project.po_amount?.toLocaleString()}</td>
                  <td>${project.project_budget?.toLocaleString()}</td>
                  <td>${variance.toLocaleString()}</td>
                  <td>
                    <span className={`status-${project.status?.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resource Utilization */}
      <div className="card">
        <h2>Resource Utilization</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Experience</th>
              <th>Hourly Rate</th>
              <th>Utilization Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {resourceUtilization.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.name}</td>
                <td>{resource.experience_years} years</td>
                <td>${resource.hourly_rate}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                      style={{
                        width: '100px',
                        height: '10px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '5px',
                        marginRight: '10px'
                      }}
                    >
                      <div 
                        style={{
                          width: `${resource.utilizationRate}%`,
                          height: '100%',
                          backgroundColor: resource.utilizationRate > 80 ? '#e74c3c' : 
                                          resource.utilizationRate > 60 ? '#f39c12' : '#27ae60',
                          borderRadius: '5px'
                        }}
                      />
                    </div>
                    {resource.utilizationRate}%
                  </div>
                </td>
                <td>
                  <span className={`status-${resource.status?.toLowerCase()}`}>
                    {resource.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;