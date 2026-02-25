import { Routes } from '@angular/router';
import { AddFeatures } from './add-features/add-features';
import { ViewFeatures } from './view-features/view-features';

export const featuresRoutes: Routes = [
    {
        path: 'add',
        component: AddFeatures,
    },
    {
        path: 'view',
        component: ViewFeatures,
        pathMatch: 'full',
    },
];

