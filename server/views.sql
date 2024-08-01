USE lepassage;
CREATE VIEW insumos AS
SELECT 'Liquido' AS tipo, id, nombre_liquido AS nombre, sku, tipo_liquido AS tipo_especifico, volumen, precio, NULL AS stock
FROM liquido
WHERE tipo_liquido = 'Fragancia'
UNION ALL
SELECT 'Paquete' AS tipo, id, nombre_paquete AS nombre, sku, tipo_paquete AS tipo_especifico, NULL AS volumen, precio, stock
FROM paquete
UNION ALL
SELECT 'Envase' AS tipo, id, NULL AS nombre, sku, tipo_envase AS tipo_especifico, volumen, precio, stock
FROM envase;
