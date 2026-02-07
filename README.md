Gerenciamento de usuários:

CRUD de usuários com OAuth, construída com Django + PostgreSQL no backend e Angular no frontend, totalmente containerizada.


Funcionalidades:

Login de usuários (comuns e admin).
CRUD de usuários (somente admin).
Visualização de perfil para usuários comuns.
Autenticação segura via OAuth2 JWT.


Tecnologias:

Backend: Django, PostgreSQL, OAuth2
Frontend: Angular, HTML, CSS, TypeScript
Infra: Docker & Docker Compose


Rodando a aplicação com Docker:

docker-compose up --build

Backend: http://localhost:8000
Frontend: http://localhost:4200

Superusuário inicial:
username: admin
password: admin


Rotas principais:

Frontend	
/login 
/profile 
/users

Backend	
/api/token
/api/me
/api/users
