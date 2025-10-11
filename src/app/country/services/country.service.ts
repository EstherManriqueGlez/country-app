import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interfaces';
import { map, Observable, catchError, throwError, delay } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((restCountries) =>
        CountryMapper.mapRestCountriesArrayToCountriesArray(restCountries)
      ),
      catchError((error) => {
        console.error('Error fetching countries by capital:', error);

        return throwError(
          () => new Error(`Failed to fetch countries by capital: ${query}`)
        );
      })
    );
  }

  searchByCountry(query: string) {
    const url = `${API_URL}/name/${query}`;

    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(url).pipe(
      map((restCountries) =>
        CountryMapper.mapRestCountriesArrayToCountriesArray(restCountries)
      ),
      delay(2000),
      catchError((error) => {
        console.error('Error fetching countries by name:', error);

        return throwError(
          () => new Error(`Failed to fetch countries by name: ${query}`)
        );
      })
    );
  }

  searchByCountryByAlphaCode(code: string) {
    const url = `${API_URL}/alpha/${code}`;

    return this.http.get<RESTCountry[]>(url).pipe(
      map((restCountries) =>
        CountryMapper.mapRestCountriesArrayToCountriesArray(restCountries)
      ),
      map((countries) => countries.at(0)),
      catchError((error) => {
        console.error('Error fetching countries by alpha code:', error);

        return throwError(
          () => new Error(`Failed to fetch countries by alpha code: ${code}`)
        );
      })
    );
  }
}
