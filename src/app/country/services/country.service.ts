import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, delay, of, tap } from 'rxjs';
import { RESTCountry } from '../interfaces/rest-countries.interfaces';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((restCountries) =>
        CountryMapper.mapRestCountriesArrayToCountriesArray(restCountries)
      ),
      tap((countries) => this.queryCacheCapital.set(query, countries)),
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

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(url).pipe(
      map((restCountries) =>
        CountryMapper.mapRestCountriesArrayToCountriesArray(restCountries)
      ),
      tap((countries) => this.queryCacheCountry.set(query, countries)),
      delay(2000),
      catchError((error) => {
        console.error('Error fetching countries by name:', error);

        return throwError(
          () => new Error(`Failed to fetch countries by name: ${query}`)
        );
      })
    );
  }

    searchByRegion(region: Region) {
      const url = `${API_URL}/region/${region}`;

    if (this.queryCacheCountry.has(region)) {
      return of(this.queryCacheCountry.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(url).pipe(
      map((restCountries) =>
        CountryMapper.mapRestCountriesArrayToCountriesArray(restCountries)
      ),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      catchError((error) => {
        console.error('Error fetching countries by name:', error);

        return throwError(
          () => new Error(`Failed to fetch countries by name: ${region}`)
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
