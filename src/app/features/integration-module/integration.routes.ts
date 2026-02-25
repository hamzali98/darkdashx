import { Routes } from '@angular/router';
import { AddIntegration } from './add-integration/add-integration';
import { ViewIntegration } from './view-integration/view-integration';

export const integrationRoutes: Routes = [
    {
        path: 'add',
        component: AddIntegration,
    },
    {
        path: 'view',
        component: ViewIntegration,
        pathMatch: 'full',
    },
];

