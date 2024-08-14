import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        onSearch(event.target.value); // Llama a onSearch en tiempo real
    };

    return (
        <div className="flex items-center bg-search-bar p-2 border rounded">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Buscar..."
                className="mr-2 bg-transparent border-none outline-none"
            />
            <button
                onClick={() => onSearch(query)} // Llama a onSearch al hacer clic en el botón
                className="flex items-center p-2 cursor-pointer bg-transparent border-none"
            >
                <FaSearch />
            </button>
        </div>
    );
}
