from rest_framework import serializers
from .models import Operacao

class OperacaoSerializer(serializers.Serializer):
    parametros = serializers.CharField(max_length=100)
