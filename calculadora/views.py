from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from simpleeval import simple_eval

from .models import Operacao
from .serializers import OperacaoRequisicaoSerializer, OperacaoSerializer

class OperacaoAPIView(APIView):

    def get(self, request):
        objetos_usuario = Operacao.objects.filter(usuario=request.user).order_by('-data_inclusao')
        serializer = OperacaoSerializer(objetos_usuario, many=True)
        
        return Response(serializer.data)

    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = OperacaoRequisicaoSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        parametros_recebidos = serializer.validated_data['parametros']

        try:
            resultado_calculado = self.logica_calculo(parametro_string = parametros_recebidos)
        except ValueError as e:
            return Response({'message': str(e)}, status=400)
        except Exception as e:
            return Response({'message': str(e)}, status=500)

        operacao = Operacao.objects.create(
            usuario = request.user,
            parametros = parametros_recebidos,
            resultado = str(resultado_calculado)
        )

        serializer = OperacaoSerializer(operacao)

        return Response(serializer.data, status=201)

    def logica_calculo(self, parametro_string):
        try:
            resultado = simple_eval(parametro_string)
        except Exception as e:
            if str(e) == 'division by zero':
                raise ValueError('Divisão por zero')  

        return resultado
    
def calculadora_view(request):
    contexto = {
        'nome':'Bebeto',
        'mensagem':'Bem-vindo ao portal calculadora!'
    }
    return render(request, 'index.html')