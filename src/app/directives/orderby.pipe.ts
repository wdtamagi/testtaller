import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderbyPipe implements PipeTransform {

  transform(records: Array<any>, args?: any): Array<any> {
		if(!records || records === undefined || records.length === 0) return null;

    return records.sort(function(a, b){
			if((a.pedidos ? a.pedidos.length : 0) > (b.pedidos ? b.pedidos.length : 0)){
				return -1;
			}
			else if((a.pedidos ? a.pedidos.length : 0) < (b.pedidos ? b.pedidos.length : 0)){
				return 1;
			}
			else{
				return 0;
			}
		});
  }

}
