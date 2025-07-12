import './FavoriteCities.css';
import { FaTrash } from 'react-icons/fa';

const FavoriteCities = ({ favorites, onSelectCity, onRemoveCity }) => {
    if (!favorites || favorites.length === 0) {
        return null;
    }

    return (
        <div className="favorite-cities">
            <h4 className="favorites-title">Favoritos</h4>
            <div className="favorites-list">
                {favorites.map(city => (
                    <div className="favorite-item" key={city}>
                        <button 
                            className="favorite-city-button"
                            onClick={() => onSelectCity(city)}
                        >
                            {city}
                        </button>
                        <button 
                            className="favorite-remove-button"
                            onClick={() => onRemoveCity(city)}
                            aria-label={`Eliminar ${city} de favoritos`}
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoriteCities;