import {Pedido} from '../pedidos/pedido';
export class Empresa {
	_id?: string;
	nomeFantasia: string;
  cnpj: string;
  pedidos?: Pedido[];
}
