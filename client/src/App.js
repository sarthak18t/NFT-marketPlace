import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Create from "./components/Create";
import MyListedItems from "./components/MyListedItems";
import MyPurchases from "./components/MyPurchases";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "./components/Loader";
import { useConnect, useAccount } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

function App() {
  const [loading, setLoading] = useState(true);
  const { isConnected } = useAccount();
  useEffect(() => {
    if (isConnected) setLoading(false);
  }, []);
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        {loading ? (
          <Loader />
        ) : (
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/my-listed-items" element={<MyListedItems />} />
              <Route path="/mypurchases" element={<MyPurchases />} />
            </Routes>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
