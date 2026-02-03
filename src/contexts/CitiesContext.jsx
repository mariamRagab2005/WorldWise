import { createContext,useEffect,useState ,useContext } from "react";

const BASE_URL = 'http://localhost:9000';

const CitiesContext =  createContext();


function CitiesProvider({ children }) {
  const [cities, setCities] = useState ([]);
  const[isLoading, setIsLoading] = useState (false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect ( function()
  {
    async function fetchCities(){
      try
     { 
      setIsLoading (true);
      const res =await fetch(`${BASE_URL}/cities`);
      const data = await res.json();
      setCities(data);
    }
    catch{
      alert('There was an error fetching cities data');
    }
    finally{
      setIsLoading (false);
    }
  } 
  fetchCities();

  }, []);

  
 async function getCity (id){
  
      try
     { 
      setIsLoading (true);
      const res =await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);

    }
    catch(error){
      alert('There was an error fetching cities data');
    }
    finally{
      setIsLoading (false);
    }
  } 
  
  async function createCity(newCity) {
  
      try
     { 
      setIsLoading (true);
      const res =await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      setCurrentCity(data);
      setCities((cities) => [...cities, data]);
    }
    
    catch(error){
      alert('There was an error creating the city');
    }
    finally{
      setIsLoading (false);
    }
  } 

  async function deleteCity(id) {
  
      try
     { 
      setIsLoading (true);
     await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
     });
      
      setCities((cities) => cities.filter(city => city.id !== id) );
    }
    
    catch(error){
      alert('There was an error delete the city.');
    }
    finally{
      setIsLoading (false);
    }
  } 
  

   return (
    <CitiesContext.Provider 
    value=
    {{cities
    , isLoading
    , currentCity,
    getCity,
    createCity,
    deleteCity,
    }}>
      {children}
    </CitiesContext.Provider>
  );

}
//custom hook created to use the context
function useCities(){

  const context = useContext (CitiesContext);  
  if (context === undefined){
    throw new Error ('useCities must be used within a CitiesProvider');
  }
  return context;
}
export {  CitiesProvider, useCities};