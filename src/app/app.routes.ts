import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'staff',
        loadComponent: () => import('./pages/staff/staff.component').then(m => m.StaffComponent)
    },
    {
        path: 'task',
        loadComponent: () => import('./pages/task/task.component').then(m => m.TaskComponent)
    },
    {
        path: '',
        redirectTo: 'staff',
        pathMatch: 'full'
    }
];
