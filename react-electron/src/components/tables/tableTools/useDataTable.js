import { useState } from 'react';

export default function useTableData(initialData) {
    const [datos, setDatos] = useState(initialData);
    const [newRow, setNewRow] = useState({ Nombre: "", Edad: "", Ciudad: "" });
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [editValues, setEditValues] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRow({ ...newRow, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditValues({ ...editValues, [name]: value });
    };

    const handleAddRow = () => {
        setDatos([...datos, newRow]);
        setNewRow({ Nombre: "", Edad: "", Ciudad: "" });
        setShowAddForm(false);
    };

    const handleEditRow = () => {
        if (selectedIndex !== null) {
            setEditValues(datos[selectedIndex]);
            setIsEditing(true);
        }
    };

    const handleDeleteRow = () => {
        if (selectedIndex !== null) {
            setDatos(datos.filter((_, i) => i !== selectedIndex));
            setSelectedIndex(null);
        }
    };

    const handleRowClick = (index, e) => {
        if (selectedIndex === index && e.detail === 1) {
            setSelectedIndex(null);
            setIsEditing(false);
        } else {
            setSelectedIndex(index);
            if (isEditing) {
                setEditValues(datos[index]);
            }
        }
    };

    const handleBlur = () => {
        if (isEditing && selectedIndex !== null) {
            const updatedDatos = datos.map((row, i) =>
                i === selectedIndex ? { ...row, ...editValues } : row
            );
            setDatos(updatedDatos);
            setIsEditing(false);
            setSelectedIndex(null);
        }
    };

    return {
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
    };
}
