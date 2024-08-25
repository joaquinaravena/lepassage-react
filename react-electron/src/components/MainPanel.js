import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, {useState} from "react";
import "react-tabs/style/react-tabs.css";
import {
  insumosConfig,
  LiquidosConfig,
  EnvasesConfig,
  PackagingConfig,
  etiquetasConfig,
  MiscelaneaConfig,
  productos_viewConfig, productosConfig,
} from "./tables/TableConfigs";
import GenericTable from "./tables/GenericTable";
import SearchBar from "./SearchBar";
import "./styles/styleBar.css";
import ProductTable from "./productsHandler/ProductTable";

const MainPanel = ({ className }) => {
  const liquidosConfig = LiquidosConfig();
  const packagingConfig = PackagingConfig();
  const miscelaneaConfig = MiscelaneaConfig();
  const envasesConfig = EnvasesConfig();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const [activeTab, setActiveTab] = useState('insumos'); // Inicialmente en 'insumos'

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className={"w-full h-screen overflow-hidden " + className}>
      <Tabs
          className="h-full flex flex-col "
          selectedTabPanelClassName="react-tabs__tab-panel--selected grow overflow-auto"
          selectedTabClassName={`bg-${activeTab}-table rounded-t-xl rounded-tr-xl`}
      >
        <div className={`flex items-center justify-between relative bg-${activeTab}-table`}>
          <div className="flex-grow overflow-x-auto">
            <TabList className="flex justify-center sm:justify-start mb-4 space-x-4 whitespace-nowrap">
              <Tab
                  className={`bg-insumos-table hover:bg-insumos-table py-2 px-4 rounded-t-lg select-none cursor-pointer`}
                  onClick={() => handleTabClick('insumos')}
              >
                Insumos
              </Tab>
              <Tab
                  className={`bg-liquido-table hover:bg-liquido-table py-2 px-4 rounded-t-lg select-none cursor-pointer`}
                  onClick={() => handleTabClick('liquido')}
              >
                Líquidos
              </Tab>
              <Tab
                  className={`bg-envase-table hover:bg-envase-table py-2 px-4 rounded-t-lg select-none cursor-pointer`}
                  onClick={() => handleTabClick('envase')}
              >
                Envases
              </Tab>
              <Tab
                  className={`bg-miscelanea-table hover:bg-miscelanea-table py-2 px-4 rounded-t-lg select-none cursor-pointer`}
                  onClick={() => handleTabClick('miscelanea')}
              >
                Misceláneas
              </Tab>
              <Tab
                  className={`bg-packaging-table hover:bg-packaging-table py-2 px-4 rounded-t-lg select-none cursor-pointer`}
                  onClick={() => handleTabClick('packaging')}
              >
                Packaging
              </Tab>
              <Tab
                  className={`bg-etiqueta-table hover:bg-etiqueta-table py-2 px-4 rounded-t-lg select-none cursor-pointer`}
                  onClick={() => handleTabClick('etiqueta')}
              >
                Etiquetas
              </Tab>
              <Tab
                  className={`bg-producto-table hover:bg-producto-table py-2 px-4 rounded-t-lg select-none cursor-pointer`}
                  onClick={() => handleTabClick('producto')}
              >
                Productos
              </Tab>
            </TabList>
          </div>
          <div className="flex-shrink-0 ml-4">
            <SearchBar onSearch={handleSearch}/>
          </div>
        </div>

        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={insumosConfig} searchQuery={searchQuery}/>
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={liquidosConfig} searchQuery={searchQuery}/>
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={envasesConfig} searchQuery={searchQuery}/>
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={miscelaneaConfig} searchQuery={searchQuery}/>
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={packagingConfig} searchQuery={searchQuery}/>
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <GenericTable config={etiquetasConfig} searchQuery={searchQuery}/>
        </TabPanel>
        <TabPanel className="overflow-y-auto bg-panel-background">
          <ProductTable viewConfig={productos_viewConfig} productConfig={productosConfig} searchQuery={searchQuery}/>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MainPanel;
