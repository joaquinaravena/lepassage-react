from django.db import models

# Create your models here.from django.db import models

class Liquido(models.Model):
    TIPO_LIQUIDO_CHOICES = [
        ('TIPO1', 'Tipo 1'),
        ('TIPO2', 'Tipo 2'),
        # Agrega más opciones según sea necesario
    ]
    
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


class Insumo(models.Model):
    TIPO_INSUMO_CHOICES = [
        ('TIPO1', 'Tipo 1'),
        ('TIPO2', 'Tipo 2'),
        # Agrega más opciones según sea necesario
    ]
    
    nombre_insumo = models.CharField(max_length=45)
    sku = models.CharField(max_length=45)
    tipo_insumo = models.CharField(max_length=45, choices=TIPO_INSUMO_CHOICES)
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.nombre_insumo


class Miscelanea(models.Model):
    TIPO_OBJETO_CHOICES = [
        ('TIPO1', 'Tipo 1'),
        ('TIPO2', 'Tipo 2'),
        # Agrega más opciones según sea necesario
    ]
    
    sku = models.CharField(max_length=45)
    nombre_objeto = models.CharField(max_length=45)
    tipo_objeto = models.CharField(max_length=45, choices=TIPO_OBJETO_CHOICES)
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.nombre_objeto


class Paquete(models.Model):
    TIPO_PAQUETE_CHOICES = [
        ('TIPO1', 'Tipo 1'),
        ('TIPO2', 'Tipo 2'),
        # Agrega más opciones según sea necesario
    ]
    
    id_etiqueta = models.ForeignKey(Etiqueta, on_delete=models.SET_NULL, null=True, blank=True)
    nombre_paquete = models.CharField(max_length=45)
    sku = models.CharField(max_length=45)
    tipo_paquete = models.CharField(max_length=45, choices=TIPO_PAQUETE_CHOICES)
    stock = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.nombre_paquete


class Envase(models.Model):
    TIPO_ENVASE_CHOICES = [
        ('TIPO1', 'Tipo 1'),
        ('TIPO2', 'Tipo 2'),
        # Agrega más opciones según sea necesario
    ]
    
    id_liquido = models.ForeignKey(Liquido, on_delete=models.CASCADE)
    id_etiqueta = models.ForeignKey(Etiqueta, on_delete=models.SET_NULL, null=True, blank=True)
    sku = models.CharField(max_length=45)
    tipo_envase = models.CharField(max_length=45, choices=TIPO_ENVASE_CHOICES)
    volumen = models.IntegerField()
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.sku


class Producto(models.Model):
    id_objeto = models.ForeignKey(Miscelanea, on_delete=models.SET_NULL, null=True, blank=True)
    id_paquete = models.ForeignKey(Paquete, on_delete=models.SET_NULL, null=True, blank=True)
    id_envase = models.ForeignKey(Envase, on_delete=models.SET_NULL, null=True, blank=True)
    nombre_producto = models.CharField(max_length=45)
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.nombre_producto
