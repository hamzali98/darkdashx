import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    {
        path: "login",
        loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage),
    },
    {
        path: "forgot",
        loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword),
    },
    {
        path: "signup",
        loadComponent: () => import('./pages/signup-page/signup-page').then(m => m.SignupPage),
    },
]