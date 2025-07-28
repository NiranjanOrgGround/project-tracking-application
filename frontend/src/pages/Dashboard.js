import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getData();
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      
      {dashboardData && (
        <>
          <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
            <div className="card stats-card">
              <div className="stats-number">{dashboardData.totalProjects || 0}</div>
              <div className="stats-label">Total Projects</div>
            </div>
            <div className="card stats-card">
              <div className="stats-number">{dashboardData.totalResources || 0}</div>
              <div className="stats-label">Total Resources</div>
            </div>
            <div className="card stats-card">
              <div className="stats-number">{dashboardData.totalMilestones || 0}</div>
              <div className="stats-label">Total Milestones</div>
            </div>
          </div>

          <div className="card">
            <h2>Recent Projects</h2>
            {dashboardData.recentProjects && dashboardData.recentProjects.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Client</th>
                    <th>PO Amount</th>
                    <th>Budget</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentProjects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.client}</td>
                      <td>${project.po_amount?.toLocaleString()}</td>
                      <td>${project.project_budget?.toLocaleString()}</td>
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
              <p>No projects found. <a href="/projects">Create your first project</a>.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;