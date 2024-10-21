import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavService } from './services/sidenav.service';
import { KanbanTaskCardComponent } from './kanban-task-card/kanban-task-card.component';
import { KanbanColumnComponent } from './kanban-column/kanban-column.component';
import { KanbanCreateTaskFormComponent } from './kanban-create-task-form/kanban-create-task-form.component';
import { KanbanUpdateTaskFormComponent } from './kanban-update-task-form/kanban-update-task-form.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { BodyComponent } from './body/body.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AppNavbarComponent } from './navbar/navbar.component';
import { AppSidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    KanbanColumnComponent,
    KanbanTaskCardComponent,
    KanbanUpdateTaskFormComponent,
    KanbanCreateTaskFormComponent,
    ConfirmationModalComponent,
    BodyComponent, 
    LoginComponent, 
    RegisterComponent,
    AppNavbarComponent,
    AppSidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'KNG';

  
  isSidenavOpen = true;
  showNavbar = true;
  showSidebar = true;

  constructor(private router: Router, private sidenavService: SidenavService) {}

  ngOnInit() {
    // Listen to route changes to update the visibility of navbar and sidebar
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.showNavbar = !['/login', '/register'].includes(currentRoute);
        this.showSidebar = !['/login', '/register'].includes(currentRoute);
      }
    });

    // Update sidenav state from service
    this.sidenavService.sidenavOpen$.subscribe(isOpen => {
      this.isSidenavOpen = isOpen;
    });
  }
}
