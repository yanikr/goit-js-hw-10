import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;
const form = document.getElementById('search-box');
const list = document.querySelector('.country-list');
list.style.listStyleType = 'none';
list.style.paddingLeft = 0;

form.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(event) {
  event.preventDefault();
  let name = document.getElementById('search-box').value.trim();

  fetchCountries(name)
    .then(renderCountry)
    .catch(error => {
      list.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountry(name) {
  let markup = '';
  if (name.length > 10) {
    list.innerHTML = '';
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (name.length > 1) {
    markup = name
      .map(name => {
        return `
            <li style="
    display: flex;
    align-items: center;
">
              <img class="country-flag" src=${name.flags.svg} alt="${name.name.official}" width="30" height="30" style="
    margin-right: 10px;
"></img>
              <p style="font-size: 22px;font-weight: 600;margin-top: 5px;margin-bottom: 5px">${name.name.official}</p>
            </li>
        `;
      })
      .join('');
  } else {
    markup = name
      .map(name => {
        const languagesObject = name.languages;
        const languagesArray = Object.keys(languagesObject).map(
          val => languagesObject[val]
        );
        return `
            <li style="
    display: flex;align-items: center;">
              <img class="country-flag" src=${name.flags.svg} alt="${
          name.name.official
        } " width="80" style="
    margin-right: 18px;"></img>
        <div class="country-name"><p style="font-size: 28px;font-weight: 700;margin-top: 5px;margin-bottom: 5px">${
          name.name.official
        }</p></div>
        </li>
              <li><p style="
    font-size: 20px;font-weight:600;"><b style="
    font-size: 25px;">Capital</b>: ${name.capital}</p></li>
              <li><p style="
    font-size: 20px;font-weight:600;"><b style="
    font-size: 25px;">Languages</b>: ${languagesArray.join(', ')}</p></li>
              <li><p style="
    font-size: 20px;font-weight:600;"><b style="
    font-size: 25px;">Population</b>: ${name.population}</p></li>
            
        `;
      })
      .join('');
  }
  list.innerHTML = markup;
}
