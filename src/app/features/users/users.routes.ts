import { Routes } from '@angular/router';
import { Adduser } from './adduser/adduser';
import { Viewusers } from './viewusers/viewusers';

export const userRoutes: Routes = [
    {
        path: 'add',
        component: Adduser,
        pathMatch: 'full',

    },
    {
        path: 'view',
        component: Viewusers,
        pathMatch: 'full',
    },
];

