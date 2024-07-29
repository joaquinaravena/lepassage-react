import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import InsumosTable from "./tables/InsumosTable";
import LiquidosTable from "./tables/LiquidosTable";
import EnvasesTable from "./tables/EnvasesTable";
import MiscelaneosTable from "./tables/MiscelaneosTable";
import PaquetesTable from "./tables/PaquetesTable";
import EtiquetasTable from "./tables/EtiquetasTable";
import ProductosTable from "./tables/ProductosTable";
import SearchBar from "./SearchBar";
import "./styles/styleBar.css"

export default function MainPanel({ className }) {
    return (
        <div className={"w-full h-screen overflow-hidden " + className}>
            <Tabs className="h-full flex flex-col "
                  selectedTabPanelClassName="react-tabs__tab-panel--selected grow overflow-auto"
                  selectedTabClassName="bg-selected-tab rounded-t-xl rounded-tr-xl">
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

                <TabPanel className="overflow-y-auto bg-panel-background">
                    <InsumosTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto bg-panel-background">
                    <LiquidosTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto bg-panel-background">
                    <EnvasesTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto bg-panel-background">
                    <MiscelaneosTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto bg-panel-background">
                    <PaquetesTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto bg-panel-background">
                    <EtiquetasTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto bg-panel-background">
                    <ProductosTable className="h-full" />
                </TabPanel>
            </Tabs>
        </div>
    );
}
