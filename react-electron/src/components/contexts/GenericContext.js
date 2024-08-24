import React, { createContext, useState } from 'react';

// Crear el contexto
export const GenericContext = createContext({
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
            const response = await fetch("http://localhost:8000" + apiUrl);
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
            const response = await fetch("http://localhost:8000" + apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });

            const newItem = await response.json();
            setData((prevData) => [...prevData, newItem]);
        } catch (error) {
            console.error('Error al agregar el elemento:', error);
        }
    };


    // Función para editar un elemento existente
    const editItem = async (apiUrl, id, item) => {
        try {
            const response = await fetch("http://localhost:8000" + `${apiUrl}${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });

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
    const deleteItem = async (apiUrl, id) => {
        try {
            await fetch("http://localhost:8000" + `${apiUrl}${id}/`, {
                method: 'DELETE',
            });
            setData((prevData) => prevData.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error al eliminar el elemento:', error);
        }
    };

    const updateColumn = async (apiUrl, id, columnName, newValue) => {
        try {
            // Actualiza solo la columna
            await fetch("http://localhost:8000" + `${apiUrl}${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [columnName]: newValue }),
            });

            setData((prevData) =>
                prevData.map((dataItem) =>
                    dataItem.id === id ? { ...dataItem, [columnName]: newValue } : dataItem
                )
            );
        } catch (error) {
            console.error('Error al actualizar la columna:', error);
        }
    };

    const updateProduct = async (apiUrl, id, updatedProduct) => {
        try {
            await fetch("http://localhost:8000" + `${apiUrl}${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            setData((prevData) =>
                prevData.map((dataItem) =>
                    dataItem.id === id ? { ...dataItem, ...updatedProduct } : dataItem
                )
            );
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
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
                updateColumn,
                updateProduct,
            }}
        >
            {children}
        </GenericContext.Provider>
    );
};

