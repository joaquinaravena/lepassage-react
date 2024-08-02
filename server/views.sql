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
    'miscelanea' AS tipo_componente,
    m.sku AS sku_componente,
    m.nombre_objeto AS nombre_componente,
    m.tipo_objeto AS tipo_componente_detalle,
    NULL AS volumen,
    m.stock AS stock_componente,
    m.precio AS precio_componente,
    NULL AS fecha_vencimiento
FROM 
    Producto p
JOIN 
    ProductoMiscelanea pm ON p.id = pm.producto_id
JOIN 
    Miscelanea m ON pm.miscelanea_id = m.id

UNION ALL

SELECT 
    p.nombre_producto AS nombre_producto,
    p.stock AS stock_producto,
    p.precio AS precio_producto,
    'envase' AS tipo_componente,
    e.sku AS sku_componente,
    e.sku AS nombre_componente,
    e.tipo_envase AS tipo_componente_detalle,
    e.volumen AS volumen,
    e.stock AS stock_componente,
    e.precio AS precio_componente,
    NULL AS fecha_vencimiento
FROM 
    Producto p
JOIN 
    ProductoEnvase pe ON p.id = pe.producto_id
JOIN 
    Envase e ON pe.envase_id = e.id

UNION ALL

SELECT 
    p.nombre_producto AS nombre_producto,
    p.stock AS stock_producto,
    p.precio AS precio_producto,
    'paquete' AS tipo_componente,
    paq.sku AS sku_componente,
    paq.nombre_paquete AS nombre_componente,
    paq.tipo_paquete AS tipo_componente_detalle,
    NULL AS volumen,
    paq.stock AS stock_componente,
    paq.precio AS precio_componente,
    NULL AS fecha_vencimiento
FROM 
    Producto p
JOIN 
    ProductoPaquete pp ON p.id = pp.producto_id
JOIN 
    Paquete paq ON pp.paquete_id = paq.id;

