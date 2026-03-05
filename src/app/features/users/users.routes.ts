import { Routes } from '@angular/router';

export const userRoutes: Routes = [
    {
        path: 'add',
        loadComponent: () => import('./adduser/adduser').then(m => m.Adduser),
        children:[
            {
                path: '',
                redirectTo: "1",
                pathMatch: 'full'
            },
            {
                    path: "1",
                    loadComponent: () => import('./adduser/pages/personal-information/personal-information').then(m => m.PersonalInformation),
                },
                {
                    path: "2",
                    loadComponent: () => import('./adduser/pages/basic-info/basic-info').then(m => m.BasicInfo),
                },
                {
                    path: "3",
                    loadComponent: () => import('./adduser/pages/team/team').then(m => m.Team),
                },
        ]
    },
    {
        path: 'view',
        loadComponent: () => import('./viewusers/viewusers').then(m => m.Viewusers),
    },
];

