import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Empresa } from '../empresa';
import { Pedido } from '../../pedidos/pedido';
import { EmpresaService } from '../empresa.service';
import { EmpresaDetailsComponent } from '../empresa-details/empresa-details.component';
import { PedidoDetailComponent } from '../../pedidos/pedido-detail/pedido-detail.component';
import { PedidoListComponent } from '../../pedidos/pedido-list/pedido-list.component';

@Component({
  selector: 'empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css'],
	providers: [EmpresaService]
})
export class EmpresaListComponent implements OnInit {

	empresas: Empresa[];
  selectedEmpresa: Empresa;

  constructor(private empresaService: EmpresaService, public dialog: MdDialog) { }

  ngOnInit() {
		this.empresaService
      .getEmpresas()
      .then((empresas: Empresa[]) => {
        this.empresas = empresas.map((empresa) => {
          return empresa;
        });
      });
  }

	private getIndexOfEmpresa = (empresaId: String) => {
    return this.empresas.findIndex((empresa) => {
      return empresa._id === empresaId;
    });
  }

  formatCNPJ(cnpj: string) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5");
  }

  selectEmpresa(empresa: Empresa) {
		this.selectedEmpresa = empresa;
  }

  openDialogEmpresa() {
    let dialogRef = this.dialog.open(EmpresaDetailsComponent, {width: '100%', height: '100%'});
    dialogRef.componentInstance.empresa = this.selectedEmpresa;
    dialogRef.componentInstance.createHandler = this.addEmpresa;
    dialogRef.componentInstance.updateHandler = this.updateEmpresa;
    dialogRef.componentInstance.deleteHandler = this.deleteEmpresa;
  }

  editEmpresa(empresa: Empresa) {
    this.selectEmpresa(empresa);
    this.openDialogEmpresa();
  }

  createNewEmpresa() {
    var empresa: Empresa = {
      nomeFantasia: '',
      cnpj: ''
    };

    // Novo selecionado
    this.selectEmpresa(empresa);
    this.openDialogEmpresa();
  }

	createNewPedido() {
    var pedido: Pedido = {
      empresa_id: '',
      itens: []
    };

    let dialogRefPedido = this.dialog.open(PedidoDetailComponent, {width: '100%', height: '100%'});
		dialogRefPedido.componentInstance.pedido = pedido;
    dialogRefPedido.componentInstance.empresas = this.empresas;
		dialogRefPedido.componentInstance.updateHandler = this.updateEmpresa;
  }

  visualizarPedidos(empresa: Empresa) {
    let dialogRefPedidoList = this.dialog.open(PedidoListComponent, {width: '100%', height: '100%'});
    dialogRefPedidoList.componentInstance.empresa = empresa;
    dialogRefPedidoList.componentInstance.updateHandler = this.updateEmpresaNoClose;
  }

  atualizaDash() {
    this.empresaService
      .getEmpresas()
      .then((empresas: Empresa[]) => {
        this.empresas = empresas.map((empresa) => {
          return empresa;
        });
      });
  }

  deleteEmpresa = (empresaId: String) => {
    var idx = this.getIndexOfEmpresa(empresaId);
    if (idx !== -1) {
      this.empresas.splice(idx, 1);
      this.selectEmpresa(null);
    }
    return this.empresas;
  }

  /*addEmpresa = (empresa: Empresa) => {
    this.empresas.push(empresa);
    this.selectEmpresa(empresa);
    this.dialog.closeAll();
    return this.empresas;
  }*/

  addEmpresa = (empresa: Empresa) => {
    this.dialog.closeAll();
    return this.atualizaDash();
  }


  /*updateEmpresa = (empresa: Empresa) => {
    var idx = this.getIndexOfEmpresa(empresa._id);
    if (idx !== -1) {
      this.empresas[idx] = empresa;
      this.selectEmpresa(empresa);
    }
    this.dialog.closeAll();
    return this.empresas;
  }*/

  updateEmpresa = (empresa: Empresa) => {
    this.dialog.closeAll();
    return this.atualizaDash();
  }

  updateEmpresaNoClose = (empresa: Empresa) => {
    return this.atualizaDash();
  }

}
