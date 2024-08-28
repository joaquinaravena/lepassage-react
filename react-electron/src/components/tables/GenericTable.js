import React, { useEffect, useState } from "react";
import TableContainer from "./TableContainer";
import useDataTable from "./useDataTable";
import { HashLoader } from "react-spinners";
import useCostoTotal from "../costoTotal";

export default function GenericTable({ config, searchQuery }) {
    const { fields, tableName, apiUrl } = config;
    const [filteredData, setFilteredData] = useState([]);
    const [selectedFilteredIndex, setSelectedFilteredIndex] = useState(null);

    const costoTotal = useCostoTotal();

    const {
        data,
        isLoading,
        handleAddRow,
        handleDeleteRow,
        handleEditRow,
        handleRowClick,
        increaseStock,
        decreaseStock
    } = useDataTable({ fields, tableName, apiUrl });

    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            setFilteredData(
                data.filter((fila) =>
                    fields.some((field) =>
                        fila[field.name]?.toString().toLowerCase().includes(lowerCaseQuery)
                    )
                )
            );
        } else {
            setFilteredData(data);
        }
    }, [searchQuery, data, fields]);


    const handleFilteredRowClick = (index) => {
        if(selectedFilteredIndex === index || index === null) {
            setSelectedFilteredIndex(null);
            handleRowClick(null);
        }else {
            const actualIndex = data.indexOf(filteredData[index]);
            setSelectedFilteredIndex(actualIndex);
            handleRowClick(actualIndex);
        }
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-full">
                <HashLoader color={"#111"} size={100} />
            </div>
        );

    const costoTotalTablaActual = filteredData.reduce((acc, curr) => {
        const precio = parseFloat(curr.precio) || 0;
        const cantidad = tableName === "Líquidos"
            ? (parseFloat(curr.volumen) || 0) // Convertir mililitros a litros
            : parseFloat(curr.stock) || 0;
        return acc + (precio * cantidad);
    }, 0).toFixed(2);

    return (
        <TableContainer className="overflow-auto h-full flex flex-col bg-options-panel">
            <div className="flex justify-between mb-4">
                {/* Botones de acción */}
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleAddRow()}
                        className={`mb-4 p-2 border rounded-lg ${
                            tableName === "Insumos"
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-text-border hover:bg-text-border hover:text-white"
                        }`}
                        disabled={tableName === "Insumos"}
                    >
                        Agregar
                    </button>
                    <button
                        onClick={() => handleEditRow()}
                        className={`mb-4 p-2 border rounded-lg ${
                            tableName === "Insumos"
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-text-border hover:bg-text-border hover:text-white"
                        }`}
                        disabled={tableName === "Insumos"}
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDeleteRow()}
                        className={`mb-4 p-2 border rounded-lg ${
                            tableName === "Insumos"
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-text-border hover:bg-text-border hover:text-white"
                        }`}
                        disabled={tableName === "Insumos"}
                    >
                        Eliminar
                    </button>
                    <button
                        onClick={() => increaseStock()}
                        className={`mb-4 p-2 border rounded-lg ${
                            tableName === "Insumos"
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-text-border hover:bg-text-border hover:text-white"
                        }`}
                        disabled={tableName === "Insumos"}
                    >
                        Ingresar Stock
                    </button>
                    <button
                        onClick={() => decreaseStock()}
                        className={`mb-4 p-2 border rounded-lg ${
                            tableName === "Insumos"
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-text-border hover:bg-text-border hover:text-white"
                        }`}
                        disabled={tableName === "Insumos"}
                    >
                        Egresar Stock
                    </button>
                </div>

                {/* Mostrar costos totales */}
                <div
                    className="flex flex-col items-end mb-4 space-y-2 border border-gray-300 p-4 rounded-lg shadow-sm bg-white">
                    <div className="text-right">
                        <p className="text-sm font-medium">Valorizacion de Stock Total: ${costoTotal}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">Valorizacion de Stock en {tableName}: ${costoTotalTablaActual}</p>
                    </div>
                </div>
            </div>

            {/* Tabla de datos */}
            <table className="min-w-full table-auto">
                <thead>
                <tr>
                    {fields.map((field) => (
                        <th
                            key={field.name}
                            className="px-4 py-2 text-center border-b border-gray-200"
                        >
                            {field.placeholder}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {filteredData.map((fila, index) => (
                    <tr
                        key={index}
                        className={`cursor-pointer ${
                            data.indexOf(fila) === selectedFilteredIndex ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleFilteredRowClick(index)}
                    >
                        {fields.map((field) => (
                            <td
                                key={field.name}
                                className="px-4 py-2 border-b border-gray-200 text-center"
                            >
                                {fila[field.name] !== undefined
                                    ? fila[field.name]
                                    : "indefinido"}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </TableContainer>
    );
}
