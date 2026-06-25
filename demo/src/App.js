import logo from './logo.svg';
import MerchiProductForm from 'merchi_product_form';
import './App.css';
import { useEffect, useState } from 'react';

function urlSearchParams(inputParams) {
  const params = { ...inputParams };  // Create a shallow copy to prevent mutation

  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === "") {
      delete params[key];
    } else if (Array.isArray(params[key])) {
      params[key] = params[key].join(',');
    } else if (typeof params[key] === 'object') {
      params[key] = JSON.stringify(params[key]);
    }
  });

  return new URLSearchParams(params).toString();
}

const API_URL = 'https://api.merchi.co/v6/';
const PRODUCT_ID = 118600;

function App() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParmas = urlSearchParams({
    embed: {
      domain: {
        company: {},
        logo: {},
      },
      featureImage: {},
      images: {},
    },
  });
  async function fetchProduct() {
    setLoading(true);
    const url = `${API_URL}products/${PRODUCT_ID}/?${urlParmas}`;
    try {
      const response = await fetch(url, {});
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
      {product.id && (
        <MerchiProductForm initProduct={product} apiUrl={API_URL} />
      )}
    </div>
  );
}

export default App;
