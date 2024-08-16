import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { GenericContext } from "../contexts/GenericContext"; // Asegúrate de importar el contexto correctamente

export default function useDataTable({ fields, tableName, apiUrl }) {
  const { deleteItem, fetchData, addItem, editItem, data } = useContext(GenericContext); // Obtén las funciones necesarias del contexto
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
    console.log("apiUrl", apiUrl);
    fetchDataLocal();
  }, [apiUrl, tableName]);

  const createInputsHtml = (fields, selectedData) => {
    return `<div style="display: flex; flex-wrap: wrap; gap: 15px;">${fields
        .map((field, index) => {
          const value = selectedData ? (selectedData[field.name] !== undefined ? selectedData[field.name] : "indefinido") : "";
          return `
        <div style="flex: 1; min-width: 220px;">
          <label for="swal-input${index}" style="display: block;">${field.placeholder}</label>
          <input id="swal-input${index}" class="swal2-input" style="width: 80%;" value="${value}" />
        </div>`;
        })
        .join("")}</div>`;
  };


  const getFormValues = (fields) => {
    return fields.reduce((acc, field, index) => {
      acc[field.name] = document.getElementById(`swal-input${index}`).value;
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
      // Hacer llamada a la API para agregar a la tabla según tableName/
        await addItem(apiUrl, formValues);
        console.log("apiUrl", apiUrl);
        console.log(data);
        console.log(datos);
      setDatos([...datos, formValues]);
      Swal.fire(
          `${tableName} agregado`,
          `${tableName} ha sido agregado correctamente`,
          "success"
      );
    } else {
      Swal.fire("Error", "Por favor, completa todos los campos", "error");
    }
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
        // Hacer llamada a la API para actualizar la tabla según tableName
        console.log("apiUrl", apiUrl);
        console.log("selectedData.id", selectedData.id);
        console.log("formValues", formValues);
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
          // Llamar a la función deleteItem del contexto
          await deleteItem(apiUrl, selectedData.id);
          // Actualizar los datos después de la eliminación
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
      // Si la misma fila es seleccionada, deseleccionarla
      setSelectedIndex(null);
    } else {
      // Selecciona la fila
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const tableContainer = document.querySelector(".table-container");
      if (tableContainer && !tableContainer.contains(event.target)) {
        setSelectedIndex(null); // Deseleccionar cuando se hace clic fuera de la tabla
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateStock = async () => {
    if (selectedIndex !== null) {
      const selectedData = datos[selectedIndex];

      // Verifica si la tabla es "Liquidos"
      const isLiquidosTable = tableName === "Líquidos";
      console.log("isLiquidosTable", isLiquidosTable);
      console.log("tableName", tableName);

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
          // Retorna solo el valor de "stock" o "volumen" según la tabla
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

      // Validación y actualización
      if (formValues && (isLiquidosTable ? formValues.volumen !== undefined : formValues.stock !== undefined)) {
        const updatedDatos = [...datos];

        // Actualiza solo el campo relevante
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
