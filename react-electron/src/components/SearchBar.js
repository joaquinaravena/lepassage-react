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

    const searchBarStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const inputStyle = {
        marginRight: '8px',
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
    };

    return (
        <div style={searchBarStyle}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Buscar..."
                style={inputStyle}
            />
            <button onClick={handleSearch} style={buttonStyle}>
                <FaSearch />
            </button>
        </div>
    );
}
