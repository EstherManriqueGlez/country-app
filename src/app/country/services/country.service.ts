import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../components/interfaces/rest-countries.interfaces';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Country } from '../components/interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
    .pipe(
      map(restCountries => CountryMapper.mapRestCountriesArrayToCountriesArray(restCountries)),
      catchError(error => {
        console.error('Error fetching countries by capital:', error);

        return throwError(() => new Error(`Failed to fetch countries by capital: ${query}`));
      })
    )
  }

  searchByCountry(query: string): Observable<Country[]> {
    const url = `${API_URL}/name/${query}`;
    
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(url)
    .pipe(
      map(restCountries => CountryMapper.mapRestCountriesArrayToCountriesArray(restCountries)),
      catchError(error => {
        console.error('Error fetching countries by name:', error);

        return throwError(() => new Error(`Failed to fetch countries by name: ${query}`));
      })
    )
  }
}
