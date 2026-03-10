import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '@app/shared/guards/unsaved-changes-guard';

export const productAddRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./products-add/products-add').then(m => m.ProductsAdd),
        canDeactivate: [unsavedChangesGuard],
        children: [
            {
                path: '',
                redirectTo: "1",
                pathMatch: 'full'
            },
            {
                path: "1",
                loadComponent: () => import('./products-add/pages/base-info/base-info').then(m => m.BaseInfo),
            },
            {
                path: "2",
                loadComponent: () => import('./products-add/pages/details/details').then(m => m.Details),
            },
        ]
    },
];

