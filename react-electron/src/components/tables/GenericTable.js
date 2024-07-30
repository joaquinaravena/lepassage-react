import React from "react";
import TableContainer from "./TableContainer";
import useTableData from "./useDataTable";

export default function GenericTable({ config }) {
  const { fields, tableName } = config;

  const {
    datos,
    selectedIndex,
    isLoading,
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
    handleRowClick,
  } = useTableData({ fields, tableName });

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <TableContainer
      className={`overflow-auto h-full flex flex-col bg-options-panel`}
    >
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
      <table className="min-w-full">
        <thead>
          <tr>
            {config.fields.map((field) => (
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
          {datos.map((fila, index) => (
            <tr
              key={index}
              className={`cursor-pointer ${
                selectedIndex === index ? "bg-blue-50" : ""
              }`}
              onClick={() => handleRowClick(index)}
            >
              {config.fields.map((field) => (
                <td
                  key={field.name}
                  className="px-4 py-2 border-b border-gray-200"
                >
                  {fila[field.name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
}
