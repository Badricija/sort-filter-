import axios from 'axios';
import sum from './utils/sum/sum';

class BaseCountry {
  name: string;
  code: string;
  capital: string;
  region: string;
  constructor(name: string, code: string, capital: string, region: string) {
    this.name = name;
    this.code = code;
    this.capital = capital;
    this.region = region;
  }
}
class Country extends BaseCountry {
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  language: {
    code: string;
    name: string;
  };
  dialling_code: string;
  isoCode: number;
  
  constructor(name: string, code: string, capital: string, region: string, currency: any, language: any, dialling_code: string, isoCode: number) {
    super(name, code, capital, region);
    this.currency = currency;
    this.language = language;
    this.dialling_code = dialling_code;
    this.isoCode = isoCode;
  }
}
window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.js-country-form') as HTMLFormElement;
    const getInputValue = (selector: string) => {
      return (document.querySelector(selector) as HTMLInputElement).value;
    };
    const fetchCountriesData = async (countryName: string, capitalCity: string, currency: string, language: string) => {
      try {
        const response = await axios.get<Country[]>('http://localhost:3000/countries');
        return response.data.filter(country => {
          return (!countryName || country.name.includes(countryName)) &&
                (!capitalCity || country.capital.includes(capitalCity)) &&
                (!currency || country.currency.name.includes(currency)) &&
                (!language || country.language.name.includes(language));
        });
      } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
      }
    };
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const countryName = getInputValue('input[name="country-name"]');
      const capitalCity = getInputValue('input[name="capital-city"]');
      const currency = getInputValue('input[name="currency"]');
      const language = getInputValue('input[name="language"]');
      const countries = await fetchCountriesData(countryName, capitalCity, currency, language);
      displayResults(countries);
    });
  });
const pageSize = 10; 
let currentIndex = 0; 

function displayResults(countries: Country[], startIndex: number = 0) {
  let resultsContainer = document.getElementById('results') as HTMLDivElement;
  if (!resultsContainer) {
    resultsContainer = createResultsContainer();
  } else {
    if (startIndex === 0) resultsContainer.innerHTML = '';
  }

  const table: HTMLTableElement = startIndex === 0 ? document.createElement('table') : document.querySelector('#results table') as HTMLTableElement;
  
  if (startIndex === 0) {
    table.className = 'results-table';
    const headerRow = table.insertRow();
    const headers = ['Country', 'Capital City', 'Currency', 'Language'];
    headers.forEach(headerText => {
      const headerCell = document.createElement('th');
      headerCell.textContent = headerText;
      headerRow.appendChild(headerCell);
    });
    resultsContainer.appendChild(table);
  }
  
  countries.slice(startIndex, startIndex + pageSize).forEach(country => {
    const row = table.insertRow();
    row.insertCell().textContent = country.name;
    row.insertCell().textContent = country.capital;
    row.insertCell().textContent = country.currency 
                                   ? `${country.currency.name} (${country.currency.symbol})` 
                                   : "N/A";
    row.insertCell().textContent = country.language 
                                   ? country.language.name 
                                   : "N/A";
  });

  currentIndex = startIndex + pageSize;

  let loadMoreBtn = document.getElementById('load-more-btn') as HTMLButtonElement;
  if (currentIndex < countries.length) {
    if (!loadMoreBtn) {
      loadMoreBtn = document.createElement('button');
      loadMoreBtn.id = 'load-more-btn';
      loadMoreBtn.textContent = 'Load More...';
      resultsContainer.appendChild(loadMoreBtn);
    }
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.onclick = () => displayResults(countries, currentIndex);
  } else {
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
  }
}

function createResultsContainer(): HTMLDivElement {
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'results';
  document.body.appendChild(resultsContainer);
  return resultsContainer;
}
