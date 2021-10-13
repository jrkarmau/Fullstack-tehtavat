describe('Blog app', function () {

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Jovan Karmakka',
      username: 'jrkarmau',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Blogs')
  })


  describe('login', function () {

    it('succeeds with correct credentials', function () {
      cy.get('#username').type('jrkarmau')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()
      cy.contains('Jovan Karmakka logged in')
    })

    it('fails with invalid credentials', function () {
      cy.get('#username').type('jrkarmau')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.errorNotification').contains('wrong credentials')
      cy.get('.errorNotification').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Jovan Karmakka logged in')
    })
  })


  describe('when logged in', function () {

    beforeEach(function () {
      cy.login({ username: 'jrkarmau', password: 'salasana' })
    })

    it('a new blog can be created', function () {
      cy.get('#create-new-blog').click()
      cy.get('#titleInput').type('a first blog created by cypress')
      cy.get('#authorInput').type('jrkarmau')
      cy.get('#urlInput').type('www.blogs-app.com')
      cy.get('#create').click()
      cy.contains('a first blog created by cypress jrkarmau')
    })

    describe('and a blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a first blog created by cypress',
          author: 'jrkarmau',
          url: 'www.blogs-app.com/1'
        })
        cy.createBlog({
          title: 'a second blog created by cypress',
          author: 'jrkarmau',
          url: 'www.blogs-app.com/2'
        })
        cy.createBlog({
          title: 'a third blog created by cypress',
          author: 'jrkarmau',
          url: 'www.blogs-app.com/3'
        })
      })

      it('blog can liked', function () {
        cy.contains('a second blog created by cypress').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').contains('likes: 0')
        cy.get('@theBlog').contains('like').click()
        cy.get('@theBlog').contains('likes: 1')
      })

      it('blog can be deleted', function () {
        cy.contains('a first blog created by cypress').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').contains('delete').click()
        cy.get('html').should('not.contain', 'a first blog created by cypress')
      })

      it('blog cant be deleted by other user', function () {
        const user2 = {
          name: 'Jovan',
          username: 'karma',
          password: 'sala'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user2)
        cy.visit('http://localhost:3000')
        cy.login({ username: 'karma', password: 'sala' })

        cy.contains('a second blog created by cypress').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').should('not.contain', 'delete')
      })

      it('blogs are sorted by likes', function () {
        cy.contains('a third blog created by cypress').parent().as('theBlog3')
        cy.get('@theBlog3').contains('view').click()
        cy.get('@theBlog3').contains('like').click()
        cy.get('@theBlog3').contains('like').click()
        cy.contains('a first blog created by cypress').parent().as('theBlog1')
        cy.get('@theBlog1').contains('view').click()
        cy.get('@theBlog1').contains('like').click()

        cy.visit('http://localhost:3000')
        cy.get('.blog:first').contains('a third blog created by cypress')
        cy.get('.blog:last').contains('a second blog created by cypress')
      })


    })
  })
})