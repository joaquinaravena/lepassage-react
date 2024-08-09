import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function useTableData({ fields, tableName, apiUrl }) {
  const [datos, setDatos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [apiUrl, tableName]);

  const createInputsHtml = (fields, selectedData) => {
    return fields
        .map((field, index) => {
          const value = selectedData ? (selectedData[field.name] !== undefined ? selectedData[field.name] : "indefinido") : "";
          return `<input id="swal-input${index}" class="swal2-input" placeholder="${field.placeholder}" value="${value}">`;
        })
        .join("");
  };

  const getFormValues = (fields) => {
    return fields.reduce((acc, field, index) => {
      acc[field.name] = document.getElementById(`swal-input${index}`).value;
      return acc;
    }, {});
  };

  const handleAddRow = async () => {
    const { value: formValues } = await Swal.fire({
      title: `Agregar ${tableName}`,
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
      //HACER LLAMADA A LA API PARA AGREGAR A LA TABLA SEGÚN TABLE NAME
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
        //HACER LLAMADA A LA API PARA ACTUALIZAR LA TABLA SEGÚN TABLE NAME
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

  const handleDeleteRow = () => {
    if (selectedIndex !== null) {
      Swal.fire({
        title: "Eliminar fila",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          //HACER LLAMADA A LA API PARA ELIMINAR DE LA TABLA SEGÚN TABLE NAME
          setDatos(datos.filter((_, i) => i !== selectedIndex));
          setSelectedIndex(null);
          Swal.fire("Eliminado", "La fila ha sido eliminada.", "success");
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

  const updateStock = (index, change) => {
    setDatos((prevDatos) =>
        prevDatos.map((fila, i) =>
            i === index
                ? { ...fila, stock: (fila.stock || 0) + change }
                : fila
        )
    );
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
