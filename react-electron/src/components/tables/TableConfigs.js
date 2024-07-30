// tableConfigs.js
import { useState, useEffect } from "react";

const useTipoLiquidoChoices = () => {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    fetch("/api/tipo-liquido-choices/")
      .then((response) => response.json())
      .then((data) => setChoices(data.tipo_liquido_choices));
  }, []);

  return choices;
};

const useTipoInsumoChoices = () => {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    fetch("/api/tipo-insumo-choices/")
      .then((response) => response.json())
      .then((data) => setChoices(data.tipo_insumo_choices));
  }, []);

  return choices;
};

const useTipoEnvaseChoices = () => {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    fetch("/api/tipo-envase-choices/")
      .then((response) => response.json())
      .then((data) => setChoices(data.tipo_envase_choices));
  }, []);

  return choices;
};

const useTipoObjetoChoices = () => {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    fetch("/api/tipo-objeto-choices/")
      .then((response) => response.json())
      .then((data) => setChoices(data.tipo_objeto_choices));
  }, []);

  return choices;
};

const useTipoPaqueteChoices = () => {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    fetch("/api/tipo-paquete-choices/")
      .then((response) => response.json())
      .then((data) => setChoices(data.tipo_paquete_choices));
  }, []);

  return choices;
};

export const LiquidosConfig = () => {
  const tipo_liquido_choices = useTipoLiquidoChoices();

  return {
    fields: [
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
    ],
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
  const tipo_insumo_choices = useTipoInsumoChoices();
  return {
    fields: [
      { name: "Nombre", placeholder: "Nombre del Insumo" },
      { name: "SKU", placeholder: "SKU" },
      {
        name: "Tipo",
        placeholder: "Tipo de Insumo",
        options: tipo_insumo_choices,
      },
      { name: "Stock", placeholder: "Stock" },
      { name: "Precio", placeholder: "Precio" },
    ],
    tableName: "Insumos",
  };
};

export const MiscelaneaConfig = () => {
  const tipo_objeto_choices = useTipoObjetoChoices();
  return {
    fields: [
      { name: "Nombre", placeholder: "Nombre del Producto" },
      { name: "SKU", placeholder: "SKU" },
      {
        name: "Tipo",
        placeholder: "Tipo de Objeto",
        options: tipo_objeto_choices,
      },
      { name: "Stock", placeholder: "Stock" },
      { name: "Precio", placeholder: "Precio" },
    ],
    tableName: "Miscelaneos",
  };
};

export const PaquetesConfig = () => {
  const tipo_paquete_choices = useTipoPaqueteChoices();
  return {
    fields: [
      { name: "Nombre", placeholder: "Nombre del Paquete" },
      { name: "SKU", placeholder: "SKU" },
      {
        name: "Tipo",
        placeholder: "Tipo de Paquete",
        options: tipo_paquete_choices,
      },
      { name: "Stock", placeholder: "Stock" },
      { name: "Precio", placeholder: "Precio" },
    ],
    tableName: "Paquetes",
  };
};

export const EnvasesConfig = () => {
  const tipo_envase_choices = useTipoEnvaseChoices();
  return {
    fields: [
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
    ],
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
