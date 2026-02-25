import { Routes } from '@angular/router';
import { AddPricing } from './add-pricing/add-pricing';
import { ViewPricing } from './view-pricing/view-pricing';

export const pricingRoutes: Routes = [
    {
        path: 'add',
        component: AddPricing,
    },
    {
        path: 'view',
        component: ViewPricing,
        pathMatch: 'full',
    },
];

