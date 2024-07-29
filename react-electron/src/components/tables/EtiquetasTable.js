import TableContainer from "./tableTools/TableContainer";
import React, {useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import useTableData from './tableTools/useDataTable';
import SearchBar from "../SearchBar";

export default function EtiquetasTable(className) {
    const {
        datos,
        newRow,
        showAddForm,
        isEditing,
        selectedIndex,
        editValues,
        handleInputChange,
        handleEditInputChange,
        handleAddRow,
        handleEditRow,
        handleDeleteRow,
        handleRowClick,
        handleBlur,
        setShowAddForm
    } = useTableData([
        { Nombre: "Juan", Edad: 25, Ciudad: "Madrid" },
        { Nombre: "Ana", Edad: 28, Ciudad: "Barcelona" },
        { Nombre: "Pedro", Edad: 30, Ciudad: "Valencia" }
    ]);

    return (
        <TableContainer className={className + " overflow-auto h-full flex flex-col"}>
            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    <button onClick={() => setShowAddForm(true)} className="mb-4 bg-white text-black ">Agregar</button>
                    <button onClick={handleEditRow} className=" mb-4 bg-white text-black ">Editar</button>
                    <button onClick={handleDeleteRow} className="mb-4 bg-white text-black ">Eliminar</button>
                </div>
                {showAddForm && (
                    <div className="mt-4 flex space-x-2">
                        <input
                            type="text"
                            name="Nombre"
                            placeholder="Nombre"
                            value={newRow.Nombre}
                            onChange={handleInputChange}
                            className="px-2 py-1 border"
                            style={{ userSelect: 'none' }}
                        />
                        <input
                            type="text"
                            name="Edad"
                            placeholder="Edad"
                            value={newRow.Edad}
                            onChange={handleInputChange}
                            className="px-2 py-1 border"
                            style={{ userSelect: 'none' }}
                        />
                        <input
                            type="text"
                            name="Ciudad"
                            placeholder="Ciudad"
                            value={newRow.Ciudad}
                            onChange={handleInputChange}
                            className="px-2 py-1 border"
                            style={{ userSelect: 'none' }}
                        />
                        <button onClick={handleAddRow} className="px-4 py-2 bg-blue-500 text-white">Agregar</button>
                    </div>
                )}
            </div>
            <table className="min-w-full">
                <thead>
                <tr>
                    <th className="px-4 py-2 text-left border-b border-gray-200">Nombre</th>
                    <th className="px-4 py-2 text-left border-b border-gray-200">Edad</th>
                    <th className="px-4 py-2 text-left border-b border-gray-200">Ciudad</th>
                </tr>
                </thead>
                <tbody>
                {datos.map((fila, index) => (
                    <tr
                        key={index}
                        className={`cursor-pointer ${selectedIndex === index ? "bg-gray-200" : ""}`}
                        onClick={(e) => handleRowClick(index, e)}
                        onBlur={handleBlur}
                    >
                        <td className="px-4 py-2 border-b border-gray-200">
                            {isEditing && selectedIndex === index ? (
                                <input
                                    type="text"
                                    name="Nombre"
                                    value={editValues.Nombre}
                                    onChange={handleEditInputChange}
                                    onBlur={handleBlur}
                                    className="px-2 py-1 border"
                                    style={{ userSelect: 'none' }}
                                />
                            ) : (
                                fila.Nombre
                            )}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200">
                            {isEditing && selectedIndex === index ? (
                                <input
                                    type="text"
                                    name="Edad"
                                    value={editValues.Edad}
                                    onChange={handleEditInputChange}
                                    onBlur={handleBlur}
                                    className="px-2 py-1 border"
                                    style={{ userSelect: 'none' }}
                                />
                            ) : (
                                fila.Edad
                            )}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200">
                            {isEditing && selectedIndex === index ? (
                                <input
                                    type="text"
                                    name="Ciudad"
                                    value={editValues.Ciudad}
                                    onChange={handleEditInputChange}
                                    onBlur={handleBlur}
                                    className="px-2 py-1 border"
                                    style={{ userSelect: 'none' }}
                                />
                            ) : (
                                fila.Ciudad
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </TableContainer>
    );
}