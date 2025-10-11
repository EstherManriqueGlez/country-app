import type { Country } from "../interfaces/country.interface";
import type { RESTCountry } from "../interfaces/rest-countries.interfaces";



export class CountryMapper {

  // static RestCountry => Country
  static mapRestCountryToCountry(restCountry: RESTCountry): Country {
    return {
      capital: restCountry.capital?.join(', '),
      cca2: restCountry.cca2,
      flag: restCountry.flag,
      flagSvg: restCountry.flags.svg,
      name: restCountry.translations['spa'].common ?? 'No Spanish Name',
      population: restCountry.population,
      region: restCountry.region,
      subregion: restCountry.subregion,
    };
  }

  // static RestCountry[] => Country[]
  static mapRestCountriesArrayToCountriesArray(restCountries: RESTCountry[]): Country[] {

    // return restCountries.map((country) => this.mapRestCountryToCountry(country));
    // OR Is the same as:
    return restCountries.map(this.mapRestCountryToCountry);
  }
}