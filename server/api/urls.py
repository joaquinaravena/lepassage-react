from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    LiquidoViewSet, EtiquetaViewSet, InsumoViewSet, MiscelaneaViewSet,
    PaqueteViewSet, EnvaseViewSet, ProductoViewSet
)

router = DefaultRouter()
router.register(r'liquidos', LiquidoViewSet)
router.register(r'etiquetas', EtiquetaViewSet)
router.register(r'insumos', InsumoViewSet)
router.register(r'miscelaneas', MiscelaneaViewSet)
router.register(r'paquetes', PaqueteViewSet)
router.register(r'envases', EnvaseViewSet)
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
