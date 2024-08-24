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
    miscelaneas = serializers.SerializerMethodField()
    envases = serializers.SerializerMethodField()
    paquetes = serializers.SerializerMethodField()

    # Campo de solo escritura para manejar la entrada como arrays de IDs
    miscelaneas_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True)
    envases_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True)
    paquetes_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = Producto
        fields = '__all__'

    def get_miscelaneas(self, obj):
        return MiscelaneaSerializer(obj.miscelaneas.all(), many=True).data

    def get_envases(self, obj):
        return EnvaseSerializer(obj.envases.all(), many=True).data

    def get_paquetes(self, obj):
        return PaqueteSerializer(obj.paquetes.all(), many=True).data

    def create(self, validated_data):
        # Extraemos los datos de los arrays de IDs
        miscelaneas_data = validated_data.pop('miscelaneas_ids', [])
        envases_data = validated_data.pop('envases_ids', [])
        paquetes_data = validated_data.pop('paquetes_ids', [])

        # Creamos el producto
        producto = Producto.objects.create(**validated_data)

        # Creamos las relaciones en las tablas intermedias
        producto.miscelaneas.set(miscelaneas_data)
        producto.envases.set(envases_data)
        producto.paquetes.set(paquetes_data)

        return producto

    def update(self, instance, validated_data):
        miscelaneas_data = validated_data.pop('miscelaneas_ids', [])
        envases_data = validated_data.pop('envases_ids', [])
        paquetes_data = validated_data.pop('paquetes_ids', [])

        # Actualizamos los campos del producto
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizamos las relaciones many-to-many
        instance.miscelaneas.set(miscelaneas_data)
        instance.envases.set(envases_data)
        instance.paquetes.set(paquetes_data)

        return instance

