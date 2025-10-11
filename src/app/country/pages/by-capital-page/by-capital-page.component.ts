import { Component, inject, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import {  of } from 'rxjs';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);
  
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router)
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';

  // Inicializa el linkedSignal con el valor del query param si existe
  // para que si se recarga la página mantenga el valor buscado
  query = linkedSignal(() => this.queryParam);

  // Este trozo de código reemplaza todo el código comentado al final
  // y usa resource para manejar la carga de datos, errores y estados de carga automáticamente.
  // La función loader se encarga de hacer la petición y devolver los datos.
  // La propiedad request se usa para pasar parámetros a la función loader.
  // El template se actualiza automáticamente cuando cambian los datos.
  // Si no hay query, devuelve un array vacío.
  // Si hay query, llama al servicio para buscar países por capital.
  // Usa firstValueFrom para convertir el Observable en una Promise y esperar su resultado.

  // Es mejor con rxResource!!
  countryResource = rxResource({
    request: () => ({ query: this.query() }),

    loader: ({ request }) => {
      if (!request.query) return of([]);

      this.router.navigate(['/country/by-capital'], {
        queryParams: {
          query: request.query,
        }
      });

      return this.countryService.searchByCapital(request.query);
    },
  });

  // countryResource = resource({
  //   request: () => ({ query: this.query() }),

  //   loader: async ({ request }) => {
  //     if (!request.query) return [];

  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(request.query)
  //     );
  //   },
  // });
  // Fin del código con resource

  /* ************* */
  // isLoading = signal<boolean>(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string): void {
  //   if (this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err.message);
  //     }
  //   });
  // }
}
