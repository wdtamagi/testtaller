import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Empresa } from '../../empresas/empresa';
import { Pedido } from '../pedido';
import { EmpresaService } from '../../empresas/empresa.service';

@Component({
  selector: 'app-pedido-detail',
  templateUrl: './pedido-detail.component.html',
  styleUrls: ['./pedido-detail.component.css'],
	providers: [EmpresaService]
})
export class PedidoDetailComponent implements OnInit {
	@Input()
  pedido: any;

	@Input()
  updateHandler: Function;

  @Input()
	empresas: Empresa[];

	empresa: Empresa;

	produtos = [
		'Cerveja',
		'Carne',
		'Pão de alho',
		'Refrigerante',
		'Guardanapo',
		'Carvão',
		'Álcool',
		'Churrasqueira',
		'Cachaça'
	];

  constructor(private empresaService: EmpresaService, public dialogRef: MdDialogRef<PedidoDetailComponent>) {
	}

  ngOnInit() {
  }

	deleteItem() {
		for (var i=this.pedido.itens.length-1; i>=0; i--) {
			if (this.pedido.itens[i].checked)
				this.pedido.itens.splice(i, 1);
		}
	}

  addItem() {
		var obj: {produto: string, qtd: number, checked: boolean} = {"produto": "", "qtd":0, "checked":false};
		this.pedido.itens.push(obj);
  }

	salvarPedido() {
		this.pedido.empresa_id = this.empresa._id;
		this.pedido.itens.forEach((item, index) => {
			if (item.checked === true || item.checked === false) delete item.checked;
		});
		if (this.empresa.pedidos)
			this.empresa.pedidos.push(this.pedido);
		else {
			this.empresa.pedidos = [];
			this.empresa.pedidos.push(this.pedido);
		}
		this.empresaService.updateEmpresa(this.empresa).then((updatedEmpresa: Empresa) => {
      this.updateHandler(updatedEmpresa);
    });
  }

}
