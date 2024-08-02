USE lepassage;
CREATE VIEW insumos AS
SELECT 
    'liquido' AS tipo,
    nombre_liquido AS nombre,
    sku,
    volumen,
    NULL AS stock,
    precio,
    vencimiento AS fecha_vencimiento
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
    NULL AS fecha_vencimiento
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
    NULL AS fecha_vencimiento
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
    NULL AS fecha_vencimiento
FROM 
    Paquete;


CREATE VIEW productos AS
SELECT 
    p.nombre_producto AS nombre_producto,
    p.stock AS stock_producto,
    p.precio AS precio_producto,
    'producto compuesto' AS tipo_generico,
    NULL as tipo_especifico,
    NULL AS sku,
    NULL AS volumen,
    NULL AS fecha_vencimiento
FROM 
    Producto p

UNION ALL

SELECT 
    NULL AS nombre_producto,
    e.stock AS stock_producto,
    e.precio AS precio_producto,
    'envase' AS tipo_generico,
    e.tipo_envase tipo_especifico,
    e.sku AS sku,
    e.volumen AS volumen,
    NULL AS fecha_vencimiento
FROM
    Envase e

UNION ALL

SELECT 
    l.nombre_liquido AS nombre_producto,
    NULL AS stock_producto,
    l.precio AS precio_producto,
    'liquido' AS tipo_generico,
    l.tipo_liquido tipo_especifico,
    l.sku AS sku,
    l.volumen AS volumen,
    l.vencimiento AS fecha_vencimiento
FROM
    Liquido l

UNION ALL

SELECT
    m.nombre_objeto AS nombre_producto,
    m.stock AS stock_producto,
    m.precio AS precio_producto,
    'miscelanea' AS tipo_generico,
    m.tipo_objeto tipo_especifico,
    m.sku AS sku,
    NULL AS volumen,
    NULL AS fecha_vencimiento
FROM
    Miscelanea m

