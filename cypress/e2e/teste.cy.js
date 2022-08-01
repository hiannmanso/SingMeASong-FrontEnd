import { faker } from '@faker-js/faker'

describe('test user behavior', () => {
	it('test post new ytbLink Valid', () => {
		cy.visit('http://localhost:3000')
		const name = faker.name.firstName()
		cy.get('[id=nameInput]').type(name)
		cy.get('[id=ytbLinkInput]').type(
			`www.youtube.com/${faker.random.alpha()}`
		)
		cy.intercept('GET', '/recommendations').as('getNewLink')
		cy.get('[id=submit]').click()
		cy.wait('@getNewLink')
		cy.get('article div:first').should('contain.text', name)
	})
	it('test post new ytbLink with link invaid', () => {
		cy.visit('http://localhost:3000')

		cy.get('[id=nameInput]').type(faker.name.firstName())
		cy.get('[id=ytbLinkInput]').type(`${faker.random.alpha()}`)
		cy.intercept('GET', '/recommendations', { statusCode: 422 }).as(
			'getNewLink'
		)
		cy.get('[id=submit]').click()
		cy.wait('@getNewLink')
		cy.on('window:alert', (text) => {
			expect(text).to.contains('Error creating recommendation!')
		})
	})
	it('test post new ytbLink without name', () => {
		cy.visit('http://localhost:3000')

		cy.get('[id=ytbLinkInput]').type(`${faker.random.alpha()}`)
		cy.intercept('GET', '/recommendations').as('getNewLink')
		cy.get('[id=submit]').click()
		cy.wait('@getNewLink')

		cy.on('window:alert', (text) => {
			expect(text).to.contains('Error creating recommendation!')
		})
	})
	it('test TOP ytb videos', () => {
		cy.visit('http://localhost:3000')

		cy.contains('Top').click()
		cy.url().should('be.equal', 'http://localhost:3000/top')
		cy.contains('Home').click()
		cy.url().should('be.equal', 'http://localhost:3000/')
	})
	it('test random ytb videos', () => {
		cy.visit('http://localhost:3000')

		cy.contains('Random').click()
		cy.url().should('be.equal', 'http://localhost:3000/random')
		cy.contains('Home').click()
		cy.url().should('be.equal', 'http://localhost:3000/')
	})
	it('test upvote ytb videos', () => {
		cy.visit('http://localhost:3000/random')
		const result = cy.intercept('GET', '/random').as('upvote')
		cy.get('[id=upvote]').click()
		cy.get(['[id='])
	})
	it('test downvote ytb videos', () => {
		cy.visit('http://localhost:3000/random')
		cy.intercept('GET', '/random').as('downvote')
		cy.get('[id=downvote]').click()
		cy.wait('@downvote')
		cy.get('article div h1').should('be.equal', '-1')
	})
})
