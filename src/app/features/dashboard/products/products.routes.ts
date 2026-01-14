import { Routes } from '@angular/router';
import { ProductsAdd } from './products-add/products-add';
import { BaseInfo } from './products-add/pages/base-info/base-info';
import { Details } from './products-add/pages/details/details';
export const productAddRoutes: Routes = [
    {
        path: '',
        component: ProductsAdd,
        children: [
            {
                path: '',
                redirectTo: "1",
                pathMatch: 'full'
            },
            {
                path: "1",
                component: BaseInfo,
                pathMatch: 'full'

            },
            {
                path: "2",
                component: Details,
                pathMatch: 'full'

            },
        ]
    },
];

