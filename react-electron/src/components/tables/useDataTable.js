import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { GenericContext } from "../contexts/GenericContext";

export default function useDataTable({ fields, tableName, apiUrl, choices }) {
  const { deleteItem, fetchData, addItem, editItem, updateColumn, data } = useContext(GenericContext);
  const [datos, setDatos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchDataLocal = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000" + apiUrl);
        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };
    fetchDataLocal();
  }, [apiUrl]);

  const createInputsHtml = (fields, selectedData) => {
    return `<div style="display: flex; flex-wrap: wrap; gap: 15px;">${fields
        .map((field, index) => {
          if (field.options) {
            return `
                    <div style="flex: 1; min-width: 220px;">
                        <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
                        <select id="swal-input${index}" class="swal2-input" style="width: 80%;">
                            ${field.options.map(option => `
                                <option value="${option.value}" ${selectedData ? (selectedData[field.name] === option.value ? 'selected' : '') : ''}>
                                    ${option.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>`;
          } else {
            const value = selectedData ? (selectedData[field.name] !== undefined ? selectedData[field.name] : "indefinido") : "";
            return `
                    <div style="flex: 1; min-width: 220px;">
                        <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
                        <input id="swal-input${index}" class="swal2-input" style="width: 80%;" value="${value}" />
                    </div>`;
          }
        })
        .join("")}</div>`;
  };

  const getFormValues = (fields) => {
    return fields.reduce((acc, field, index) => {
      const element = document.getElementById(`swal-input${index}`);
      if (element.tagName === 'SELECT') {
        acc[field.name] = element.value;
      } else {
        acc[field.name] = element.value;
      }
      return acc;
    }, {});
  };

  const handleAddRow = async () => {
    console.log(choices);
    const { value: formValues } = await Swal.fire({
      title: `Agregar en ${tableName}`,
      html: createInputsHtml(fields),
      focusConfirm: false,
      preConfirm: () => getFormValues(fields),
      didOpen: () => {
        const inputElements = document.querySelectorAll(".swal2-input");
        inputElements.forEach((input) => {
          input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
              event.preventDefault();
              document.querySelector(".swal2-confirm").click();
            }
          });
        });
      },
    });

    if (formValues && fields.every((field) => formValues[field.name])) {
      await addItem(apiUrl, formValues);
      setDatos([...datos, formValues]);
      Swal.fire(
          `${tableName} agregado`,
          `${tableName} ha sido agregado correctamente`,
          "success"
      );
    } else {
      Swal.fire("Error", "Por favor, completa todos los campos", "error");
    }
    console.log(choices);
  };

  const handleEditRow = async () => {
    if (selectedIndex !== null) {
      const selectedData = datos[selectedIndex];
      const { value: formValues } = await Swal.fire({
        title: `Editar ${tableName}`,
        html: createInputsHtml(fields, selectedData),
        focusConfirm: false,
        preConfirm: () => getFormValues(fields),
        didOpen: () => {
          const inputElements = document.querySelectorAll(".swal2-input");
          inputElements.forEach((input) => {
            input.addEventListener("keydown", function (event) {
              if (event.key === "Enter") {
                event.preventDefault();
                document.querySelector(".swal2-confirm").click();
              }
            });
          });
        },
      });

      if (formValues && fields.every((field) => formValues[field.name])) {
        editItem(apiUrl, selectedData.id, formValues);
        const updatedDatos = [...datos];
        updatedDatos[selectedIndex] = formValues;
        setDatos(updatedDatos);
        Swal.fire(
            `${tableName} actualizado`,
            `${tableName} ha sido actualizado correctamente`,
            "success"
        );
      } else {
        Swal.fire("Error", "Por favor, completa todos los campos", "error");
      }
    } else {
      Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };

  const handleDeleteRow = async () => {
    if (selectedIndex !== null) {
      const selectedData = datos[selectedIndex];
      Swal.fire({
        title: "Eliminar fila",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteItem(apiUrl, selectedData.id);
          await fetchData(apiUrl);
          setDatos(datos.filter((_, index) => index !== selectedIndex));
          setSelectedIndex(null);
          await Swal.fire("Eliminado", "La fila ha sido eliminada.", "success");
        }
      });
    } else {
      Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };

  const handleRowClick = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const tableContainer = document.querySelector(".table-container");
      if (tableContainer && !tableContainer.contains(event.target)) {
        setSelectedIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateStock = async () => {
    if (selectedIndex !== null) {
      const selectedData = datos[selectedIndex];

      const isLiquidosTable = tableName === "Líquidos";

      const { value: formValues } = await Swal.fire({
        title: `Actualizar ${isLiquidosTable ? 'Volumen' : 'Stock'} en ${tableName}`,
        html: isLiquidosTable
            ? `<div style="flex: 1; min-width: 220px;">
              <label for="swal-input-volumen" style="display: block;">Volumen</label>
              <input id="swal-input-volumen" class="swal2-input" style="width: 80%;" value="${selectedData.volumen || 0}">
           </div>`
            : `<div style="flex: 1; min-width: 220px;">
              <label for="swal-input-stock" style="display: block;">Stock</label>
              <input id="swal-input-stock" class="swal2-input" style="width: 80%;" value="${selectedData.stock || 0}">
           </div>`,
        focusConfirm: false,
        preConfirm: () => {
          return isLiquidosTable
              ? { volumen: document.getElementById("swal-input-volumen").value }
              : { stock: document.getElementById("swal-input-stock").value };
        },
        didOpen: () => {
          const inputElements = document.querySelectorAll(".swal2-input");
          inputElements.forEach((input) => {
            input.addEventListener("keydown", function (event) {
              if (event.key === "Enter") {
                event.preventDefault();
                document.querySelector(".swal2-confirm").click();
              }
            });
          });
        },
      });

      if (formValues && (isLiquidosTable ? formValues.volumen !== undefined : formValues.stock !== undefined)) {
        const updatedDatos = [...datos];
        if (isLiquidosTable) {
          await updateColumn(apiUrl, selectedData.id, "volumen", parseFloat(formValues.volumen));
        } else {
          await updateColumn(apiUrl, selectedData.id, "stock", parseFloat(formValues.stock));
        }

        updatedDatos[selectedIndex] = {
          ...selectedData,
          ...(isLiquidosTable ? { volumen: parseFloat(formValues.volumen) } : { stock: parseFloat(formValues.stock) }),
        };
        setDatos(updatedDatos);

        Swal.fire(
            `${isLiquidosTable ? 'Volumen' : 'Stock'} actualizado`,
            `El ${isLiquidosTable ? 'volumen' : 'stock'} ha sido actualizado correctamente`,
            "success"
        );
      } else {
        Swal.fire("Error", "Por favor, completa el campo correctamente", "error");
      }
    } else {
      Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };

  return {
    datos,
    selectedIndex,
    isLoading,
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
    handleRowClick,
    updateStock,
  };
}
