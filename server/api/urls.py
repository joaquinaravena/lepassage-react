from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    LiquidoViewSet, EtiquetaViewSet, InsumoViewSet, MiscelaneaViewSet,
    PaqueteViewSet, EnvaseViewSet, ProductoViewSet, get_tipo_envase_choices, get_tipo_liquido_choices, get_tipo_objeto_choices, get_tipo_paquete_choices
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
    path('tipo_liquido_choices/', get_tipo_liquido_choices),
    path('tipo_objeto_choices/', get_tipo_objeto_choices),
    path('tipo_paquete_choices/', get_tipo_paquete_choices),
    path('tipo_envase_choices/', get_tipo_envase_choices),
]
