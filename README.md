# Desafio Jazida.com
[![Build Status](https://travis-ci.org/danielfsousa/desafio-jazida.svg?branch=master)](https://travis-ci.org/danielfsousa/desafio-jazida) [![Coverage Status](https://coveralls.io/repos/github/danielfsousa/desafio-jazida/badge.svg?branch=master)](https://coveralls.io/github/danielfsousa/desafio-jazida?branch=master)

## URL

[TODO](http://google.com)

## Requisitos

 - [Node v8+](https://nodejs.org/en/download/current/) ou [Docker](https://www.docker.com/)
 - NPM

## Instruções

```bash
# Clone o repositorio
git clone https://github.com/danielfsousa/desafio-jazida

# Instale as dependências
npm install

# Crie um arquivo .env e modifique as variaveis de ambiente
cp .env.example .env
nano .env

# Inicie no modo Desenvolvimento
npm run dev

# Inicie no modo Produção
npm start
```

## Scripts

```bash
npm start  # Inicia no modo Produção                                              
npm test  # Inicia testes                              
npm run dev  # Inicia no modo de Desenvolvimento                                             
npm run lint  # Analisa o código                        
npm run lint:fix  # Analisa o código e tenta consertar automaticamente                                     
npm run lint:watch  # Lint and watch                                    
npm run test:unit  # Inicia testes unitários                             
npm run test:integration  # Inicia teste de integração                               
npm run test:watch  # Inicia testes e                           
npm run validate  # Analisa o código e Inicia testes                                  
npm run logs  # Lista todos os logs                                  
npm run logs:error  # Lista logs com erros                            
npm run docs  # Gera documentação da API                                            
npm run docker:start  # Inicia com o Docker no modo Produção         
npm run docker:dev  # Inicia com o Docker no modo Desenvolvimento                                           
npm run docker:test  # Inicia testes com o Docker                                              
```
