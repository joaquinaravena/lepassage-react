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

export default function MainPanel(className) {
    return (
        <div className={"w-full text-black h-screen bg-[hsl(100,100,100)] overflow-clip " + className}>
            <Tabs className="h-full overflow-clip flex flex-col"
                  selectedTabPanelClassName="react-tabs__tab-panel--selected grow overflow-clip"
                  selectedTabClassName="bg-gray-500 rounded-t-xl rounded-tr-xl">
                <div className="flex items-center justify-center relative">
                    <TabList className="flex justify-center mb-4 space-x-4">
                        <Tab>Insumos</Tab>
                        <Tab>Liquidos</Tab>
                        <Tab>Envases</Tab>
                        <Tab>Miscelaneos</Tab>
                        <Tab>Paquetes</Tab>
                        <Tab>Etiquetas</Tab>
                        <Tab>Productos</Tab>
                        <div className="absolute right-11 mt-2">
                            <SearchBar/>
                        </div>
                    </TabList>
                </div>

                <TabPanel className="overflow-clip">
                    <InsumosTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip">
                    <LiquidosTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip">
                    <EnvasesTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip">
                    <MiscelaneosTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip">
                    <PaquetesTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip">
                    <EtiquetasTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip">
                    <ProductosTable className="h-full"/>
                </TabPanel>
            </Tabs>
        </div>
    );
}
