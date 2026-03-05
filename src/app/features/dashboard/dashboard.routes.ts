import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard').then(m => m.Dashboard),
        // pathMatch: 'full',
    },
    {
        path: 'reports',
        loadComponent: () => import('./reports/reports').then(m => m.Reports),
        // pathMatch: 'full',
    },
    {
        path: 'tasks',
        loadComponent: () => import('./tasks/tasks').then(m => m.Tasks),
        // pathMatch: 'full',
    },
    {
        path: 'products',
        loadComponent: () => import('./products/products').then(m => m.Products),
        // pathMatch: 'full',
    },
    {
        path: 'products/add',
        loadChildren: () => import('@app/features/dashboard/products/products.routes').then(r => r.productAddRoutes),
    }
];

