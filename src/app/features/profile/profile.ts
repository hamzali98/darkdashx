import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth-service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  private authService = inject(AuthService);
  private routerRef = inject(Router);

  onLogout(){
this.authService.logout();
this.routerRef.navigate(["/login"]);
  }
}
