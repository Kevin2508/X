import { useEffect, useState } from "react";
import "./App.css";
import Splash from "./pages/Splash";
import {Home} from "./pages/Home";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate startup tasks (fetch, auth, assets). Replace with real async work.
    const init = async () => {
      await new Promise(res => setTimeout(res, 1000));
      setLoading(false);
    };
    init();
  }, []);
  return <>
  
   {loading ? <Splash /> : <Home />}
  </>;
}

export default App;
