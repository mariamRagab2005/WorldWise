import CountryItem from './CountryItem';
import Styles from './CountryList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';

function CountryList() {
  const { cities, isLoading } = useCities();

    if (isLoading) return <Spinner />;

    if (cities.length === 0) return <Message message='Add your first city by clicking on a city on the map' />;
    
    // Get unique countries from cities
    const countries = cities.reduce((arr, city) =>
       {
        if(!arr.map((el)=> el.country).includes(city.country)){
            return [...arr, {country: city.country, emoji: city.emoji}];
        }
        else
        return arr;
       },
        []
    );

    return (
        <ul className={Styles.countryList}>
            {countries.map((country) => (
                <CountryItem key={country.country} country={country} />
            ))}
        </ul>
    );
}

export default CountryList;
