import React, { useEffect, useState, useRef } from "react";
import { HashLoader } from "react-spinners";
import useProductTable from "./useProductTable";
import TableContainer from "../tables/TableContainer";
import useCostoTotal from "../costoTotal";

export default function ProductTable({ viewConfig, productConfig, searchQuery }) {
    const { fields: viewFields, tableName: viewTableName, apiUrl: viewApiUrl } = viewConfig;
    const { fieldsTable: productFields, apiUrlTable: productApiUrl } = productConfig;

    const costoTotal = useCostoTotal();

    const [isProductTableVisible, setIsProductTableVisible] = useState(false);
    const [liquidosMap, setLiquidosMap] = useState({});
    const { data, isLoading, handleAddRow, handleDeleteRow, handleEditRow, handleRowClick, increaseStock, decreaseStock } =
        useProductTable({
            tableName: isProductTableVisible ? viewTableName : 'productos',
            apiUrl: isProductTableVisible ? viewApiUrl : productApiUrl,
            fieldsTable: isProductTableVisible ? viewFields : productFields,
            apiUrlView: viewApiUrl,
        });

    const [filteredData, setFilteredData] = useState([]);
    const [selectedFilteredIndex, setSelectedFilteredIndex] = useState(null);
    const tableRef = useRef(null); // Referencia para la tabla

    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            setFilteredData(
                data.filter((fila) =>
                    productFields.some((field) =>
                        fila[field.name]?.toString().toLowerCase().includes(lowerCaseQuery)
                    )
                )
            );
        } else {
            setFilteredData(data);
        }
    }, [searchQuery, data, productFields]);

    useEffect(() => {
        // Actualizar datos de líquidos (si se requiere) al cargar
        // Suponiendo que el `data` contiene información de líquidos
        const fetchLiquidos = async () => {
            const response = await fetch("http://localhost:8000/api/liquidos/"); // Cambiar URL según sea necesario
            const liquidos = await response.json();
            const map = {};
            liquidos.forEach((liquido) => {
                map[liquido.id] = liquido.nombre;
            });
            setLiquidosMap(map);
        };

        fetchLiquidos();
    }, []);

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
        const cantidad = parseFloat(curr.stock) || 0;
        return acc + (precio * cantidad);
    }, 0).toFixed(2);

    const toggleProductTable = () => {
        setIsProductTableVisible(!isProductTableVisible);
    };

    const fieldsToShow = isProductTableVisible ? viewFields : productFields;

    return (
        <TableContainer ref={tableRef} className="overflow-auto h-full flex flex-col bg-options-panel">
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
                        <p className="text-sm font-medium">Valorizacion de Stock Total: ${costoTotal}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">Valorizacion de Stock
                            en {isProductTableVisible ? viewTableName : 'Productos'}: ${costoTotalTablaActual}</p>
                    </div>
                </div>
            </div>

            <div className="overflow-auto max-h-full">
            <table className="min-w-full">
                <thead className="sticky top-0 bg-options-panel">
                <tr>
                    {fieldsToShow.map((field) => (
                        <th key={field.name} className="px-4 py-2 text-center border-b border-gray-200">
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
                        {fieldsToShow.map((field) => (
                            <td key={field.name} className="px-4 py-2 text-center border-b border-gray-200">
                                {field.name === "id_liquido" ? (
                                    liquidosMap[fila[field.name]] || "Desconocido"
                                ) : (
                                    Array.isArray(fila[field.name]) ? (
                                        fila[field.name].map((item) => item.nombre).join(", ")
                                    ) : (
                                        fila[field.name] !== undefined ? fila[field.name] : "indefinido"
                                    )
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </TableContainer>
    );
}
