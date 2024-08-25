import React, { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import useProductTable from "./useProductTable";
import TableContainer from "../tables/TableContainer";
import {costoTotal} from "../costoTotal";

export default function ProductTable({ viewConfig, productConfig, searchQuery }) {
    const { fields: viewFields, tableName: viewTableName, apiUrl: viewApiUrl } = viewConfig; // Fields de la vista
    const { fieldsTable: productFields, apiUrlTable: productApiUrl } = productConfig; // Fields de la tabla real

    const [isProductTableVisible, setIsProductTableVisible] = useState(false); // Estado para alternar entre vista y tabla
    const { data, selectedIndex, isLoading, handleAddRow, handleDeleteRow, handleEditRow, handleRowClick, increaseStock, decreaseStock } =
        useProductTable({
            tableName: isProductTableVisible ? viewTableName : 'productos', // Alterna entre la tabla productos y la vista
            apiUrl: isProductTableVisible ? viewApiUrl : productApiUrl,
            fieldsTable: isProductTableVisible ? viewFields : productFields,
            apiUrlView: viewApiUrl,
        });

    const [totalCosto, setTotalCosto] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCostoTotal = async () => {
            try {
                const total = await costoTotal();
                setTotalCosto(total);
            } catch (error) {
                console.error('Error calculating total cost:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCostoTotal();
    }, []);

    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            setFilteredData(
                data.filter((fila) =>
                    (isProductTableVisible ? viewFields : productFields).some((field) =>
                        fila[field.name]?.toString().toLowerCase().includes(lowerCaseQuery)
                    )
                )
            );
        } else {
            setFilteredData(data);
        }
    }, [searchQuery, data, viewFields, productFields, isProductTableVisible]);

    if (isLoading || loading)
        return (
            <div className="flex justify-center items-center h-full">
                <HashLoader color={"#111"} loading={isLoading} size={100} />
            </div>
        );

    const costoTotalTablaActual = filteredData.reduce((acc, curr) => {
        const precio = parseFloat(curr.precio) || 0;
        const cantidad = parseFloat(curr.stock) || 0;
        return acc + (precio * cantidad);
    }, 0).toFixed(2);


    const toggleProductTable = () => {
        setIsProductTableVisible(!isProductTableVisible);
    };

    const fieldsToShow = isProductTableVisible ? viewFields : productFields;

    return (
        <TableContainer className="overflow-auto h-full flex flex-col bg-options-panel">
            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    <button
                        onClick={toggleProductTable}
                        className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                    >
                        {isProductTableVisible ? "Productos" : "Catálogo"}
                    </button>

                    <button
                        onClick={() => handleAddRow()}
                        className={`mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white ${isProductTableVisible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isProductTableVisible}
                    >
                        Agregar
                    </button>
                    <button
                        onClick={() => handleEditRow()}
                        className={`mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white ${isProductTableVisible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isProductTableVisible}
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDeleteRow()}
                        className={`mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white ${isProductTableVisible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isProductTableVisible}
                    >
                        Eliminar
                    </button>
                    <button
                        onClick={() => increaseStock()}
                        className={`mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white ${isProductTableVisible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isProductTableVisible}
                    >
                        Ingresar Stock
                    </button>
                    <button
                        onClick={() => decreaseStock()}
                        className={`mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white ${isProductTableVisible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isProductTableVisible}
                    >
                        Egresar Stock
                    </button>
                </div>
                <div
                    className="flex flex-col items-end mb-4 space-y-2 border border-gray-300 p-4 rounded-lg shadow-sm bg-white">
                    <div className="text-right">
                        <p className="text-sm font-medium">Valorizacion de Stock Total: ${totalCosto}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">Valorizacion de Stock
                            en {isProductTableVisible ? viewTableName : 'Productos'}: ${costoTotalTablaActual}</p>
                    </div>
                </div>

            </div>

            <table className="min-w-full">
                <thead>
                <tr>
                    {fieldsToShow.map((field) => (
                        <th key={field.name} className="px-4 py-2 text-left border-b border-gray-200">
                            {field.placeholder}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {filteredData.map((fila, index) => (
                    <tr
                        key={index}
                        className={`cursor-pointer ${selectedIndex === index ? "bg-blue-50" : ""}`}
                        onClick={() => handleRowClick(index)}
                    >
                        {fieldsToShow.map((field) => (
                            <td key={field.name} className="px-4 py-2 border-b border-gray-200">
                                {Array.isArray(fila[field.name]) ? (
                                    // Si es un array, unimos los valores que queremos mostrar
                                    fila[field.name].map((item) => item.nombre).join(", ")
                                ) : (
                                    fila[field.name] !== undefined ? fila[field.name] : "indefinido"
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>

            </table>
        </TableContainer>
    );
}
