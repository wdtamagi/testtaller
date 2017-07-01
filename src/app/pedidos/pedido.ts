export class Pedido {
	_id?: string;
	empresa_id: string;
	itens: Array<{produto: string, qtd: number}>;
}
