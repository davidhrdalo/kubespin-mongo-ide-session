import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-query',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="query-page">
      <h2>MongoDB Query Runner</h2>
      <p>Execute MongoDB queries and view results</p>
      
      <div class="query-interface">
        <div class="query-input">
          <h3>Query</h3>
          <textarea 
            placeholder="Enter your MongoDB query here..."
            rows="10"
            class="query-textarea"
          ></textarea>
        </div>
        
        <div class="query-actions">
          <button class="btn btn-primary">Execute Query</button>
          <button class="btn btn-secondary">Clear</button>
        </div>
        
        <div class="query-results">
          <h3>Results</h3>
          <div class="results-placeholder">
            <p>Query results will appear here...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .query-page {
      padding: 1rem;
    }
    
    .query-page h2 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }
    
    .query-interface {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .query-input {
      margin-bottom: 1rem;
    }
    
    .query-textarea {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.75rem;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      resize: vertical;
    }
    
    .query-textarea:focus {
      outline: none;
      border-color: #007bff;
    }
    
    .query-actions {
      margin-bottom: 1.5rem;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
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
    
    .results-placeholder {
      min-height: 200px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1rem;
      background-color: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6c757d;
    }
  `]
})
export class QueryComponent {
  
} 