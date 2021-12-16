import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Fronteras, PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  cargando: boolean = false;

  regiones: string[] = []

  constructor(private fb: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    this.miFormulario.controls.region.valueChanges.pipe(
      tap((_) => {
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      }),
      switchMap(region => this.paisesService.getPaisesPorRegion(region)
      )
    ).subscribe(paises => {
      this.cargando = false;
      this.paises = paises;
    });

    this.miFormulario.controls.pais.valueChanges.pipe(
      tap((_) => {
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;

      }),
      switchMap(pais => this.paisesService.getFronterasPorPais(pais)),
      switchMap(frontera => this.paisesService.getPaisesPorCodigoFrontera(frontera.borders)),
    ).subscribe(fronteras => {
      this.fronteras = fronteras;
      this.cargando = false;

    })

      ;



  }


  /*     this.miFormulario.controls.region.valueChanges
        .subscribe(region =>
          this.paisesService.getPaisesPorRegion(region)
            .subscribe(paises => {
              console.log(paises);
              this.paises = paises;
            })
        ) */



  guardar() {
    console.log(this.miFormulario);
  }

}
