from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Operacao

class OperacaoRequisicaoSerializer(serializers.Serializer):
    parametros = serializers.CharField(max_length=100)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class OperacaoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = Operacao
        fields = ['id', 'usuario', 'parametros', 'resultado', 'data_inclusao']
        read_only_fields = ['data_inclusao']