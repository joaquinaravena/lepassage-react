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
          if (field.name === "id_liquido") {
            // Campo select simple
            return `
          <div style="flex: 1; min-width: 220px;">
            <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
            <select id="swal-input${index}" class="swal2-input" style="width: 100%;">
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
          } else if (field.type === "multi-select") {
            return `
              <div style="flex: 1; min-width: 220px;">
                <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
                <select id="swal-input${index}" class="swal2-input" style="width: 100%;" multiple>
                  ${options[field.name]?.map(option => {
                          const selectedValues = selectedData && Array.isArray(selectedData[field.name]) ? selectedData[field.name].map(item => item.id) : [];
                          return `
                      <option value="${option.value}" ${selectedValues.includes(option.value) ? 'selected' : ''}>
                        ${option.label}
                      </option>
                    `;
                        }).join('')}
                </select>
              </div>`;
          }
          else {
            // Campo de texto
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
      } else if (field.name === "id_liquido") {
        acc[field.name] = parseInt(element.value, 10);
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
        // Transformamos los campos antes de enviarlos al backend
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

        console.log("Datos resultantes:", data);

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
        html: createInputsHtml(fieldsTable, selectedData),
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
          // Transformamos los campos antes de enviarlos al backend
          const transformedValues = {
            ...formValues,
            miscelaneas_ids: formValues.miscelaneas, // Renombramos los campos
            envases_ids: formValues.envases,
            paquetes_ids: formValues.paquetes,
          };

          delete transformedValues.miscelaneas; // Eliminamos los campos originales para evitar conflictos
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
