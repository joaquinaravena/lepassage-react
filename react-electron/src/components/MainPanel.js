import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React from "react";
import "react-tabs/style/react-tabs.css";
import {
  insumosConfig,
  LiquidosConfig,
  EnvasesConfig,
  PackagingConfig,
  etiquetasConfig,
  MiscelaneaConfig,
  productosConfig,
} from "./tables/TableConfigs";
import GenericTable from "./tables/GenericTable";
import SearchBar from "./SearchBar";
import "./styles/styleBar.css";

const MainPanel = ({ className }) => {
  const liquidosConfig = LiquidosConfig();
  const packagingConfig = PackagingConfig();
  const miscelaneaConfig = MiscelaneaConfig();
  const envasesConfig = EnvasesConfig();

  return (
    <div className={"w-full h-screen overflow-hidden " + className}>
      <Tabs
        className="h-full flex flex-col "
        selectedTabPanelClassName="react-tabs__tab-panel--selected grow overflow-auto"
        selectedTabClassName="bg-selected-tab rounded-t-xl rounded-tr-xl"
      >
        <div className="flex items-center justify-between relative bg-tab-bar">
          <div className="flex-grow overflow-x-auto">
            <TabList className="flex justify-center sm:justify-start mb-4 space-x-4 whitespace-nowrap">
              <Tab>Insumos</Tab>
              <Tab>Liquidos</Tab>
              <Tab>Envases</Tab>
              <Tab>Miscelaneas</Tab>
              <Tab>Packaging</Tab>
              <Tab>Etiquetas</Tab>
              <Tab>Productos</Tab>
            </TabList>
          </div>
          <div className="flex-shrink-0 ml-4">
            <SearchBar />
          </div>
        </div>

        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={insumosConfig} />
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={liquidosConfig} />
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={envasesConfig} />
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={miscelaneaConfig} />
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={packagingConfig} />
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={etiquetasConfig} />
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={productosConfig} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MainPanel;
