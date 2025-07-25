from django.db import models
from django.contrib.auth.models import User


class Operacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    parametros = models.CharField(max_length=100)
    resultado = models.CharField(max_length=60)
    data_inclusao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Operação de {self.usuario.username}: {self.parametros} = {self.resultados}'