from rest_framework import serializers
from .models import Liquido, Etiqueta, Insumo, Miscelanea, Paquete, Envase, Producto

class LiquidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liquido
        fields = '__all__'

class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = '__all__'

class InsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insumo
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
    class Meta:
        model = Producto
        fields = '__all__'
