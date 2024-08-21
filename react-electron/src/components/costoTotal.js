import { productosConfig, insumosConfig } from './tables/TableConfigs';

export const costoTotal = async () => {
    // Función para obtener datos y calcular el costo total de una tabla
    const getCostoTotal = async (apiUrl) => {
        try {
            const response = await fetch("http://localhost:8000" + apiUrl);
            const data = await response.json();
            return data.reduce((acc, curr) => {
                const precio = parseFloat(curr.precio) || 0;
                const cantidad = parseFloat(curr.stock) || 0;
                return acc + (precio * cantidad);
            }, 0);
        } catch (error) {
            console.error('Error fetching data:', error);
            return 0;
        }
    };

    const costoTotalProductos = await getCostoTotal(productosConfig.apiUrlTable);
    const costoTotalInsumos = await getCostoTotal(insumosConfig.apiUrl);

    // Retornar la suma del costo total de ambas tablas como string con dos decimales
    return (costoTotalProductos + costoTotalInsumos).toFixed(2);
};
