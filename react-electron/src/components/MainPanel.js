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
            <div className="flex justify-center">
                <SearchBar className="w-1/2"/>
            </div>
            <Tabs className="h-full overflow-clip flex flex-col"
                  selectedTabPanelClassName="react-tabs__tab-panel--selected grow overflow-clip"
                  selectedTabClassName="bg-gray-500 rounded-t-xl rounded-tr-xl">
                <TabList className="flex justify-center mb-4 border">
                    <Tab>Insumos</Tab>
                    <Tab>Liquidos</Tab>
                    <Tab>Envases</Tab>
                    <Tab>Miscelaneos</Tab>
                    <Tab>Paquetes</Tab>
                    <Tab>Etiquetas</Tab>
                    <Tab>Productos</Tab>
                </TabList>

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
