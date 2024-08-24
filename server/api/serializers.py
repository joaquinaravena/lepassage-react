from rest_framework import serializers
from .models import Liquido, Etiqueta, InsumoView, ProductosView, Miscelanea, Paquete, Envase, Producto, ProductoMiscelanea, ProductoEnvase, ProductoPaquete

class LiquidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liquido
        fields = '__all__'

class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = '__all__'

class InsumoViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsumoView
        fields = '__all__'

class ProductosViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductosView
        fields = '__all__'

class MiscelaneaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Miscelanea
        fields = '__all__'

class PaqueteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paquete
        fields = '__all__'

class EnvaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Envase
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    miscelaneas = serializers.ListField(child=serializers.IntegerField(), write_only=True)
    envases = serializers.ListField(child=serializers.IntegerField(), write_only=True)
    paquetes = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = Producto
        fields = '__all__'

    def create(self, validated_data):
        miscelaneas_data = validated_data.pop('miscelaneas', [])
        envases_data = validated_data.pop('envases', [])
        paquetes_data = validated_data.pop('paquetes', [])

        # Creamos el producto
        producto = Producto.objects.create(**validated_data)

        # Creamos las relaciones en las tablas intermedias
        for miscelanea_id in miscelaneas_data:
            ProductoMiscelanea.objects.create(producto=producto, miscelanea_id=miscelanea_id)

        for envase_id in envases_data:
            ProductoEnvase.objects.create(producto=producto, envase_id=envase_id)

        for paquete_id in paquetes_data:
            ProductoPaquete.objects.create(producto=producto, paquete_id=paquete_id)

        return producto

    def update(self, instance, validated_data):
        miscelaneas_data = validated_data.pop('miscelaneas', [])
        envases_data = validated_data.pop('envases', [])
        paquetes_data = validated_data.pop('paquetes', [])

        # Actualizamos los campos del producto
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Limpiamos las relaciones actuales y creamos nuevas
        ProductoMiscelanea.objects.filter(producto=instance).delete()
        ProductoEnvase.objects.filter(producto=instance).delete()
        ProductoPaquete.objects.filter(producto=instance).delete()

        for miscelanea_id in miscelaneas_data:
            ProductoMiscelanea.objects.create(producto=instance, miscelanea_id=miscelanea_id)

        for envase_id in envases_data:
            ProductoEnvase.objects.create(producto=instance, envase_id=envase_id)

        for paquete_id in paquetes_data:
            ProductoPaquete.objects.create(producto=instance, paquete_id=paquete_id)

        return instance
