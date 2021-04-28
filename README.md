# (Rails, MongoDB, Docker) Strateegia+

#### IF1007 - Microsserviços
**Equipe:** Guilherme Prado, Monalisa Sousa, Ricarth Lima e Warley Souza

## Screenshots e Screencast
![img](https://i.ibb.co/W6ytTJQ/screeshot-strateegia.png)

## 🐟 Sobre o projeto
Esse projeto foi desenvolvido como parte da avaliação da cadeira IF1007 de Microsserviços, ministrada pelo professor Vinícius Garcia no Centro de Informática da UFPE. 

Nosso objetivo é o desenvolvimento de duas features que complementam o uso do sistema [Strateegia](https://app.strateegia.digital/):

- Visualização de uma **Nuvem de Palavras** a nível de Kits;
- Visualização da os **Usuários Influente** em cada Kit;

### Mas o que seria um "Usuário Influente"?

"Uma pessoa influente é a que (i) **responde as questões** e (ii) essa **sua resposta motiva diálogo**, ou seja, gera comentários (divergências e convergências explícitas) e concordâncias"

[Mais informações sobre o "Score"](https://docs.google.com/document/d/1AOaxrYJFdNVKrmocyh-vdoIDIFI91tU6ZrOTRZFBi-w/edit)

## 👩‍💻 Tecnologias Usadas

- Rails Only API
- MongoDB
- Strateegia API
- Docker
- Quickchart TagCloud API
- Git e GitHub

**Deployment**
- Heroku
- Digital Ocean

## 📲 Instalar o Strateegia+
Enquanto a Google não libera nosso aplicativo na Google Web Store, [acesse nossa landing page](http://ricarth.me/ms-strateegia-user-analysis/);

## 🔛 Usando esse repositório

### Sem docker-compose
Tenha certeza de ter o MongoDB, Ruby 2.7.1 e o Rails 6 instalado.
```
git clone https://github.com/ricarthlima/ms-strateegia-user-analysis.git
cd api_gateway
rails s
```
Rodando em localhost:3000/
### Com docker-compose
```
git clone https://github.com/ricarthlima/ms-strateegia-user-analysis.git
git checkout dockering
docker-compose build
docker-compose up -d
```
Rodando em localhost/
## 🤜🤛 Contribuições
Sinta-se a vontade para mandar pull requests, será uma honra para mim! Você pode nos contactar em [rrsl@cin.ufpe.br](mailto:rrsl@cin.ufpe.br)

## 🔮 Próximos passos

- Aplicar feedbacks de usabilidade:
  - Nome do kit;
  - Interface mais minimalista;
  - Download em PDF ou JPG;
- Corrigir bug misterioso da ordenação do Score;
- Tratar e responder erros de forma mais agradável (em especial para API Client);
- Implementar documentação usando o Swagger;
- Terminar a implementação com Docker Compose;
- Atualizar a versão enviada para Google Web Store;
- Refinar a fórmula do Score baseado nos dados coletados;

- Publicar!

Mais na nossa [página de issues.](https://github.com/ricarthlima/ms-strateegia-user-analysis/issues)
## 📜 License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/warleys14/S-Compras/blob/master/LICENSE) file for details.
