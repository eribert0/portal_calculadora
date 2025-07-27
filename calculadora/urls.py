from django.urls import path
from . import views

urlpatterns = [
    path('api/calcular/', views.OperacaoAPIView.as_view(), name='api-calcular'),
    path('', views.calculadora_view, name='pagina-calculadora' )
]