// tableConfigs.js
import { useState, useEffect } from "react";

const useFetchChoices = (endpoint) => {
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setChoices(data.choices || []);
        setIsLoading(false);
      });
  }, [endpoint]);

  return { choices, isLoading };
};

export const LiquidosConfig = () => {
  const { choices: tipo_liquido_choices, isLoading } = useFetchChoices("/api/tipo-liquido-choices/");

  const fields = [
    { name: "Nombre", placeholder: "Nombre del Líquido" },
    { name: "SKU", placeholder: "SKU" },
    {
      name: "Tipo",
      placeholder: "Tipo de Líquido",
      options: tipo_liquido_choices,
    },
    { name: "Volumen", placeholder: "Volumen" },
    { name: "Precio", placeholder: "Precio" },
    { name: "Vencimiento", placeholder: "Vencimiento", type: "date" },
  ];

  return {
    fields,
    tableName: "Líquidos",
  };
};

export const etiquetasConfig = {
  fields: [
    { name: "Nombre", placeholder: "Nombre de la Etiqueta" },
    { name: "SKU", placeholder: "SKU" },
    { name: "Volumen", placeholder: "Volumen" },
    { name: "Stock", placeholder: "Stock" },
    { name: "Precio", placeholder: "Precio" },
  ],
  tableName: "Etiquetas",
};

export const InsumosConfig = () => {
  const { choices: tipo_insumo_choices, isLoading } = useFetchChoices("/api/tipo-insumo-choices/");

  const fields = [
    { name: "Nombre", placeholder: "Nombre del Insumo" },
    { name: "SKU", placeholder: "SKU" },
    {
      name: "Tipo",
      placeholder: "Tipo de Insumo",
      options: tipo_insumo_choices,
    },
    { name: "Stock", placeholder: "Stock" },
    { name: "Precio", placeholder: "Precio" },
  ];

  return {
    fields,
    tableName: "Insumos",
  };
};

export const MiscelaneaConfig = () => {
  const { choices: tipo_objeto_choices, isLoading } = useFetchChoices("/api/tipo-objeto-choices/");

  const fields = [
    { name: "Nombre", placeholder: "Nombre del Producto" },
    { name: "SKU", placeholder: "SKU" },
    {
      name: "Tipo",
      placeholder: "Tipo de Objeto",
      options: tipo_objeto_choices,
    },
    { name: "Stock", placeholder: "Stock" },
    { name: "Precio", placeholder: "Precio" },
  ];

  return {
    fields,
    tableName: "Miscelaneos",
  };
};

export const PackagingConfig = () => {
  const { choices: tipo_paquete_choices, isLoading } = useFetchChoices("/api/tipo-paquete-choices/");

  const fields = [
    { name: "Nombre", placeholder: "Nombre del Paquete" },
    { name: "SKU", placeholder: "SKU" },
    {
      name: "Tipo",
      placeholder: "Tipo de Paquete",
      options: tipo_paquete_choices,
    },
    { name: "Stock", placeholder: "Stock" },
    { name: "Precio", placeholder: "Precio" },
  ];

  return {
    fields,
    tableName: "Paquetes",
  };
};

export const EnvasesConfig = () => {
  const { choices: tipo_envase_choices, isLoading } = useFetchChoices("/api/tipo-envase-choices/");

  const fields = [
    { name: "Nombre", placeholder: "Nombre del Envase" },
    { name: "SKU", placeholder: "SKU" },
    {
      name: "Tipo",
      placeholder: "Tipo de Envase",
      options: tipo_envase_choices,
    },
    { name: "Volumen", placeholder: "Volumen" },
    { name: "Stock", placeholder: "Stock" },
    { name: "Precio", placeholder: "Precio" },
  ];

  return {
    fields,
    tableName: "Envases",
  };
};

//TODO: ver si productos usa sku
export const productosConfig = {
  fields: [
    { name: "Nombre", placeholder: "Nombre del Producto" },
    { name: "Stock", placeholder: "Stock" },
    { name: "Precio", placeholder: "Precio" },
  ],
  tableName: "Productos",
};
