from rest_framework import viewsets, generics
from .models import Liquido, Etiqueta, Insumo, Miscelanea, Paquete, Envase, Producto
from .serializers import (
    LiquidoSerializer, EtiquetaSerializer, InsumoSerializer, MiscelaneaSerializer,
    PaqueteSerializer, EnvaseSerializer, ProductoSerializer
)

class ProductList(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class MiscelaneaList(generics.ListCreateAPIView):
    queryset = Producto.objects.filter(id_objeto__isnull=False)
    serializer_class = ProductoSerializer


## POST
class LiquidoViewSet(viewsets.ModelViewSet):
    queryset = Liquido.objects.all()
    serializer_class = LiquidoSerializer

class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer

class InsumoViewSet(viewsets.ModelViewSet):
    queryset = Insumo.objects.all()
    serializer_class = InsumoSerializer

class MiscelaneaViewSet(viewsets.ModelViewSet):
    queryset = Miscelanea.objects.all()
    serializer_class = MiscelaneaSerializer

class PaqueteViewSet(viewsets.ModelViewSet):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer

class EnvaseViewSet(viewsets.ModelViewSet):
    queryset = Envase.objects.all()
    serializer_class = EnvaseSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer