import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { GenericContext} from "../contexts/GenericContext";
import { ProductosContext} from "../contexts/ProductosContext";

export default function useDataTable({ fields, tableName, apiUrl}) {
  const { deleteItem, fetchData, addItem, editItem, updateColumn, data, isLoading} = useContext(GenericContext);
  const { deleteItemProducto, addItemProducto, dataProducto, editItemProducto, fetchDataProducto } = useContext(ProductosContext);
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
          } else {
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
      try {
        await addItem(apiUrl, formValues);
        await fetchData(apiUrl);

        await Swal.fire(
            `${tableName} agregado`,
            `${tableName} ha sido agregado correctamente`,
            "success"
        );
      } catch (error) {
        console.error('Error adding row:', error);
        await Swal.fire("Error", "No se pudo agregar la fila", "error");
      }
    } else {
      await Swal.fire("Error", "Por favor, completa todos los campos", "error");
    }
  };

  const handleEditRow = async () => {
    if (selectedIndex !== null) {
      const selectedData = data[selectedIndex];

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
        fetchData(apiUrl);

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
