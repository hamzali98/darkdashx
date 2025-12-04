import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';
import { Reports } from './reports/reports';
import { Tasks } from './tasks/tasks';
import { Products } from './products/products';

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: Dashboard,
        pathMatch: 'full',

    },
    {
        path: 'reports',
        component: Reports,
        pathMatch: 'full',

    },
    {
        path: 'tasks',
        component: Tasks,
        pathMatch: 'full',
    },
    {
        path: 'products',
        component: Products,
        pathMatch: 'full'
    }
];

