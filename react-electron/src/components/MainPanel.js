import { Tabs, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  insumosConfig,
  liquidosConfig,
  envasesConfig,
  paquetesConfig,
  etiquetasConfig,
  miscelaneaConfig,
  productosConfig,
} from "./tables/TableConfigs";
import GenericTable from "./tables/GenericTable";
import "./styles/styleBar.css";
import TabHeader from "./TabHeader";

const tabConfigs = [
    { label: 'Insumos', config: insumosConfig },
    { label: 'Liquidos', config: liquidosConfig },
    { label: 'Envases', config: envasesConfig },
    { label: 'Miscelaneos', config: miscelaneaConfig },
    { label: 'Paquetes', config: paquetesConfig },
    { label: 'Etiquetas', config: etiquetasConfig },
    { label: 'Productos', config: productosConfig }
  ];

export default function MainPanel({ className }) {
  return (
    <div className={"w-full h-screen overflow-hidden " + className}>
      <Tabs
        className="h-full flex flex-col "
        selectedTabPanelClassName="react-tabs__tab-panel--selected grow overflow-auto"
        selectedTabClassName="bg-selected-tab rounded-t-xl rounded-tr-xl"
      >
        <TabHeader />
        {tabConfigs.map(({ label, config }) => (
          <TabPanel key={label} className="overflow-y-auto bg-panel-background">
            <GenericTable config={config} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
