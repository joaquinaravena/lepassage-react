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
        <div className={"w-full text-black h-screen bg-[hsl(100,100,100)] overflow-hidden " + className}>
            <Tabs className="h-full flex flex-col"
                  selectedTabPanelClassName="react-tabs__tab-panel--selected grow overflow-auto"
                  selectedTabClassName="bg-gray-500 rounded-t-xl rounded-tr-xl">
                <div className="flex items-center justify-between relative">
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

                <TabPanel className="overflow-y-auto">
                    <InsumosTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto">
                    <LiquidosTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto">
                    <EnvasesTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto">
                    <MiscelaneosTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto">
                    <PaquetesTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto">
                    <EtiquetasTable className="h-full" />
                </TabPanel>
                <TabPanel className="overflow-y-auto">
                    <ProductosTable className="h-full" />
                </TabPanel>
            </Tabs>
        </div>
    );
}
