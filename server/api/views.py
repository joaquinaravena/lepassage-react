from rest_framework import viewsets
from .models import Liquido, Etiqueta, InsumoView, Miscelanea, Paquete, Envase, Producto, TIPO_LIQUIDO_CHOICES, TIPO_OBJETO_CHOICES, TIPO_PAQUETE_CHOICES, TIPO_ENVASE_CHOICES
from .serializers import (
    LiquidoSerializer, EtiquetaSerializer, InsumoSerializer, MiscelaneaSerializer,
    PaqueteSerializer, EnvaseSerializer, ProductoSerializer
)
from django.http import JsonResponse


class LiquidoViewSet(viewsets.ModelViewSet):
    queryset = Liquido.objects.all()
    serializer_class = LiquidoSerializer

class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer

class InsumoViewSet(viewsets.ModelViewSet):
    queryset = InsumoView.objects.all()
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

def get_tipo_liquido_choices(request):
    return JsonResponse({"tipo_liquido_choices": TIPO_LIQUIDO_CHOICES})

def get_tipo_objeto_choices(request):
    return JsonResponse({"tipo_objeto_choices": TIPO_OBJETO_CHOICES})

def get_tipo_paquete_choices(request):
    return JsonResponse({"tipo_paquete_choices": TIPO_PAQUETE_CHOICES})

def get_tipo_envase_choices(request):
    return JsonResponse({"tipo_envase_choices": TIPO_ENVASE_CHOICES})