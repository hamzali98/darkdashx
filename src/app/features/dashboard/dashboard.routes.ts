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
        path: 'home/reports',
        component: Reports,
        pathMatch: 'full',

    },
    {
        path: 'home/tasks',
        component: Tasks,
        pathMatch: 'full',
    },
    {
        path: 'home/products',
        component: Products,
        pathMatch: 'full',
    },
    {
        path: 'home/products/add',
        loadChildren: ()=> import('@app/features/dashboard/products/products.routes').then(r => r.productAddRoutes),
        // pathMatch: 'full'
    }
];

