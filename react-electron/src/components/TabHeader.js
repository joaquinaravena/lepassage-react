import React from "react";
import { TabList, Tab } from "react-tabs";
import SearchBar from "./SearchBar";
import "./styles/styleBar.css";

export default function TabHeader() {
  return (
    <div className="flex items-center justify-between relative bg-tab-bar">
      <div className="flex-grow overflow-x-auto">
        <TabList className="flex justify-center sm:justify-start mb-4 space-x-4 whitespace-nowrap">
          <Tab>Insumos</Tab>
          <Tab>Liquidos</Tab>
          <Tab>Envases</Tab>
          <Tab>Miscelaneos</Tab>
          <Tab>Paquetes</Tab>
          <Tab>Etiquetas</Tab>
          <Tab>Productos</Tab>
        </TabList>
      </div>
      <div className="flex-shrink-0 ml-4">
        <SearchBar />
      </div>
    </div>
  );
}
