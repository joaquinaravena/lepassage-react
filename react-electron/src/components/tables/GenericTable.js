import React from "react";
import TableContainer from "./TableContainer";
import useTableData from "./useDataTable";
import {HashLoader} from "react-spinners";

export default function GenericTable({ config }) {
  const { fields, tableName, apiUrl } = config;

  const {
    datos,
    selectedIndex,
    isLoading,
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
    handleRowClick,
    updateStock,
  } = useTableData({ fields, tableName, apiUrl });

  if(isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <HashLoader color={"#111"} loading={isLoading} size={100} />
      </div>
    );

  const hasStockField = fields.some(field => field.name === "stock");

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
            {hasStockField && (
                <th className="px-4 py-2 text-left border-b border-gray-200">Acciones</th>
            )}
          </tr>
          </thead>
          <tbody>
          {datos.map((fila, index) => (
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
                      {fila[field.name] !== undefined ? fila[field.name] : "indefinido"}
                    </td>
                ))}
                {hasStockField && (
                    <td className="px-4 py-2 border-b border-gray-200 flex space-x-4">
                      <button
                          onClick={() => updateStock(index, 1)} // Increment stock
                          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        +
                      </button>
                      <button
                          onClick={() => updateStock(index, -1)} // Decrement stock
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        -
                      </button>
                    </td>
                )}
              </tr>
          ))}
          </tbody>
        </table>
      </TableContainer>
  );
}
