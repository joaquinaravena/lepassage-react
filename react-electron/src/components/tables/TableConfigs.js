import { useState, useEffect } from "react";

const useFetchChoices = (endpoint, choicesKey) => {
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000" + endpoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Obtener el key de choices del objeto de datos
          const choicesData = data[choicesKey];
          if (choicesData) {
            // Transformar el formato de datos
            const transformedChoices = choicesData.map(([value, label]) => ({
              value,
              label
            }));
            setChoices(transformedChoices);
          } else {
            console.warn(`No choices found for key: ${choicesKey}`);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching choices:', error);
          setIsLoading(false);
        });
  }, [endpoint, choicesKey]);

  return { choices, isLoading };
};




export const LiquidosConfig = () => {
  const { choices: tipo_liquido_choices } = useFetchChoices(
      "/api/tipo_liquido_choices/",
        "tipo_liquido_choices"
  );

  const fields = [
    { name: "nombre", placeholder: "Nombre del Líquido" },
    { name: "sku", placeholder: "SKU" },
    { name: "tipo", placeholder: "Tipo de Líquido", options: tipo_liquido_choices },
    { name: "volumen", placeholder: "Volumen (L)" },
    { name: "precio", placeholder: "Precio por Litro" },
    { name: "vencimiento", placeholder: "Vencimiento", type: "date" },
  ];

  const apiUrl = "/api/liquidos/";

  return {
    fields,
    tableName: "Líquidos",
    apiUrl,
    choices: tipo_liquido_choices,
  };
};

export const etiquetasConfig = {
  fields: [
    { name: "nombre", placeholder: "Nombre de la Etiqueta" },
    { name: "sku", placeholder: "SKU" },
    { name: "volumen", placeholder: "Volumen" },
    { name: "stock", placeholder: "Stock" },
    { name: "precio", placeholder: "Precio" },
  ],
  tableName: "Etiquetas",
  apiUrl: "/api/etiquetas/",
};

export const insumosConfig = {
  fields: [
    { name: "nombre", placeholder: "Nombre de Insumo" },
    { name: "sku", placeholder: "SKU" },
    { name: "tipo", placeholder: "Tipo de Insumo" },
    { name: "stock", placeholder: "Stock" },
    { name: "volumen", placeholder: "Volumen"},
    { name: "precio", placeholder: "Precio" },
  ],
  tableName: "Insumos",
  apiUrl: "/api/insumos/",
};

export const MiscelaneaConfig = () => {
  const { choices: tipo_objeto_choices } = useFetchChoices(
      "/api/tipo_objeto_choices/",
        "tipo_objeto_choices"
  );

  const fields = [
    { name: "nombre", placeholder: "Nombre del Producto" },
    { name: "sku", placeholder: "SKU" },
    { name: "tipo", placeholder: "Tipo de Objeto", options: tipo_objeto_choices },
    { name: "stock", placeholder: "Stock" },
    { name: "precio", placeholder: "Precio" },
  ];

  const apiUrl = "/api/miscelaneas/";

  return {
    fields,
    tableName: "Miscelaneos",
    apiUrl,
    choices: tipo_objeto_choices,
  };
};

export const PackagingConfig = () => {
  const { choices: tipo_paquete_choices } = useFetchChoices(
      "/api/tipo_paquete_choices/",
        "tipo_paquete_choices"
  );

  const fields = [
    { name: "nombre", placeholder: "Nombre del Paquete" },
    { name: "sku", placeholder: "SKU" },
    { name: "tipo", placeholder: "Tipo de Paquete", options: tipo_paquete_choices },
    { name: "stock", placeholder: "Stock" },
    { name: "precio", placeholder: "Precio" },
  ];

  const apiUrl = "/api/paquetes/";

  return {
    fields,
    tableName: "Packaging",
    apiUrl,
    choices: tipo_paquete_choices,
  };
};

export const EnvasesConfig = () => {
  const { choices: tipo_envase_choices } = useFetchChoices(
      "/api/tipo_envase_choices/",
        "tipo_envase_choices"
  );

  const fields = [
    { name: "nombre", placeholder: "Nombre del Envase" },
    { name: "sku", placeholder: "SKU" },
    { name: "tipo", placeholder: "Tipo de Envase", options: tipo_envase_choices },
    { name: "volumen", placeholder: "Volumen" },
    { name: "stock", placeholder: "Stock" },
    { name: "precio", placeholder: "Precio" },
  ];

  const apiUrl = "/api/envases/";

  return {
    fields,
    tableName: "Envases",
    apiUrl,
    choices: tipo_envase_choices,
  };
};

export const productos_viewConfig = {
  fields: [
    { name: "nombre", placeholder: "Nombre del Producto" },
    { name: "sku", placeholder: "SKU" },
    { name: "fragancia", placeholder: "Fragancia" },
    { name: "volumen", placeholder: "Volumen" },
    { name: "stock", placeholder: "Stock" },
    { name: "precio", placeholder: "Precio" },
  ],
  tableName: "Catálogo",
  apiUrl: "/api/productos_view/",
};

export const productosConfig = {
  fieldsTable: [
    { name: "nombre", placeholder: "Nombre del Producto" },
    { name: "sku", placeholder: "SKU" },
    {
      name: "id_liquido",
      placeholder: "Fragancia",
      type: "select",
      optionsUrl: "/api/liquidos/",
      filterType: "Fragancia"
    },
    { name: "stock", placeholder: "Stock" },
    { name: "precio", placeholder: "Precio" },
    {
      name: "miscelaneas",
      placeholder: "Miscelaneas",
      type: "multi-select", // Tipo multi-select
      optionsUrl: "/api/miscelaneas/", // URL para obtener las opciones
    },
    {
      name: "envases",
      placeholder: "Envases",
      type: "multi-select", // Tipo multi-select
      optionsUrl: "/api/envases/", // URL para obtener las opciones
    },
    {
      name: "paquetes",
      placeholder: "Packaging",
      type: "multi-select", // Tipo multi-select
      optionsUrl: "/api/paquetes/", // URL para obtener las opciones
    },
  ],
  tableName: "Productos",
  apiUrlTable: "/api/productos/",
};





