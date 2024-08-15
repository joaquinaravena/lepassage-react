import React, { useEffect, useState } from "react";
import TableContainer from "./TableContainer";
import useDataTable from "./useDataTable";
import { HashLoader } from "react-spinners";

export default function GenericTable({ config, searchQuery }) {
    const { fields, tableName, apiUrl } = config;

    const {
        datos,
        selectedIndex,
        isLoading,
        handleAddRow,
        handleDeleteRow,
        handleEditRow,
        handleRowClick,
        updateStock,
    } = useDataTable({ fields, tableName, apiUrl });

    const [filteredData, setFilteredData] = useState(datos);

    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            setFilteredData(
                datos.filter((fila) =>
                    fields.some((field) =>
                        fila[field.name]?.toString().toLowerCase().includes(lowerCaseQuery)
                    )
                )
            );
        } else {
            setFilteredData(datos);
        }
    }, [searchQuery, datos, fields]);

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-full">
                <HashLoader color={"#111"} loading={isLoading} size={100} />
            </div>
        );

    return (
        <TableContainer className="overflow-auto h-full flex flex-col bg-options-panel">
            {tableName !== "Insumos" && (
            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleAddRow()}
                        className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                    >
                        Agregar
                    </button>
                    <button
                        onClick={() => handleEditRow()}
                        className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDeleteRow()}
                        className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                    >
                        Eliminar
                    </button>
                    <button
                        onClick={() => updateStock()}
                        className="mb-4 p-2 border rounded-lg border-text-border hover:bg-text-border hover:text-white"
                    >
                        Modificar Stock
                    </button>
                </div>
            </div>
            )}
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
