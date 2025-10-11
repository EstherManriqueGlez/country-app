import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  countryService = inject(CountryService);

  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);
  queryParam = this.activatedRouter.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal(() => this.queryParam);

  countryResource = rxResource({
    request: () => ({ query: this.query() }),

    loader: ({ request }) => {
      if (!request.query) return of([]);

      this.router.navigate(['/country/by-country'], {
        queryParams: {
          query: request.query,
        }
      });

      return this.countryService.searchByCountry(request.query);
    },
  });
}
