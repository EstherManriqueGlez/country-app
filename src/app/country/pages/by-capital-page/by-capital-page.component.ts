import { Component, inject, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { Country } from '../../components/interfaces/country.interface';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent { 

  countryService = inject(CountryService);

  isLoading = signal<boolean>(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);

  onSearch(query: string): void {
    if(this.isLoading()) return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchByCapital(query)
      .subscribe(countries => {
        this.countries.set(countries);
        this.isLoading.set(false);
      });
  }
}
