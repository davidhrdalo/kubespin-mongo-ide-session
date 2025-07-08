import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>MongoDB Dashboard</h2>
      <p>Welcome to your MongoDB Development Platform</p>
      
      <div class="dashboard-grid">
        <div class="card">
          <h3>Database Connection</h3>
          <p>Status: <span class="status connected">Connected</span></p>
          <p>MongoDB Version: 6.0</p>
        </div>
        
        <div class="card">
          <h3>Collections</h3>
          <p>Total Collections: 0</p>
          <p>Total Documents: 0</p>
        </div>
        
        <div class="card">
          <h3>Storage</h3>
          <p>Database Size: 0 MB</p>
          <p>Index Size: 0 MB</p>
        </div>
        
        <div class="card">
          <h3>Quick Actions</h3>
          <button class="btn btn-primary">Create Collection</button>
          <button class="btn btn-secondary">Run Query</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1rem;
    }
    
    .dashboard h2 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .card h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #2c3e50;
    }
    
    .status {
      font-weight: bold;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    .status.connected {
      background-color: #d4edda;
      color: #155724;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      transition: background-color 0.2s;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #0056b3;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class DashboardComponent {
  
} 