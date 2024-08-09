import React, { createContext, useState } from 'react';

// Crear el contexto
const GenericContext = createContext({
    data: [],
    isLoading: false,
    fetchData: () => {},
    addItem: () => {},
    editItem: () => {},
    deleteItem: () => {},
});

// Proveedor del contexto
export const GenericProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Función para obtener los datos desde la API
    const fetchData = async (apiUrl) => {
        setIsLoading(true);
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
        setIsLoading(false);
    };

    // Función para agregar un nuevo elemento
    const addItem = async (apiUrl, item) => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el elemento');
            }

            const newItem = await response.json();
            setData((prevData) => [...prevData, newItem]);
        } catch (error) {
            console.error('Error al agregar el elemento:', error);
        }
    };

    // Función para editar un elemento existente
    const editItem = async (apiUrl, item) => {
        try {
            const response = await fetch(`${apiUrl}/${item.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el elemento');
            }

            const updatedItem = await response.json();
            setData((prevData) =>
                prevData.map((dataItem) =>
                    dataItem.id === updatedItem.id ? updatedItem : dataItem
                )
            );
        } catch (error) {
            console.error('Error al actualizar el elemento:', error);
        }
    };

    // Función para eliminar un elemento
    const deleteItem = async (apiUrl, itemId) => {
        try {
            const response = await fetch(`${apiUrl}/${itemId}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el elemento');
            }

            setData((prevData) => prevData.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error('Error al eliminar el elemento:', error);
        }
    };

    return (
        <GenericContext.Provider
            value={{
                data,
                isLoading,
                fetchData,
                addItem,
                editItem,
                deleteItem,
            }}
        >
            {children}
        </GenericContext.Provider>
    );
};

