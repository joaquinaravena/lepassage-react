import React, { useEffect, useState } from "react";
import TableContainer from "./TableContainer";
import useDataTable from "./useDataTable";
import { HashLoader } from "react-spinners";

export default function GenericTable({ config, searchQuery }) {
    const { fields, tableName, apiUrl , choices} = config;

    const {
        data,
        selectedIndex,
        isLoading,
        handleAddRow,
        handleDeleteRow,
        handleEditRow,
        handleRowClick,
        updateStock,
    } = useDataTable({ fields, tableName, apiUrl, choices });

    const [filteredData, setFilteredData] = useState(data);

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

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-full">
                <HashLoader color={"#111"} loading={isLoading} size={100} />
            </div>
        );

    const costoTotalTablaActual = filteredData.reduce((acc, curr) => acc + parseFloat(curr.precio) || 0, 0).toFixed(2);

    return (
        <TableContainer className="overflow-auto h-full flex flex-col bg-options-panel">
            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    {tableName !== "Insumos" && (
                        <button
                            onClick={() => handleAddRow()}
                            className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                        >
                            Agregar
                        </button>
                    )}
                    {tableName !== "Insumos" && (
                        <button
                            onClick={() => handleEditRow()}
                            className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                        >
                            Editar
                        </button>
                    )}{tableName !== "Insumos" && (
                        <button
                            onClick={() => handleDeleteRow()}
                            className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                        >
                            Eliminar
                        </button>
                    )}{tableName !== "Insumos" && (
                        <button
                            onClick={() => updateStock()}
                            className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                        >
                            Ingresar Stock
                        </button>
                    )}
                    {tableName !== "Insumos" && (
                        <button
                            onClick={() => updateStock()}
                            className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                        >
                            Egresar Stock
                        </button>
                    )}
                </div>
                <div className="flex border-2 flex-col items-end mb-4 space-y-2">
                    <div className="text-right">
                        <p className="text-sm font-medium">Costo total: $</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">Costo total {tableName}: ${costoTotalTablaActual}</p>
                    </div>
                </div>
            </div>
            <table className="min-w-full">
                <thead>
                <tr>
                    {fields.map((field) => (
                        <th
                            key={field.name}
                            className="px-4 py-2 text-left border-b border-gray-200"
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
                            selectedIndex === index ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleRowClick(index)}
                    >
                        {fields.map((field) => (
                            <td
                                key={field.name}
                                className="px-4 py-2 border-b border-gray-200"
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
