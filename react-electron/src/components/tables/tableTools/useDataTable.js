import { useState } from 'react';
import Swal from 'sweetalert2';

export default function useTableData(initialData) {
    const [datos, setDatos] = useState(initialData);
    const [newRow, setNewRow] = useState({ });
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

    const handleAddRow = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Agregar Producto',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Nombre del Producto">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Precio">' +
                '<input id="swal-input3" class="swal2-input" placeholder="Cantidad">',
            focusConfirm: false,
            preConfirm: () => {
                return {
                    Nombre: document.getElementById('swal-input1').value,
                    Edad: document.getElementById('swal-input2').value,
                    Ciudad: document.getElementById('swal-input3').value
                };
            },
            didOpen: () => {
                // Añadir listener para capturar Enter
                const inputElements = document.querySelectorAll('.swal2-input');
                inputElements.forEach(input => {
                    input.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            document.querySelector('.swal2-confirm').click();
                        }
                    });
                });
            }
        });

        if (formValues && formValues.Nombre && formValues.Edad && formValues.Ciudad) {
            setDatos([...datos, formValues]);
            Swal.fire(
                'Producto agregado',
                'El producto ha sido agregado correctamente',
                'success'
            );
        } else {
            Swal.fire(
                'Error',
                'Por favor, completa todos los campos',
                'error'
            );
        }   
    };

    const handleEditRow = async () => {
        if (selectedIndex !== null) {
            const selectedData = datos[selectedIndex];
    
            const { value: formValues } = await Swal.fire({
                title: 'Editar Producto',
                html:
                    `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${selectedData.Nombre}">` +
                    `<input id="swal-input2" class="swal2-input" placeholder="Edad" value="${selectedData.Edad}">` +
                    `<input id="swal-input3" class="swal2-input" placeholder="Ciudad" value="${selectedData.Ciudad}">`,
                focusConfirm: false,
                preConfirm: () => {
                    return {
                        Nombre: document.getElementById('swal-input1').value,
                        Edad: document.getElementById('swal-input2').value,
                        Ciudad: document.getElementById('swal-input3').value
                    };
                },
                didOpen: () => {
                    // Añadir listener para capturar Enter
                    const inputElements = document.querySelectorAll('.swal2-input');
                    inputElements.forEach(input => {
                        input.addEventListener('keydown', function(event) {
                            if (event.key === 'Enter') {
                                event.preventDefault();  // Evitar el comportamiento predeterminado
                                document.querySelector('.swal2-confirm').click();
                            }
                        });
                    });
                }
            });
    
            if (formValues && formValues.Nombre && formValues.Edad && formValues.Ciudad) {
                const updatedDatos = [...datos];
                updatedDatos[selectedIndex] = formValues;
                setDatos(updatedDatos);
                Swal.fire(
                    'Producto actualizado',
                    'El producto ha sido actualizado correctamente',
                    'success'
                );
            } else {
                Swal.fire(
                    'Error',
                    'Por favor, completa todos los campos',
                    'error'
                );
            }
        } else {
            Swal.fire(
                'Error',
                'No hay fila seleccionada',
                'error'
            );
        }
    };

    const handleDeleteRow = () => {
        if (selectedIndex !== null) {
            Swal.fire({
                title: 'Le Pas Sage',
                text: 'No podrás revertir esto',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    setDatos(datos.filter((_, i) => i !== selectedIndex));
                    setSelectedIndex(null);
                    Swal.fire(
                        'Eliminado',
                        'La fila ha sido eliminada.',
                        'success'
                    );
                }
            });
        }
    };
    const handleRowClick = (index, e) => {
        if (selectedIndex === index && e.detail === 1 && !isEditing) {
            setSelectedIndex(null);
            setIsEditing(false);
        } else {
            setSelectedIndex(index);
            if (isEditing) {
                setEditValues(datos[index]);
            }
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
        setShowAddForm
    };
}
