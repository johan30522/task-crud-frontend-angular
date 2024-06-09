import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{

  public user!:User | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('SidebarComponent');
    this.user = this.authService.getUser();
  }

  // getteer for user
  get userInfo(): User {
    return this.authService.getUser()!;
  }


  logout() {
    console.log('logout');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
