import { Routes } from '@angular/router';

export const integrationRoutes: Routes = [
    {
        path: 'add',
        loadComponent: () => import('./add-integration/add-integration').then(m => m.AddIntegration),
    },
    {
        path: 'view',
        loadComponent: () => import('./view-integration/view-integration').then(m => m.ViewIntegration),
    },
];

