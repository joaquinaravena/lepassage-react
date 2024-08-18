USE lepassage;

CREATE VIEW insumos AS
SELECT
    'liquido' AS tipo,
    nombre_liquido AS nombre,
    sku,
    volumen,
    NULL AS stock,
    precio
FROM
    api_liquido

UNION ALL

SELECT
    'etiqueta' AS tipo,
    nombre_etiqueta AS nombre,
    sku,
    volumen,
    stock,
    precio
FROM
    api_etiqueta

UNION ALL

SELECT
    'miscelanea' AS tipo,
    nombre_objeto AS nombre,
    sku,
    NULL AS volumen,
    stock,
    precio
FROM
    api_miscelanea

UNION ALL

SELECT
    'paquete' AS tipo,
    nombre_paquete AS nombre,
    sku,
    NULL AS volumen,
    stock,
    precio
FROM
    api_paquete

UNION ALL

SELECT
    'envase' AS tipo,
    nombre_envase AS nombre,
    sku,
    volumen,
    stock,
    precio
FROM
    api_envase;

CREATE VIEW productos AS
SELECT 
    p.nombre_producto AS nombre_producto,
    p.sku AS sku,
    l.nombre_liquido AS fragancia,
    en.volumen AS volumen,
    p.stock AS stock_producto,
    p.precio AS precio_producto
FROM
    api_producto p
JOIN
    api_productoenvase pe ON p.id = pe.producto_id
JOIN
    api_envase en ON pe.envase_id = en.id
LEFT JOIN
    api_liquido l ON en.id_liquido_id = l.id

UNION ALL

SELECT
    e.nombre_envase AS nombre_producto,
    e.sku AS sku,
    NULL AS fragancia,
    e.volumen AS volumen,
    e.stock AS stock_producto,
    e.precio AS precio_producto
FROM
    api_envase e
WHERE
    e.tipo_envase = 'difusor'

UNION ALL

SELECT
    m.nombre_objeto AS nombre_producto,
    m.sku AS sku,
    NULL AS fragancia,
    NULL AS volumen,
    m.stock AS stock_producto,
    m.precio AS precio_producto
FROM
    api_miscelanea m
WHERE
    m.vendible = TRUE;

