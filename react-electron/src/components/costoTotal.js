import {useEffect, useState} from "react";
import {
    EnvasesConfig,
    etiquetasConfig,
    LiquidosConfig,
    MiscelaneaConfig,
    PackagingConfig,
    productosConfig
} from "./tables/TableConfigs"; // Asegúrate de importar tu hook correctamente

const useCostoTotal = () => {
    const liquidosConfig = LiquidosConfig();
    const packagingConfig = PackagingConfig();
    const miscelaneaConfig = MiscelaneaConfig();
    const envasesConfig = EnvasesConfig();

    const getCostoTotal = async (apiUrl) => {
        try {
            const response = await fetch("http://localhost:8000" + apiUrl);
            const data = await response.json();
            return data.reduce((acc, curr) => {
                const precio = parseFloat(curr.precio) || 0;
                const cantidad = apiUrl === liquidosConfig.apiUrl
                    ? (parseFloat(curr.volumen) || 0) / 1000 // Convertir mililitros a litros
                    : parseFloat(curr.stock) || 0;
                return acc + (precio * cantidad);
            }, 0);
        } catch (error) {
            console.error('Error fetching data:', error);
            return 0;
        }
    };

    const [costoTotal, setCostoTotal] = useState(0);

    useEffect(() => {
        const fetchCostoTotal = async () => {
            const costoTotalProducto = await getCostoTotal(productosConfig.apiUrlTable);
            const costoTotalPackaging = await getCostoTotal(packagingConfig.apiUrl);
            const costoTotalLiquido = await getCostoTotal(liquidosConfig.apiUrl);
            const costoTotalMiscelanea = await getCostoTotal(miscelaneaConfig.apiUrl);
            const costoTotalEtiquetas = await getCostoTotal(etiquetasConfig.apiUrl);
            const costoTotalEnvases = await getCostoTotal(envasesConfig.apiUrl);

            setCostoTotal(costoTotalProducto + costoTotalPackaging + costoTotalLiquido + costoTotalMiscelanea + costoTotalEtiquetas + costoTotalEnvases);
        };

        fetchCostoTotal();
    }, []); // Dependencias vacías para ejecutar solo al montar el componente

    return costoTotal.toFixed(2);
};

export default useCostoTotal;
