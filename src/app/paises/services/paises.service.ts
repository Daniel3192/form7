import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fronteras, PaisSmall } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.com/v3.1';

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  get regiones(): string[] {
    return [...this._regiones];
  }


  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {

    const url: string = `${this._baseUrl}/region/${region}/?fields=name,cca3`
    return this.http.get<PaisSmall[]>(url);
  }

  getFronterasPorPais(codigo: string): Observable<Fronteras> {
    //  https:restcountries.com/v3.1/alpha?codes=esp&fields=borders
    if (!codigo) {
      return of();
    }
    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=borders`
    return this.http.get<Fronteras>(url);
  }

  getPaisPorCodigo(codigo: string): Observable<PaisSmall> {
    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=name`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigoFrontera(codigos: string[]): Observable<PaisSmall[]> {

    console.log(codigos);
    const peticiones: Observable<PaisSmall>[] = [];

    codigos.forEach(codigo => {
      const peticion = this.getPaisPorCodigo(codigo);
      peticiones.push(peticion);
    })
    return combineLatest(peticiones);
  }
}
