import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function useTableData({ fields, tableName }) {
  const [datos, setDatos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulando una llamada a la API para obtener datos iniciales
    setTimeout(() => {
      setDatos([
        // Datos de ejemplo
        {
          Nombre: "Producto 1",
          SKU: "123",
          Tipo: "Base",
          Volumen: "100ml",
          Precio: "10",
          Vencimiento: "2024-01-01",
          Stock: 100,
        },
        {
          Nombre: "Producto 2",
          SKU: "456",
          Tipo: "Aromatizante",
          Volumen: "200ml",
          Precio: "20",
          Vencimiento: "2024-06-01",
          Stock: 200,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [tableName]);

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
    }
    else {
      Swal.fire("Error", "No hay fila seleccionada", "error");
    }
  };

  const handleRowClick = (index) => {
    setSelectedIndex(index);
  };

  const updateStock = (index, change) => {
    setDatos((prevDatos) =>
      prevDatos.map((fila, i) =>
        i === index
          ? { ...fila, Stock: (fila.Stock || 0) + change }
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
    updateStock, // Return the updateStock function
  };
}
