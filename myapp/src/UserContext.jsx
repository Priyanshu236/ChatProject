import axios from "axios";
import { createContext, useEffect } from "react";
import  {useState} from "react"

export const UserContext = createContext({})

export function UserContextProvider({children}){
    const [username, setUsername] = useState()
    const [id, setId] = useState()
    useEffect(() => {
        (async function () {
          try {
            const response = await axios.get("/profile");
            setId(response?.data?.userId);
            setUsername(response?.data?.username);
          } catch (error) {
            console.error(error);
          }
        })();
    
      }, []);
    return(
        <UserContext.Provider value={{username,setUsername,id,setId}}>
            {children}
        </UserContext.Provider>
    )
}