import './App.css';
import { ethers } from 'ethers';
import {BrowserRouter, Routes,Route} from "react-router-dom";
import Navigation from './components/Navigation';
import Home from './components/Home'
import Create from './components/Create'
import MyListedItems from './components/MyListedItems'
import MyPurchases from './components/MyPurchases'

function App() {

  return (
    <BrowserRouter>
      <div className="App">
      <Navigation/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create' element={<Create/>}/>
        <Route path='/my-listed-items' element={<MyListedItems/>}/>
        <Route path='/mypurchases' element={<MyPurchases/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
