from django.db import models
# Create your models here.from django.db import models

TIPO_LIQUIDO_CHOICES = [
    ('TIPO1', 'Tipo 1'),
    ('TIPO2', 'Tipo 2'),
    # Agrega más opciones según sea necesario
]

TIPO_INSUMO_CHOICES = [
        ('TIPO1', 'Tipo 1'),
        ('TIPO2', 'Tipo 2'),
        # Agrega más opciones según sea necesario
]

TIPO_OBJETO_CHOICES = [
        ('TIPO1', 'Tipo 1'),
        ('TIPO2', 'Tipo 2'),
        # Agrega más opciones según sea necesario
    ]

TIPO_PAQUETE_CHOICES = [
        ('TIPO1', 'Tipo 1'),
        ('TIPO2', 'Tipo 2'),
        # Agrega más opciones según sea necesario
    ]

TIPO_ENVASE_CHOICES = [
        ('TIPO1', 'Tipo 1'),
        ('TIPO2', 'Tipo 2'),
        # Agrega más opciones según sea necesario
    ]

class Insumo(models.Model):    
    nombre_insumo = models.CharField(max_length=45)
    sku = models.CharField(max_length=45)
    tipo_insumo = models.CharField(max_length=45, choices=TIPO_INSUMO_CHOICES)
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.nombre_insumo


class Liquido(models.Model):
    nombre_liquido = models.CharField(max_length=45)
    sku = models.CharField(max_length=45)
    tipo_liquido = models.CharField(max_length=45, choices=TIPO_LIQUIDO_CHOICES)
    volumen = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)
    vencimiento = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.nombre_liquido


class Etiqueta(models.Model):
    id_liquido = models.ForeignKey(Liquido, on_delete=models.SET_NULL, null=True, blank=True)
    nombre_etiqueta = models.CharField(max_length=45)
    sku = models.CharField(max_length=45)
    volumen = models.IntegerField()
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.nombre_etiqueta


class Miscelanea(models.Model):
    sku = models.CharField(max_length=45)
    nombre_objeto = models.CharField(max_length=45)
    tipo_objeto = models.CharField(max_length=45, choices=TIPO_OBJETO_CHOICES)
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.nombre_objeto


class Paquete(models.Model):
    nombre_paquete = models.CharField(max_length=45)
    sku = models.CharField(max_length=45)
    tipo_paquete = models.CharField(max_length=45, choices=TIPO_PAQUETE_CHOICES)
    stock = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.nombre_paquete


class Envase(models.Model):
    id_liquido = models.ForeignKey(Liquido, on_delete=models.CASCADE)
    sku = models.CharField(max_length=45)
    tipo_envase = models.CharField(max_length=45, choices=TIPO_ENVASE_CHOICES)
    volumen = models.IntegerField()
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.sku


class Producto(models.Model):
    nombre_producto = models.CharField(max_length=45)
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)
    miscelaneas = models.ManyToManyField(Miscelanea, through='ProductoMiscelanea')
    envases = models.ManyToManyField(Envase, through='ProductoEnvase')
    paquetes = models.ManyToManyField(Paquete, through='ProductoPaquete')
    
    def __str__(self):
        return self.nombre_producto

#Tablas de relacion muchos a muchos
class ProductoMiscelanea(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    miscelanea = models.ForeignKey(Miscelanea, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('producto', 'miscelanea')


class ProductoEnvase(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    envase = models.ForeignKey(Envase, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('producto', 'envase')


class ProductoPaquete(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    paquete = models.ForeignKey(Paquete, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('producto', 'paquete')
