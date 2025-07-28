from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from simpleeval import simple_eval

from .models import Operacao
from .serializers import OperacaoRequisicaoSerializer, OperacaoSerializer

class OperacaoAPIView(APIView):
    # permission_classes = [IsAuthenticated]  # Temporariamente desabilitado para teste

    def get(self, request):
        # Para teste, vamos pegar todas as operações ou criar um usuário padrão
        if request.user.is_authenticated:
            objetos_usuario = Operacao.objects.filter(usuario=request.user).order_by('-data_inclusao')
        else:
            # Para teste, vamos criar/pegar o primeiro usuário disponível
            from django.contrib.auth.models import User
            user = User.objects.first()
            if user:
                objetos_usuario = Operacao.objects.filter(usuario=user).order_by('-data_inclusao')
            else:
                objetos_usuario = Operacao.objects.none()
        
        serializer = OperacaoSerializer(objetos_usuario, many=True)
        return Response(serializer.data)
    
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

        # Para teste, usar o primeiro usuário disponível se não estiver autenticado
        if request.user.is_authenticated:
            user = request.user
        else:
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                return Response({'message': 'Usuário não encontrado'}, status=400)

        operacao = Operacao.objects.create(
            usuario = user,
            parametros = parametros_recebidos,
            resultado = str(resultado_calculado)
        )

        serializer = OperacaoSerializer(operacao)

        return Response(serializer.data, status=201)

    def delete(self, request):
        # Para teste, usar o primeiro usuário disponível se não estiver autenticado
        if request.user.is_authenticated:
            user = request.user
        else:
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                return Response({'message': 'Usuário não encontrado'}, status=400)
        
        # Deleta todas as operações do usuário
        deleted_count = Operacao.objects.filter(usuario=user).delete()[0]
        return Response({'message': f'Histórico limpo com sucesso. {deleted_count} operações removidas.'}, status=200)

    def logica_calculo(self, parametro_string):
        funcoes_seguras = {}
        nomes_seguros = {}

        try:
            resultado = simple_eval(parametro_string, functions=funcoes_seguras, names=nomes_seguros)
            return resultado
        
        except ZeroDivisionError:
            raise ValueError('Não é possível dividir por zero.')

        except Exception:
            raise ValueError('Expressão matemática inválida.')
    
def calculadora_view(request):
    contexto = {
        'nome':'Bebeto',
        'mensagem':'Bem-vindo ao portal calculadora!'
    }
    return render(request, 'index.html', contexto)