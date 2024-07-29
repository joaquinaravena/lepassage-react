import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="flex items-center bg-search-bar">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Buscar..."
                className="mr-2 bg-search-bar"
            />
            <button onClick={handleSearch} className="flex items-center p-2 cursor-pointer bg-transparent border-none">
                <FaSearch />
            </button>
        </div>
    );
}
