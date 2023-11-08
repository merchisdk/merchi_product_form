import logo from './logo.svg';
import MerchiProductForm from '../../src/';
import './App.css';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  async function fetchProduct() {
    setLoading(true);
    const url = `https://api.merchi.co/v6/products/46518/`;
    try {
      const response = await fetch(url, {
        embed: {
          domain: {
            company: {},
            logo: {},
          },
          featureImage: {},
          images: {},
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseJson = await response.json();
      setProduct(responseJson.product);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      throw new Error(e);
    }
  }
  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Merchi Product Demo <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://merchi.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          Merchi
        </a>
      </header>
      <MerchiProductForm initProduct={product} />
    </div>
  );
}

export default App;
