import React from "react";
import TableContainer from "./tableTools/TableContainer";
import useTableData from "./tableTools/useDataTable";

export default function EtiquetasTable({ className }) {
  const {
    datos,
    selectedIndex,
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
    handleRowClick,
  } = useTableData([]);

  return (
    <TableContainer
      className={`${className} overflow-auto h-full flex flex-col bg-options-panel`}
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
            <th className="px-4 py-2 text-left border-b border-gray-200">
              Nombre
            </th>
            <th className="px-4 py-2 text-left border-b border-gray-200">
              Edad
            </th>
            <th className="px-4 py-2 text-left border-b border-gray-200">
              Ciudad
            </th>
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
              <td className="px-4 py-2 border-b border-gray-200">
                {fila.Nombre}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {fila.Edad}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {fila.Ciudad}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
}
