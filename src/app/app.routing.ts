import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmpresaListComponent } from './empresas/empresa-list/empresa-list.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
    { path: '', component: EmpresaListComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
		{ path: 'dashboard', component: EmpresaListComponent },
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
