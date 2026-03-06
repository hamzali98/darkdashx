import { Routes } from '@angular/router';
import { HomeLayout } from './core/layouts/home-layout/home-layout';
import { authGuardGuard } from './core/auth/guard/auth-guard-guard';
import { authSessionGuard } from './core/auth/guard/auth-session-guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeLayout,
        canActivate: [authGuardGuard],
        loadChildren: () => import('./features/features.routes').then(v => v.featuresRoutes),
    },
    {
        path: "auth",
        canActivate: [authSessionGuard],
        loadChildren: () => import('./core/auth/auth.routes').then(v => v.authRoutes),
    },
    {
        path: "report-issue",
        canActivate: [authGuardGuard],
        loadComponent: () => import('./features/report-issue/report-issue').then(m => m.ReportIssue),
    },
    {
        path: "**",
        canActivate: [authGuardGuard],
        loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
    },
];


