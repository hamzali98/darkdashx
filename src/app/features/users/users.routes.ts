import { Routes } from '@angular/router';
import { Adduser } from './adduser/adduser';
import { Viewusers } from './viewusers/viewusers';
import { PersonalInformation } from './adduser/pages/personal-information/personal-information';
import { Team } from './adduser/pages/team/team';
import { BasicInfo } from './adduser/pages/basic-info/basic-info';
export const userRoutes: Routes = [
    {
        path: 'add',
        component: Adduser,
        // pathMatch: 'full',
        children:[
            {
                path: '',
                redirectTo: "1",
                pathMatch: 'full'
            },
            {
                    path: "1",
                    component: PersonalInformation
                },
                {
                    path: "2",
                    component: BasicInfo
                },
                {
                    path: "3",
                    component: Team
                },
        ]
    },
    {
        path: 'view',
        component: Viewusers,
        pathMatch: 'full',
    },
];

