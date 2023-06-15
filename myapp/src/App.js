import axios from "axios";
import Register from "./Register";
import { UserContextProvider } from "./UserContext";
import Routes from "./Routes";
function App() {
  axios.defaults.baseURL= "http://localhost:5001"
  axios.defaults.withCredentials = true
  return (
    <div className='App font-mono'> 
        <UserContextProvider>
          <Routes/>
        </UserContextProvider>
  
    </div>
  );
}

export default App;
