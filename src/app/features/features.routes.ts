import { Routes } from '@angular/router';
import { roleGuard } from '@app/shared/guards/role-guard';

export const featuresRoutes: Routes = [
    {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.routes')
            .then(r => r.dashboardRoutes),
    },
    {
        path: 'users',
        canActivate: [roleGuard],
        loadChildren: () => import('./users/users.routes').then(v => v.userRoutes)
    },
    {
        path: 'features',
        loadChildren: () => import('./features-module/features.routes').then(v => v.featuresRoutes)
    },
    {
        path: 'pricing',
        loadChildren: () => import('./pricing-module/pricing.routes').then(v => v.pricingRoutes)
    },
    {
        path: 'integrations',
        loadChildren: () => import('./integration-module/integration.routes').then(v => v.integrationRoutes)
    },
    {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then(m => m.Settings),
    },
    {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then(m => m.Profile),
    }
];


