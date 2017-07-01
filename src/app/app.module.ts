import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { EmpresaDetailsComponent } from './empresas/empresa-details/empresa-details.component';
import { EmpresaListComponent } from './empresas/empresa-list/empresa-list.component';
import { AlertComponent } from './login/alert/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { customHttpProvider } from './auth/custom-http.service';
import { AuthGuard } from './auth/auth.guard';
import { AlertService } from './login/alert.service';
import { AuthenticationService } from './login/authentication.service';
import { UserService } from './user/user.service';
import 'hammerjs';
import { OrderbyPipe } from './directives/orderby.pipe';
import { CustomMaskDirective } from './directives/custom-mask.directive';
import { PedidoDetailComponent } from './pedidos/pedido-detail/pedido-detail.component';
import { PedidoListComponent } from './pedidos/pedido-list/pedido-list.component';

@NgModule({
  declarations: [
    AppComponent,
    EmpresaDetailsComponent,
    EmpresaListComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    OrderbyPipe,
    CustomMaskDirective,
    PedidoDetailComponent,
    PedidoListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
		ReactiveFormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    customHttpProvider,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService
  ],
  bootstrap: [AppComponent],
	entryComponents: [
  EmpresaDetailsComponent,
  PedidoDetailComponent,
	PedidoListComponent	]
})
export class AppModule { }
