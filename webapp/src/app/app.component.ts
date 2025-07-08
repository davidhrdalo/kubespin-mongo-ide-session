import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>MongoDB Development Platform</h1>
        <nav class="app-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
          <a routerLink="/query" routerLinkActive="active" class="nav-link">Query</a>
          <a routerLink="/collections" routerLinkActive="active" class="nav-link">Collections</a>
        </nav>
      </header>
      
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .app-header {
      background-color: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .app-nav {
      display: flex;
      gap: 1rem;
    }
    
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .nav-link:hover {
      background-color: rgba(255,255,255,0.1);
    }
    
    .nav-link.active {
      background-color: rgba(255,255,255,0.2);
    }
    
    .app-main {
      flex: 1;
      padding: 2rem;
      background-color: #f8f9fa;
      overflow-y: auto;
    }
  `]
})
export class AppComponent {
  title = 'MongoDB Development Platform';
} 