import { Routes } from '@angular/router';
import { HomeLayout } from './core/layouts/home-layout/home-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Settings } from './features/settings/settings';
import { Profile } from './features/profile/profile';
import { LoginPage } from './core/auth/pages/login-page/login-page';
import { Signup } from './core/auth/pages/signup/signup';
import { authGuardGuard } from './core/auth/guard/auth-guard-guard';

export const routes: Routes = [
    // {
    //     path:'',
    //     redirectTo: 'dashboard',
    //     pathMatch: "full"
    // },
    {
        path: '',
        component: HomeLayout,
        canActivate: [authGuardGuard],
        children: [
            {
                path: '',
                // component: Dashboard,
                loadChildren: () => import('./features/dashboard/dashboard.routes')
                    .then(r => r.dashboardRoutes),
            },
            {
                path: 'users',
                loadChildren: () => import('./features/users/users.routes').then(v => v.userRoutes)
            },
            {
                path: 'settings',
                component: Settings,
            },
            {
                path: 'profile',
                component: Profile
            }
        ]
    },
    {
        path: "login",
        component: LoginPage
    },
    {
        path: "signup",
        component: Signup,
    }
    //     // Admin area using another layout
    //   {
    //         path: 'admin',
    //         component: AdminLayoutComponent,
    //         children: [
    //             {
    //                 path: '',
    //                 loadChildren: () =>
    //                     import('./features/admin/admin.module').then(m => m.AdminModule)
    //             }
    //         ]
    //     },

    //     // Auth pages without any layout
    //     {
    //         path: 'auth',
    //         loadChildren: () =>
    //             import('./features/auth/auth.module').then(m => m.AuthModule)
    //     }
];


