import { Routes } from '@angular/router';

export const pricingRoutes: Routes = [
    {
        path: 'add',
        loadComponent: () => import('./add-pricing/add-pricing').then(m => m.AddPricing),
    },
    {
        path: 'view',
        loadComponent: () => import('./view-pricing/view-pricing').then(m => m.ViewPricing),
    },
];

