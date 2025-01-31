import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { GenericContext} from "../contexts/GenericContext";

export default function useDataTable({ fields, tableName, apiUrl}) {
  const { deleteItem, fetchData, addItem, editItem, updateColumn, data, isLoading} = useContext(GenericContext);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    fetchData(apiUrl);
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
                <option value="${option.value}" ${selectedData && selectedData[field.name] === option.value ? 'selected' : ''}>
                  ${option.label}
                </option>
              `).join('')}
            </select>
          </div>`;
          } else if (field.type === "date") {
            // Renderizar input tipo date
            const value = selectedData ? (selectedData[field.name] !== undefined ? selectedData[field.name] : "") : "";
            return `
          <div style="flex: 1; min-width: 220px;">
            <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
            <input id="swal-input${index}" class="swal2-input" type="date" style="width: 80%;" value="${value}" />
          </div>`;
          } else {
            // Renderizar input normal
            const value = selectedData ? (selectedData[field.name] !== undefined ? selectedData[field.name] : "") : "";
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
    const { value: formValues } = await Swal.fire({
      title: `Agregar en ${tableName}`,
      html: createInputsHtml(fields),
      focusConfirm: false,
      preConfirm: () => {
        const values = getFormValues(fields);
        const errorMessage = validateFormValues(values, fields); // Validar los valores obtenidos

        if (errorMessage) {
          Swal.showValidationMessage(errorMessage); // Mostrar mensaje de validación si hay errores
          return false;
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
          vencimiento: formValues.vencimiento ? formValues.vencimiento : null,
        };

        await addItem(apiUrl, transformedValues);
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

      const { value: formValues } = await Swal.fire({
        title: `Editar ${tableName}`,
        html: createInputsHtml(fields, selectedData),
        focusConfirm: false,
        preConfirm: () => {
          const values = getFormValues(fields);
          const errorMessage = validateFormValues(values, fields); // Validar los valores obtenidos

          if (errorMessage) {
            Swal.showValidationMessage(errorMessage); // Mostrar mensaje de validación si hay errores
            return false;
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
            vencimiento: formValues.vencimiento ? formValues.vencimiento : null,
          };

          await editItem(apiUrl, selectedData.id, transformedValues);
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
        await Swal.fire("Error", "No hay fila seleccionada", "error");
      }
    }
  };

  const validateFormValues = (values, fields) => {

    const requiredFields = ["nombre", "sku"]; // Campos obligatorios
    const numericFields = ["stock", "precio", "volumen"]; // Campos numéricos

    for (const field of fields) {
      const { name, placeholder } = field; // Extraer el nombre y el placeholder
      const fieldValue = values[name]?.trim(); // Trim para evitar espacios vacíos

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
      const isLiquidosTable = tableName === "Líquidos";
      const columnName = isLiquidosTable ? "volumen" : "stock";

      const { value: incrementValue } = await Swal.fire({
        title: `Ingresar ${isLiquidosTable ? 'Volumen' : 'Stock'}`,
        input: 'number',
        inputLabel: `Ingrese la cantidad para aumentar el ${isLiquidosTable ? 'volumen' : 'stock'}`,
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
        const currentValue = selectedData[columnName] || 0;
        const newValue = currentValue + parseInt(incrementValue, 10);

        try {
          await updateColumn(apiUrl, selectedData.id, columnName, newValue);
          await fetchData(apiUrl);

          await Swal.fire(
              `${isLiquidosTable ? 'Volumen' : 'Stock'} aumentado`,
              `El ${isLiquidosTable ? 'volumen' : 'stock'} ha sido incrementado correctamente en ${incrementValue} unidades`,
              "success"
          );
        } catch (error) {
          console.error(`Error incrementando el ${isLiquidosTable ? 'volumen' : 'stock'}:`, error);
          await Swal.fire("Error", `No se pudo incrementar el ${isLiquidosTable ? 'volumen' : 'stock'}`, "error");
        }
      }
    } else {
      await Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };

  const decreaseStock = async () => {
    if (selectedIndex !== null) {
      const selectedData = data[selectedIndex];
      const isLiquidosTable = tableName === "Líquidos";
      const columnName = isLiquidosTable ? "volumen" : "stock";

      const { value: decrementValue } = await Swal.fire({
        title: `Egresar ${isLiquidosTable ? 'Volumen' : 'Stock'}`,
        input: 'number',
        inputLabel: `Ingrese la cantidad para reducir el ${isLiquidosTable ? 'volumen' : 'stock'}`,
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
              `${isLiquidosTable ? 'Volumen' : 'Stock'} reducido`,
              `El ${isLiquidosTable ? 'volumen' : 'stock'} ha sido reducido correctamente en ${decrementValue} unidades`,
              "success"
          );
        } catch (error) {
          console.error(`Error reduciendo el ${isLiquidosTable ? 'volumen' : 'stock'}:`, error);
          await Swal.fire("Error", `No se pudo reducir el ${isLiquidosTable ? 'volumen' : 'stock'}`, "error");
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
