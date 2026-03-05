import { Routes } from '@angular/router';

export const featuresRoutes: Routes = [
    {
        path: 'add',
        loadComponent: () => import('./add-features/add-features').then(m => m.AddFeatures),
    },
    {
        path: 'view',
        loadComponent: () => import('./view-features/view-features').then(m => m.ViewFeatures),
    },
];

