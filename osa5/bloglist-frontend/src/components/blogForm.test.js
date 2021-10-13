import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const addBlog = jest.fn()

  const component = render(
    <BlogForm addBlog={addBlog} />
  )

  const titleinput = component.container.querySelector('#titleInput')
  const authorInput = component.container.querySelector('#authorInput')
  const urlInput = component.container.querySelector('#urlInput')
  const form = component.container.querySelector('form')

  fireEvent.change(titleinput, {
    target: { value: 'testing of forms could be easier' }
  })

  fireEvent.change(authorInput, {
    target: { value: 'testaaja' }
  })

  fireEvent.change(urlInput, {
    target: { value: 'www.testaaja.com' }
  })

  fireEvent.submit(form)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('testing of forms could be easier' )
  expect(addBlog.mock.calls[0][0].author).toBe('testaaja' )
  expect(addBlog.mock.calls[0][0].url).toBe('www.testaaja.com' )
})