import { Component, Input } from '@angular/core';
import { Empresa } from '../empresa';
import { EmpresaService } from '../empresa.service';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'empresa-details',
  templateUrl: './empresa-details.component.html',
  styleUrls: ['./empresa-details.component.css'],
	providers: [EmpresaService]
})
export class EmpresaDetailsComponent {
  @Input()
  empresa: Empresa;

  @Input()
  createHandler: Function;
  @Input()
  updateHandler: Function;
  @Input()
  deleteHandler: Function;

  constructor(private empresaService: EmpresaService, public dialogRef: MdDialogRef<EmpresaDetailsComponent>) { }

  createEmpresa(empresa: Empresa) {
    this.empresaService.createEmpresa(empresa).then((newEmpresa: Empresa) => {
      this.createHandler(newEmpresa);
    });
  }

  updateEmpresa(empresa: Empresa): void {
    this.empresaService.updateEmpresa(empresa).then((updatedEmpresa: Empresa) => {
      this.updateHandler(updatedEmpresa);
    });
  }

  deleteEmpresa(empresaId: String): void {
    this.empresaService.deleteEmpresa(empresaId).then((deletedEmpresaId: String) => {
      this.deleteHandler(deletedEmpresaId);
    });
  }
}
