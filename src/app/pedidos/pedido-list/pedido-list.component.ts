import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Empresa } from '../../empresas/empresa';
import { Pedido } from '../pedido';
import { EmpresaService } from '../../empresas/empresa.service';

@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrls: ['./pedido-list.component.css'],
  providers: [EmpresaService]
})
export class PedidoListComponent implements OnInit {
	@Input()
  updateHandler: Function;

  @Input()
	empresa: Empresa;

  constructor(private empresaService: EmpresaService, public dialogRef: MdDialogRef<PedidoListComponent>) { }

  ngOnInit() {
  }

  deletePedido(pedido: Pedido) {
    this.empresa.pedidos.splice(this.empresa.pedidos.indexOf(pedido), 1);
    this.empresaService.updateEmpresa(this.empresa).then((updatedEmpresa: Empresa) => {
      this.updateHandler(updatedEmpresa);
    });
  }

}
