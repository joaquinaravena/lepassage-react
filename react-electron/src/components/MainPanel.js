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
        <div className={"w-full h-screen overflow-clip " + className}>
            <Tabs className="h-full overflow-clip flex flex-col "
                  selectedTabPanelClassName="react-tabs__tab-panel--selected grow overflow-clip"
                  selectedTabClassName="bg-selected-tab rounded-t-xl rounded-tr-xl">
                <div className="flex items-center justify-center relative bg-tab-bar">
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

                <TabPanel className="overflow-clip bg-panel-background">
                    <InsumosTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip bg-panel-background">
                    <LiquidosTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip bg-panel-background">
                    <EnvasesTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip bg-panel-background">
                    <MiscelaneosTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip bg-panel-background">
                    <PaquetesTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip bg-panel-background">
                    <EtiquetasTable className="h-full"/>
                </TabPanel>
                <TabPanel className="overflow-clip bg-panel-background">
                    <ProductosTable className="h-full"/>
                </TabPanel>
            </Tabs>
        </div>
    );
}
