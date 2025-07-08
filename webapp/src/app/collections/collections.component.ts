import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="collections-page">
      <h2>Collections</h2>
      <p>Manage your MongoDB collections</p>
      
      <div class="collections-interface">
        <div class="collections-header">
          <button class="btn btn-primary">Create Collection</button>
          <button class="btn btn-secondary">Refresh</button>
        </div>
        
        <div class="collections-list">
          <div class="empty-state">
            <h3>No Collections Found</h3>
            <p>Get started by creating your first collection</p>
            <button class="btn btn-primary">Create Collection</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .collections-page {
      padding: 1rem;
    }
    
    .collections-page h2 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }
    
    .collections-interface {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .collections-header {
      margin-bottom: 1.5rem;
      display: flex;
      gap: 0.5rem;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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
    
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }
    
    .empty-state h3 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }
    
    .empty-state p {
      margin-bottom: 1.5rem;
    }
  `]
})
export class CollectionsComponent {
  
} 