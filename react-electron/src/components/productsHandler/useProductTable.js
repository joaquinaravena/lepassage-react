import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { GenericContext } from "../contexts/GenericContext";
import '../styles/styleSelect.css'

export default function useProductTable({ tableName, apiUrl, fieldsTable, apiUrlTable }) {
  const { deleteItem, fetchData, addItem, editItem, updateColumn, data, isLoading } = useContext(GenericContext);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Estado para las opciones de misceláneas, envases y paquetes
  const [options, setOptions] = useState({
    miscelaneas: [],
    envases: [],
    paquetes: [],
  });

  // Función para cargar opciones de un campo desde la API
  const loadOptions = async (url, fieldName) => {
    try {
      const response = await fetch("http://localhost:8000" + url);
      const result = await response.json();
      setOptions((prevOptions) => ({
        ...prevOptions,
        [fieldName]: result.map((item) => ({ value: item.id, label: item.nombre })), // Ajusta esto según el formato de datos
      }));
    } catch (error) {
    }
  };

  // Efecto para cargar las opciones de multi-select cuando se abra el formulario
  const loadAllOptions = async () => {
    const fieldsWithOptions = fieldsTable.filter((field) => field.type === "multi-select");
    for (const field of fieldsWithOptions) {
      await loadOptions(field.optionsUrl, field.name);
    }
  };

  useEffect(() => {
    const loadAllOptions = async () => {
      const fieldsWithOptions = fieldsTable.filter((field) => field.type === "multi-select");
      await Promise.all(fieldsWithOptions.map(field => loadOptions(field.optionsUrl, field.name)));
    };
    loadAllOptions().then(r => console.log('Opciones cargadas:', r));
  }, [fieldsTable]);

  useEffect(() => {
    fetchData(apiUrl);
  }, [apiUrl]);

  const createInputsHtml = (fields, selectedData) => {
    return `<div style="display: flex; flex-wrap: wrap; gap: 15px;">${fields
        .map((field, index) => {
          if (field.type === "multi-select") {
            console.log('opcion Name:', options[field.name]);
            return `
        <div style="flex: 1; min-width: 220px;">
          <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
          <select id="swal-input${index}" class="swal2-input" style="width: 100%;">
            ${options[field.name]?.map(option => `
              <option value="${option.value}" ${selectedData && selectedData[field.name]?.includes(option.value) ? 'selected' : ''}>
                ${option.label}
              </option>
            `).join('')}
          </select>
        </div>`;
          } else {
            const value = selectedData ? (selectedData[field.name] !== undefined ? selectedData[field.name] : "") : "";
            return `
        <div style="flex: 1; min-width: 220px;">
          <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
          <input id="swal-input${index}" class="swal2-input" style="width: 100%;" value="${value}" />
        </div>`;
          }
        }).join("")}</div>`;
  };


  const getFormValues = (fields) => {
    return fields.reduce((acc, field, index) => {
      const element = document.getElementById(`swal-input${index}`);
      if (field.type === "multi-select") {
        acc[field.name] = Array.from(element.selectedOptions).map(option => option.value);
      } else {
        acc[field.name] = element.value;
      }
      return acc;
    }, {});
  };

  const handleAddRow = async () => {
    await loadAllOptions(); // Cargamos las opciones antes de abrir el formulario
    //Verificar opciones
    console.log(options);


    const { value: formValues } = await Swal.fire({
      title: `Agregar en ${tableName}`,
      html: createInputsHtml(fieldsTable), // Usamos fieldsTable para incluir los multi-selects
      focusConfirm: false,
      preConfirm: () => getFormValues(fieldsTable),
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

    if (formValues && fieldsTable.every((field) => formValues[field.name])) {
      try {
        await addItem(apiUrlTable, formValues);
        await fetchData(apiUrl);

        await Swal.fire(
            `${tableName} agregado`,
            `${tableName} ha sido agregado correctamente`,
            "success"
        );
      } catch (error) {
        console.error("Error adding row:", error);
        await Swal.fire("Error", "No se pudo agregar la fila", "error");
      }
    } else {
      await Swal.fire("Error", "Por favor, completa todos los campos", "error");
    }
  };

  const handleEditRow = async () => {
    if (selectedIndex !== null) {
      const selectedData = data[selectedIndex];

      await loadAllOptions(); // Cargamos las opciones antes de abrir el formulario

      const { value: formValues } = await Swal.fire({
        title: `Editar ${tableName}`,
        html: createInputsHtml(fieldsTable, selectedData), // Usamos fieldsTable para incluir los multi-selects
        focusConfirm: false,
        preConfirm: () => getFormValues(fieldsTable),
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

      if (formValues && fieldsTable.every((field) => formValues[field.name])) {
        editItem(apiUrlTable, selectedData.id, formValues); // Usamos apiUrlTable para actualizar
        fetchData(apiUrl); // Actualizamos los datos

        await Swal.fire(
            `${tableName} actualizado`,
            `${tableName} ha sido actualizado correctamente`,
            "success"
        );
      } else {
        await Swal.fire("Error", "Por favor, completa todos los campos", "error");
      }
    } else {
      await Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };


  const handleDeleteRow = async () => {
    if (selectedIndex !== null) {
      const selectedData = data[selectedIndex];
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
          await deleteItem(apiUrlTable, selectedData.id);
          await fetchData(apiUrlTable);
          setSelectedIndex(null);
          await Swal.fire("Eliminado", "La fila ha sido eliminada.", "success");
        }
      });
    } else {
      await Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };

  const handleRowClick = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  const updateStock = async () => {
    if (selectedIndex !== null) {
      const selectedData = data[selectedIndex];

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
        if (isLiquidosTable) {
          await updateColumn(apiUrl, selectedData.id, "volumen", parseFloat(formValues.volumen));
        } else {
          await updateColumn(apiUrl, selectedData.id, "stock", parseFloat(formValues.stock));
        }
        await fetchData(apiUrl);

        await Swal.fire(
            `${isLiquidosTable ? 'Volumen' : 'Stock'} actualizado`,
            `El ${isLiquidosTable ? 'volumen' : 'stock'} ha sido actualizado correctamente`,
            "success"
        );
      } else {
        await Swal.fire("Error", "Por favor, completa el campo correctamente", "error");
      }
    } else {
      await Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };

  return {
    data,
    selectedIndex,
    isLoading,
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
    handleRowClick,
    updateStock,
  };
}
