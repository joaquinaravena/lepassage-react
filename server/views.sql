USE lepassage;
CREATE VIEW insumos AS
SELECT 
    'liquido' AS tipo,
    nombre_liquido AS nombre,
    sku,
    volumen,
    NULL AS stock,
    precio,
FROM
    Liquido

UNION ALL

SELECT 
    'etiqueta' AS tipo,
    nombre_etiqueta AS nombre,
    sku,
    volumen,
    stock,
    precio,
FROM
    Etiqueta

UNION ALL

SELECT 
    'miscelanea' AS tipo,
    nombre_objeto AS nombre,
    sku,
    NULL AS volumen,
    stock,
    precio,
FROM
    Miscelanea

UNION ALL

SELECT 
    'paquete' AS tipo,
    nombre_paquete AS nombre,
    sku,
    NULL AS volumen,
    stock,
    precio,
FROM
    Paquete

UNION ALL

SELECT
    'envase' AS tipo,
    nombre_envase AS nombre,
    sku,
    volumen AS volumen,
    stock,
    precio,
FROM
    Envase;

CREATE VIEW productos AS
SELECT 
    p.nombre_producto AS nombre_producto,
    p.sku AS sku,
    l.tipo_liquido AS fragancia,  -- Usar tipo_liquido como fragancia
    en.volumen AS volumen,
    p.stock AS stock_producto,
    p.precio AS precio_producto
FROM
    Producto p
JOIN
    ProductoEnvase pe ON p.id = pe.producto_id
JOIN
    Envase en ON pe.envase_id = en.id
LEFT JOIN
    Liquido l ON en.id_liquido_id = l.id

UNION ALL

SELECT 
    e.nombre_envase AS nombre_producto,
    e.sku AS sku,
    NULL AS fragancia,
    e.volumen AS volumen,
    e.stock AS stock_producto,
    e.precio AS precio_producto,
FROM
    Envase e
WHERE
    e.tipo_envase = 'frasco de color'

UNION ALL

SELECT
    m.nombre_objeto AS nombre_producto,
    m.sku AS sku,
    NULL AS fragancia,
    NULL AS volumen,
    m.stock AS stock_producto,
    m.precio AS precio_producto,
FROM
    Miscelanea m
WHERE
    e.tipo_objeto = {'lampara', 'colgante', 'varilla'};

