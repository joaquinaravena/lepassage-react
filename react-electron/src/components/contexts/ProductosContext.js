import React, { createContext, useState } from 'react';

export const ProductosContext = createContext({
    dataProducto: [],
    isLoadingProducto: false,
    fetchDataProducto: () => {},
    addItemProducto: () => {},
    editItemProducto: () => {},
    deleteItemProducto: () => {},
});

// Proveedor del contexto
export const ProductosProvider = ({ children }) => {
    const [dataProducto, setDataProducto] = useState([]);
    const [isLoadingProducto, setIsLoadingProducto] = useState(false);
    const apiUrl = "/api/productos/";

    const fetchDataProducto = async () => {
        setIsLoadingProducto(true);
        try {
            const response = await fetch("http://localhost:8000" + apiUrl);
            const data = await response.json();
            setDataProducto(data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
        setIsLoadingProducto(false);
    };

    const addItemProducto = async (item) => {
        try {
            console.log("Datos enviados:", item);
            const response = await fetch("http://localhost:8000" + apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });

            const newItem = await response.json();
            setDataProducto((prevData) => [...prevData, newItem]);
        } catch (error) {
            console.error('Error al agregar el elemento:', error);
        }
    };

    const editItemProducto = async (id, item) => {
        try {
            const response = await fetch("http://localhost:8000" + `${apiUrl}${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });

            const updatedItem = await response.json();
            setDataProducto((prevData) =>
                prevData.map((dataItem) =>
                    dataItem.id === updatedItem.id ? updatedItem : dataItem
                )
            );
        } catch (error) {
            console.error('Error al actualizar el elemento:', error);
        }
    };


    const deleteItemProducto = async (id) => {
        try {
            await fetch("http://localhost:8000" + `${apiUrl}${id}/`, {
                method: 'DELETE',
            });
            setDataProducto((prevData) => prevData.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error al eliminar el elemento:', error);
        }
    };

    const updateColumnProducto = async (id, columnName, newValue) => {
        try {
            const response = await fetch("http://localhost:8000" + `${apiUrl}${id}/`, {
                method: 'PATCH',  // Usamos PATCH para actualizar solo una parte del objeto
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [columnName]: newValue }),
            });

            const updatedItem = await response.json();
            setDataProducto((prevData) =>
                prevData.map((dataItem) =>
                    dataItem.id === updatedItem.id ? updatedItem : dataItem
                )
            );
        } catch (error) {
            console.error('Error al actualizar la columna:', error);
        }
    };

    return (
        <ProductosContext.Provider
            value={{
                data: dataProducto,
                isLoading: isLoadingProducto,
                fetchDataProducto,
                addItemProducto,
                editItemProducto,
                deleteItemProducto,
                updateColumnProducto,
            }}
        >
            {children}
        </ProductosContext.Provider>
    );
};

