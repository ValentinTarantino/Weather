import { useState } from 'react';
import './SearchBar.css'; 

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Buscar ciudad..."
        className="search-input"
      />
      <button type="submit" className="search-button">
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;