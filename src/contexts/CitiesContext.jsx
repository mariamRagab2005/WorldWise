/* eslint-disable no-unused-vars */
import { createContext,useEffect,useState ,useContext ,useReducer} from "react";

const BASE_URL = 'http://localhost:9000';

const CitiesContext =  createContext();

const iniitialState ={
  cities:[],
  isLoading:false,
  currentCity:{},
  error:"",
}
function reducer (state,action)
{
 switch(action.type)
 {
  case "loading" :
  return{...state , isLoading: true}


  case 'cities/loaded':
    return{
      ...state,
      isLoading: false,
      cities: action.payload
      
    }
   
    case "city/loaded":
      return{...state,
          isLoading: false,
          CurrentCity: action.payload
      }

  case 'city/created':
   return {...state,
    isLoading:false,
    cities:[...state.cities, action.payload]

   };

  case 'city/deleted':
  return {...state,
    isLoading:false,
    cities: state.cities.filter(city => city.id !== action.payload),
    CurrentCity: {}
}

   case 'rejected':
       return {...state,
    isLoading:false,
    error: action.payload,
      };
     


  default:
   throw new Error ("Unknown action type ")

 }
}

function CitiesProvider({ children }) {
 // const [cities, setCities] = useState ([]);
 // const[isLoading, setIsLoading] = useState (false);
 // const [currentCity, setCurrentCity] = useState({});
const[{cities,isLoading,currentCity},dispatch]=useReducer(reducer, iniitialState)
  useEffect ( function()
  {
    async function fetchCities(){
      dispatch({type: "loading" })
      try
     { 
      
      const res =await fetch(`${BASE_URL}/cities`);
      const data = await res.json();
      dispatch({type: 'cities/loaded', payload:data })
    }

    catch{
      dispatch({type: 'rejected', payload: " There was an error loading cities ..." ,})
    }
   
  } 
  fetchCities();

  }, []);

  
 async function getCity (id){
      dispatch({type: "loading" })
      try
     { 
      
      const res =await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
       dispatch({type: "cities/loaded" , payload: data })

    }
     catch{
      dispatch({type: 'rejected', 
        payload: " There was an error loading data ..." ,})
    }
    
  } 
  
  async function createCity(newCity) {
       dispatch({type: "loading" })
      try
     { 
      
      const res =await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      dispatch({type: "city/created" , payload: data

      })
    }
      catch{
      dispatch({type: 'rejected', 
        payload: " There was an error lcreating city..." ,})
    }
    
    
  } 

  async function deleteCity(id) {
     dispatch({type: "loading" })
      try
     { 
    
     await fetch(`${BASE_URL}/cities/${id}`, {
       method: 'DELETE',
     });
      
      dispatch({type: "city/deleted" , payload: id

      })
    }
    
      catch{
      dispatch({type: 'rejected', 
        payload: " There was an error to delete city..." ,})
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