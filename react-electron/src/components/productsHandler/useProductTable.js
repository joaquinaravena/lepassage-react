import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { GenericContext } from "../contexts/GenericContext";
import '../styles/styleSelect.css';

export default function useProductTable({ tableName, apiUrl, fieldsTable, apiUrlView }) {
  const { deleteItem, fetchData, addItem, editItem, updateProduct, data, isLoading } = useContext(GenericContext);
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

  const loadAllOptions = async () => {
    const fieldsWithOptions = fieldsTable.filter((field) => field.type === "multi-select" || field.name === "id_liquido");

    for (const field of fieldsWithOptions) {
      if (field.name === "id_liquido") {
        await loadOptions(field.optionsUrl, field.name); // Filtramos solo fragancias
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
          return loadOptions(field.optionsUrl, field.name);
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

  const handleOtherFields = (field, index, selectedData) => {
    if (field.name === "id_liquido") {
      return `
          <div style="flex: 1; min-width: 220px;">
            <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
            <select id="swal-input${index}" class="swal2-input" style="width: 80%;">
              ${options[field.name]?.map(option => {
      const selectedValue = selectedData ? selectedData[field.name] : null;
      return `
                  <option value="${option.value}" ${selectedValue === option.value ? 'selected' : ''}>
                    ${option.label}
                  </option>
                `;
    }).join('')}
            </select>
          </div>`;
    } else {
      const value = selectedData ? (selectedData[field.name] !== undefined ? selectedData[field.name] : "") : "";
      return `
  <div style="flex: 1; min-width: 220px;">
    <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
    <input id="swal-input${index}" class="swal2-input" style="width: 80%;" value="${value}" />
  </div>`;
    }
  };


  const createSelectHtml = (fieldName, index, selectedData = {}, selectIndex = 0) => {
    const selectedValues = selectedData && Array.isArray(selectedData[fieldName])
        ? selectedData[fieldName].map(item => item.id) : [];

    const selectedValue = selectedValues.length > 0 ? selectedValues[selectIndex] : "";

    return `
<div class="select-container" style="display: flex; align-items: center; justify-content: center; position: relative;">
  <select class="swal2-input" style="width: 80%;" name="${fieldName}-${index}-${selectIndex}">
    ${options[fieldName]?.map(option => `
      <option value="${option.value}" ${selectedValue === option.value ? 'selected' : ''}>
        ${option.label}
      </option>`).join('')}
  </select>
  ${fieldName !== 'id_liquido' ? `
  <button type="button" class="btn-remove" data-field="${fieldName}" data-index="${index}" data-select-index="${selectIndex}" style="position: absolute; right: 0; font-size: 15px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7z"/>
      <path fill-rule="evenodd" d="M4.5 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1H4.5V1zM11 3V2H5v1h6zm1 10V5h1v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5h1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z"/>
    </svg>
  </button>
  ` : ''}
</div>
`;
  };

  const createInputsHtml = (fields, selectedData) => {
    return `<div style="display: flex; flex-wrap: wrap; gap: 15px;">${fields
        .map((field, index) => {
          if (field.type === "multi-select") {
            const selectedItems = selectedData ? selectedData[field.name] || [] : [];
            return `
  <div style="flex: 1; min-width: 220px;">
    <div style="display: flex; align-items: center; position: relative;">
      <label for="swal-input${index}" style="flex: 1; text-align: center;">${field.placeholder}</label>
      <button type="button" id="add-select-btn${index}" class="btn-add" style="position: absolute; right: 0; font-size: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
          <path d="M8 3a.5.5 0 0 1 .5.5V7h3.5a.5.5 0 0 1 0 1H8.5v3.5a.5.5 0 0 1-1 0V8H4a.5.5 0 0 1 0-1h3.5V3.5A.5.5 0 0 1 8 3z"/>
        </svg>
      </button>
    </div>
    <div id="multi-select-container${index}">
      <div id="select-wrapper${index}">
        ${selectedItems.length > 0
                ? selectedItems.map((item, selectIndex) => createSelectHtml(field.name, index, { [field.name]: selectedItems }, selectIndex)).join('')
                : createSelectHtml(field.name, index, {}, 0)}
      </div>
    </div>
  </div>`;
          } else {
            return handleOtherFields(field, index, selectedData);
          }
        }).join("")}</div>`;
  };


  useEffect(() => {
    const handleAddSelectClick = (fieldName, index) => {
      const selectWrapper = document.getElementById(`select-wrapper${index}`);
      const currentSelectCount = selectWrapper.querySelectorAll('.select-container').length;
      selectWrapper.insertAdjacentHTML('beforeend', createSelectHtml(fieldName, index, {}, currentSelectCount));
      addRemoveEventListener(fieldName, index, currentSelectCount); // Añadir el event listener de remover al nuevo select
    };

    const handleRemoveSelectClick = (fieldName, index, selectIndex) => {
      const selectWrapper = document.getElementById(`select-wrapper${index}`);
      const selectContainer = document.querySelector(`[name="${fieldName}-${index}-${selectIndex}"]`).closest('.select-container');
      selectWrapper.removeChild(selectContainer);
    };

    const addRemoveEventListener = (fieldName, index, selectIndex) => {
      const removeButton = document.querySelector(`[name="${fieldName}-${index}-${selectIndex}"]`).closest('.select-container').querySelector('.btn-remove');
      if (removeButton) {
        removeButton.addEventListener('click', () => handleRemoveSelectClick(fieldName, index, selectIndex));
      }
    };

    fieldsTable.forEach((field, index) => {
      if (field.type === "multi-select") {
        const addButton = document.getElementById(`add-select-btn${index}`);
        if (addButton) {
          const boundClickHandler = handleAddSelectClick.bind(null, field.name, index);
          addButton.addEventListener('click', boundClickHandler);
          addButton.dataset.clickHandler = boundClickHandler;
        }

        const selectContainers = document.querySelectorAll(`#select-wrapper${index} .select-container`);
        selectContainers.forEach((container, selectIndex) => {
          addRemoveEventListener(field.name, index, selectIndex);
        });
      }
    });

    return () => {
      fieldsTable.forEach((field, index) => {
        if (field.type === "multi-select") {
          const addButton = document.getElementById(`add-select-btn${index}`);
          if (addButton && addButton.dataset.clickHandler) {
            addButton.removeEventListener('click', addButton.dataset.clickHandler);
          }

          const selectContainers = document.querySelectorAll(`#select-wrapper${index} .select-container`);
          selectContainers.forEach((container, selectIndex) => {
            const removeButton = container.querySelector('.btn-remove');
            if (removeButton) {
              removeButton.removeEventListener('click', () => handleRemoveSelectClick(field.name, index, selectIndex));
            }
          });
        }
      });
    };
  }, [fieldsTable, options]);

  const getFormValues = (fields) => {
    return fields.reduce((acc, field, index) => {
      const inputId = `swal-input${index}`;
      const inputElement = document.getElementById(inputId);

      if (field.type === "multi-select") {
        // Captura todos los selects con el mismo nombre para manejar los duplicados
        const selects = document.querySelectorAll(`[name^="${field.name}-${index}"]`);
        acc[field.name] = Array.from(selects).map(select => select.value).filter(value => value); // Evita valores vacíos
      } else if (field.type === "select" && field.name === "id_liquido") {
        acc[field.name] = inputElement ? inputElement.value : null;
      } else {
        acc[field.name] = inputElement ? inputElement.value : null;
      }
      return acc;
    }, {});
  };

  const handleAddRow = async () => {
    await loadAllOptions(); // Cargamos las opciones antes de abrir el formulario

    const { value: formValues } = await Swal.fire({
      title: `Agregar en ${tableName}`,
      html: createInputsHtml(fieldsTable), // Genera los inputs basados en fieldsTable
      focusConfirm: false,
      preConfirm: () => {
        const values = getFormValues(fieldsTable); // Obtener valores de los inputs
        const errorMessage = validateFormValues(values, fieldsTable); // Validar los valores obtenidos

        if (errorMessage) {
          Swal.showValidationMessage(errorMessage); // Mostrar mensaje de validación
          return false; // Detener confirmación si hay errores
        }
        return values;
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

    if (formValues) {
      try {
        const transformedValues = {
          ...formValues,
          miscelaneas_ids: formValues.miscelaneas,
          envases_ids: formValues.envases,
          paquetes_ids: formValues.paquetes,
        };

        delete transformedValues.miscelaneas;
        delete transformedValues.envases;
        delete transformedValues.paquetes;

        await addItem(apiUrl, transformedValues);
        await fetchData(apiUrlView);
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
    }
  };

  const handleEditRow = async () => {
    if (selectedIndex !== null) {
      const selectedData = data[selectedIndex];
      await loadAllOptions();

      const { value: formValues } = await Swal.fire({
        title: `Editar ${tableName}`,
        html: createInputsHtml(fieldsTable, selectedData),
        focusConfirm: false,
        preConfirm: () => {
          const values = getFormValues(fieldsTable); // Obtener valores de los inputs
          const errorMessage = validateFormValues(values, fieldsTable); // Validar los valores obtenidos

          if (errorMessage) {
            Swal.showValidationMessage(errorMessage); // Mostrar mensaje de validación
            return false; // Detener confirmación si hay errores
          }
          return values;
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

      if (formValues) {
        try {
          const transformedValues = {
            ...formValues,
            miscelaneas_ids: formValues.miscelaneas,
            envases_ids: formValues.envases,
            paquetes_ids: formValues.paquetes,
          };

          delete transformedValues.miscelaneas;
          delete transformedValues.envases;
          delete transformedValues.paquetes;

          await editItem(apiUrl, selectedData.id, transformedValues);
          await fetchData(apiUrlView);
          await fetchData(apiUrl);

          await Swal.fire(
              `${tableName} actualizado`,
              `${tableName} ha sido actualizado correctamente`,
              "success"
          );
        } catch (error) {
          console.error("Error updating row:", error);
          await Swal.fire("Error", "No se pudo actualizar la fila", "error");
        }
      }
    } else {
      await Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };

  const validateFormValues = (values, fields) => {
    const requiredFields = ["nombre", "sku"]; // Campos obligatorios
    const numericFields = ["stock", "precio"]; // Campos numéricos

    for (const field of fields) {
      const { name, placeholder } = field; // Extraer el nombre y el placeholder
      const fieldValue = values[name]; // Trim para evitar espacios vacíos

      // Validar campos obligatorios
      if (requiredFields.includes(name) && (!fieldValue || fieldValue.length === 0)) {
        return `El campo "${placeholder}" es obligatorio.`; // Utilizar placeholder en el mensaje de error
      }

      // Validar campos numéricos
      if (numericFields.includes(name) && (isNaN(fieldValue) || fieldValue === "")) {
        return `El campo "${placeholder}" debe ser un número.`; // Utilizar placeholder en el mensaje de error
      }
    }
    return null; // No hay errores
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
          await deleteItem(apiUrl, selectedData.id);
          await fetchData(apiUrlView);
          await fetchData(apiUrl);
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
          input: 'custom-swal-input',
        },
      });

      if (incrementValue) {
        const newValue = (selectedData.stock || 0) + parseInt(incrementValue, 10);

        // Crear el objeto actualizado con todos los valores
        const updatedProduct = {
          ...selectedData,
          stock: newValue,
          miscelaneas_ids: selectedData.miscelaneas.map(m => m.id), // Renombramos y formateamos los campos
          envases_ids: selectedData.envases.map(e => e.id),
          paquetes_ids: selectedData.paquetes.map(p => p.id),
        };

        try {
          await updateProduct(apiUrl, selectedData.id, updatedProduct);
          await fetchData(apiUrlView);
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

      const { value: decrementValue } = await Swal.fire({
        title: `Egresar Stock`,
        input: 'number',
        inputLabel: `Ingrese la cantidad para reducir el stock`,
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
          input: 'custom-swal-input',
        },
      });

      if (decrementValue) {
        const newValue = Math.max((selectedData.stock || 0) - parseInt(decrementValue, 10), 0);

        // Crear el objeto actualizado con todos los valores
        const updatedProduct = {
          ...selectedData,
          stock: newValue,
          miscelaneas_ids: selectedData.miscelaneas.map(m => m.id), // Renombramos y formateamos los campos
          envases_ids: selectedData.envases.map(e => e.id),
          paquetes_ids: selectedData.paquetes.map(p => p.id),
        };

        try {
          await updateProduct(apiUrl, selectedData.id, updatedProduct);
          await fetchData(apiUrlView);
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
