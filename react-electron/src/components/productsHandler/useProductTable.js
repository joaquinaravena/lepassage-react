import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { GenericContext } from "../contexts/GenericContext";
import '../styles/styleSelect.css';

export default function useProductTable({ tableName, apiUrl, fieldsTable, apiUrlTable }) {
  const { deleteItem, fetchData, addItem, editItem, updateColumn, data, isLoading } = useContext(GenericContext);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Estado para las opciones de misceláneas, envases, paquetes y líquidos filtrados
  const [options, setOptions] = useState({
    miscelaneas: [],
    envases: [],
    paquetes: [],
    liquidos: [], // Guardamos las opciones filtradas de líquidos
  });

  const loadOptions = async (url, fieldName) => {
    try {
      const response = await fetch("http://localhost:8000" + url);
      const result = await response.json();
      const filteredOptions = result.filter((item) => item.tipo === "Fragancia");
      if (fieldName === "id_liquido") {
        setOptions((prevOptions) => ({
          ...prevOptions,
          [fieldName]: filteredOptions.map((item) => ({
            value: item.id,
            label: item.nombre,
          })),
        }));
      }else{
        setOptions((prevOptions) => ({
          ...prevOptions,
          [fieldName]: result.map((item) => ({ value: item.id, label: item.nombre })), // Ajusta según tus datos
        }));
      }
    } catch (error) {
      console.error("Error al cargar opciones:", error);
    }
  };


  // Efecto para cargar las opciones de multi-select y líquidos filtrados cuando se abra el formulario
  const loadAllOptions = async () => {
    const fieldsWithOptions = fieldsTable.filter((field) => field.type === "multi-select" || field.name === "id_liquido");

    for (const field of fieldsWithOptions) {
      if (field.name === "id_liquido") {
        await loadOptions(field.optionsUrl, field.name, "fragancia"); // Filtramos solo fragancias
      } else {
        await loadOptions(field.optionsUrl, field.name);
      }
    }
  };

  useEffect(() => {
    const loadAllOptions = async () => {
      const fieldsWithOptions = fieldsTable.filter((field) => field.type === "multi-select" || field.name === "id_liquido");

      await Promise.all(fieldsWithOptions.map(field => {
        if (field.name === "id_liquido") {
          return loadOptions(field.optionsUrl, field.name, "fragancia");
        } else {
          return loadOptions(field.optionsUrl, field.name);
        }
      }));
    };
    loadAllOptions();
  }, [fieldsTable]);

  useEffect(() => {
    fetchData(apiUrl);
  }, [apiUrl]);

  const createInputsHtml = (fields, selectedData) => {
    return `<div style="display: flex; flex-wrap: wrap; gap: 15px;">${fields
        .map((field, index) => {
          if (field.type === "multi-select" || field.name === "id_liquido") {
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
      if (field.type === "multi-select" || field.name === "id_liquido") {
        acc[field.name] = Array.from(element.selectedOptions).map(option => option.value);
      } else {
        acc[field.name] = element.value;
      }
      return acc;
    }, {});
  };

  const handleAddRow = async () => {
    await loadAllOptions(); // Cargamos las opciones antes de abrir el formulario

    const { value: formValues } = await Swal.fire({
      title: `Agregar en ${tableName}`,
      html: createInputsHtml(fieldsTable), // Usamos fieldsTable para incluir los multi-selects y el select filtrado
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
        await fetchData(apiUrlTable);

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
        html: createInputsHtml(fieldsTable, selectedData), // Usamos fieldsTable para incluir los multi-selects y el select filtrado
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
        await fetchData(apiUrl);
        await fetchData(apiUrlTable);

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
          await fetchData(apiUrl);
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

  const increaseStock = async () => {
    if (selectedIndex !== null) {
      const selectedData = data[selectedIndex];
      const columnName = "stock";

      const { value: incrementValue } = await Swal.fire({
        title: `Ingresar Stock`,
        input: 'number',
        inputLabel: `Ingrese la cantidad para aumentar el stock`,
        inputPlaceholder: 0,
        inputAttributes: {
          min: 1,
          step: 1,
        },
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return 'Por favor, ingrese un valor válido mayor que 0';
          }
        },
        customClass: {
          input: 'custom-swal-input', // Aplica la clase personalizada al input
        },
      });

      if (incrementValue) {
        const currentValue = selectedData[columnName] || 0;
        const newValue = currentValue + parseInt(incrementValue, 10);

        try {
          await updateColumn(apiUrl, selectedData.id, columnName, newValue);
          await fetchData(apiUrl);

          await Swal.fire(
              `Stock aumentado`,
              `El stock ha sido incrementado correctamente en ${incrementValue} unidades`,
              "success"
          );
        } catch (error) {
          console.error(`Error incrementando el stock:`, error);
          await Swal.fire("Error", `No se pudo incrementar el stock`, "error");
        }
      }
    } else {
      await Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };

  const decreaseStock = async () => {
    if (selectedIndex !== null) {
      const selectedData = data[selectedIndex];
      const columnName = "stock";

      const { value: decrementValue } = await Swal.fire({
        title: `Egresar Stock`,
        input: 'number',
        inputLabel: `Ingrese la cantidad para reducir el stock`,
        inputPlaceholder: 0,
        inputAttributes: {
          min: 1,
          step: 1,
        },
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return 'Por favor, ingrese un valor válido mayor que 0';
          }
        },
        customClass: {
          input: 'custom-swal-input', // Aplica la clase personalizada al input
        },
      });

      if (decrementValue) {
        const currentValue = selectedData[columnName] || 0;
        const newValue = Math.max(currentValue - parseInt(decrementValue, 10), 0); // Evita valores negativos

        try {
          await updateColumn(apiUrl, selectedData.id, columnName, newValue);
          await fetchData(apiUrl);

          await Swal.fire(
              `Stock reducido`,
              `El stock ha sido reducido correctamente en ${decrementValue} unidades`,
              "success"
          );
        } catch (error) {
          console.error(`Error reduciendo el stock:`, error);
          await Swal.fire("Error", `No se pudo reducir el stock`, "error");
        }
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
    increaseStock,
    decreaseStock,
  };
}
