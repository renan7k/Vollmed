/// <reference types="cypress" />

describe('Testes em API', () => {
    context('Testes em rotas com usuário autorizado', () => {
        beforeEach(() => {
            cy.loginApi(Cypress.env('email'), Cypress.env('senha'))
        })

        it('GET via url front para teste em reposta da home', () => {
            cy.request('GET', '/').should((response) => {
                expect(response.status).to.eq(200);
            })
        })
        it('Deve verificar se o token de autenticação é retornado após login via POST na API', () => {
            cy.get('@token').should('exist');
        })
    })
    context('Requisições de usuário clínica em especialistas', () => {
        beforeEach(() => {
            cy.fixture('especialistas.json').as('especialistas')
            cy.loginApi(Cypress.env('email'), Cypress.env('senha'))
        })

        it('POST em especialistas', () => {
            cy.get('@especialistas').then((dados) => {
                const especialista = dados.especialistas[0];
                cy.request({
                    method: 'POST',
                    url: Cypress.env('api_clinica'),
                    body: {
                        nome: especialista.nome,
                        email: especialista.email,
                        senha: especialista.senha,
                        endereco: {
                            cep: especialista.cep,
                            rua: especialista.rua,
                            numero: especialista.numero,
                            complemento: especialista.complemento,
                            estado: especialista.estado
                        }
                    }
                }).then((response) => {
                    if (response.status !== 201) {
                            cy.log(`O status ${response.status} não é o padrão 201`)
                    }
            
                    expect(response.body).to.have.property('id') // Verifica se a resposta possui a propriedade "id"
                    expect(response.body).to.have.property('nome')
                    expect(response.body).to.have.property('email') // Verifica se a propriedade "email" é igual ao valor enviado na requisição
            })
            })

        })
    })
   // context('Testes de acesso não autorizado', ()=>{
     //   it('Deve redirecionar para a página de login ao tentar acessar informações do paciente', () => {
       //   cy.intercept('/paciente').as('accessDenied');
        //  cy.visit('/patient-info');
        //  cy.wait('@accessDenied').then(interception => {
        //    expect(interception.response.statusCode).to.eq(302);
        //    cy.url().should('include', '/login');
        //  });
       // });
     // })
})