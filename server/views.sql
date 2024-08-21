USE lepassage;

CREATE VIEW insumos AS
SELECT
    'Liquido' AS tipo,
    nombre AS nombre,
    sku,
    volumen,
    NULL AS stock,
    precio
FROM
    api_liquido

UNION ALL

SELECT
    'Etiqueta' AS tipo,
    nombre AS nombre,
    sku,
    volumen,
    stock,
    precio
FROM
    api_etiqueta

UNION ALL

SELECT
    'Miscelanea' AS tipo,
    nombre AS nombre,
    sku,
    NULL AS volumen,
    stock,
    precio
FROM
    api_miscelanea

UNION ALL

SELECT
    'Paquete' AS tipo,
    nombre AS nombre,
    sku,
    NULL AS volumen,
    stock,
    precio
FROM
    api_paquete

UNION ALL

SELECT
    'Envase' AS tipo,
    nombre AS nombre,
    sku,
    volumen,
    stock,
    precio
FROM
    api_envase;

CREATE VIEW productos AS
SELECT 
    p.nombre AS nombre,
    p.sku AS sku,
    l.nombre AS fragancia,
    en.volumen AS volumen,
    p.stock AS stock,
    p.precio AS precio
FROM
    api_producto p
JOIN
    api_productoenvase pe ON p.id = pe.producto_id
JOIN
    api_envase en ON pe.envase_id = en.id
LEFT JOIN
    api_liquido l ON p.id_liquido_id = l.id

UNION ALL

SELECT
    e.nombre AS nombre,
    e.sku AS sku,
    NULL AS fragancia,
    e.volumen AS volumen,
    e.stock AS stock,
    e.precio AS precio
FROM
    api_envase e
WHERE
    e.tipo = 'Difusor'

UNION ALL

SELECT
    m.nombre AS nombre,
    m.sku AS sku,
    NULL AS fragancia,
    NULL AS volumen,
    m.stock AS stock,
    m.precio AS precio
FROM
    api_miscelanea m
WHERE
    m.vendible = TRUE;

