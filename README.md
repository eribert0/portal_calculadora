# Portal Calculadora 🧮

Uma aplicação web de calculadora desenvolvida com Django, oferecendo uma interface moderna e funcionalidades avançadas de histórico de operações.

## 📋 Sobre o Projeto

O Portal Calculadora é uma aplicação web que combina uma interface moderna de calculadora com recursos de backend robustos. O projeto permite realizar operações matemáticas, mantendo um histórico completo das operações realizadas pelo usuário.

### ✨ Funcionalidades

- **Calculadora Interativa**: Interface moderna com design glassmorfismo
- **Operações Básicas**: Adição, subtração, multiplicação e divisão
- **Operações Avançadas**: Porcentagem, mudança de sinal
- **Histórico de Operações**: Visualização completa das operações realizadas
- **Persistência de Dados**: Histórico salvo no banco de dados
- **API REST**: Endpoints para integração com outras aplicações
- **Design Responsivo**: Interface adaptável para diferentes dispositivos
- **Horário das Operações**: Registro do momento de cada cálculo

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.9+**
- **Django 4.2.23** - Framework web principal
- **Django REST Framework** - API REST
- **SQLite** - Banco de dados (desenvolvimento)
- **simpleeval** - Avaliação segura de expressões matemáticas

### Frontend
- **HTML5** - Estrutura da aplicação
- **CSS3** - Estilização com efeitos modernos (glassmorfismo, backdrop-filter)
- **JavaScript (ES6+)** - Lógica da calculadora e interações
- **Design Responsivo** - Compatível com dispositivos móveis

### Arquitetura
- **MVT (Model-View-Template)** - Padrão do Django
- **API REST** - Comunicação entre frontend e backend
- **ORM Django** - Mapeamento objeto-relacional
- **Sistema de Autenticação Django** - Gerenciamento de usuários

## 📁 Estrutura do Projeto

```
portal_calculadora/
├── calculadora/                 # App principal da calculadora
│   ├── static/calculadora/     # Arquivos estáticos
│   │   ├── css/
│   │   │   └── style.css       # Estilos da aplicação
│   │   └── js/
│   │       └── main.js         # Lógica JavaScript da calculadora
│   ├── migrations/             # Migrações do banco de dados
│   ├── models.py              # Modelos do banco de dados
│   ├── views.py               # Views da aplicação
│   ├── urls.py                # URLs do app
│   ├── serializers.py         # Serializers para API REST
│   ├── admin.py               # Configuração do admin
│   └── apps.py                # Configuração do app
├── portal_calculadora/         # Configurações do projeto
│   ├── settings.py            # Configurações Django
│   ├── urls.py                # URLs principais
│   ├── wsgi.py                # Configuração WSGI
│   └── asgi.py                # Configuração ASGI
├── templates/
│   └── index.html             # Template principal
├── db.sqlite3                 # Banco de dados SQLite
├── manage.py                  # Script de gerenciamento Django
└── README.md                  # Este arquivo
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Python 3.9 ou superior
- pip (gerenciador de pacotes Python)
- Git (opcional, para clonar o repositório)

### 1. Clone o Repositório

```bash
git clone https://github.com/eribert0/portal_calculadora.git
cd portal_calculadora
```

### 2. Crie um Ambiente Virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

### 3. Instale as Dependências

```bash
pip install django==4.2.23
pip install djangorestframework
pip install simpleeval
```

### 4. Configure o Banco de Dados

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Crie um Superusuário (Opcional)

```bash
python manage.py createsuperuser
```

### 6. Execute o Servidor de Desenvolvimento

```bash
python manage.py runserver
```

### 7. Acesse a Aplicação

Abra seu navegador e acesse:
- **Aplicação Principal**: http://localhost:8000/
- **Admin Django**: http://localhost:8000/admin/
- **API de Operações**: http://localhost:8000/api/calcular/

## 📡 API Endpoints

### GET /api/calcular/
Retorna o histórico de operações do usuário autenticado.

**Resposta:**
```json
[
    {
        "id": 1,
        "parametros": "10 + 5",
        "resultado": "15",
        "data_inclusao": "2025-01-15T10:30:00Z"
    }
]
```

### POST /api/calcular/
Realiza uma nova operação matemática.

**Requisição:**
```json
{
    "parametros": "20 * 3"
}
```

**Resposta:**
```json
{
    "parametros": "20 * 3",
    "resultado": "60",
    "data_inclusao": "2025-01-15T10:35:00Z"
}
```

## 🎨 Características da Interface

- **Design Glassmorfismo**: Efeitos visuais modernos com transparência e blur
- **Gradiente Dinâmico**: Fundo com gradiente roxo/laranja
- **Layout Responsivo**: Adaptação automática para diferentes tamanhos de tela
- **Histórico Interativo**: Painel lateral com operações anteriores
- **Animações Suaves**: Transições e hover effects
- **Tipografia Limpa**: Fonte Arial com weights apropriados

## 🧪 Funcionalidades Técnicas

### Segurança
- Avaliação segura de expressões matemáticas com `simpleeval`
- Proteção CSRF do Django
- Sanitização de entradas do usuário

### Performance
- Arquivos estáticos otimizados
- Queries do banco de dados otimizadas
- Lazy loading de recursos

### Escalabilidade
- Arquitetura MVT bem estruturada
- API REST para integração
- Separação clara de responsabilidades

## 👨‍💻 Autor

Desenvolvido por **Eriberto Jr**

- GitHub: [@eribert0](https://github.com/eribert0)
