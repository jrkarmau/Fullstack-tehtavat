import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


test('render blog with only basic information', () => {

  const user = {
    username: 'jrkarmau',
    name: 'Jovan Karmakka'
  }

  const blog = {
    author: 'Joel Spolsky',
    title: '12 Steps to Better Code',
    url: 'https://www.joelonsoftware.com',
    likes: 5,
    user: user
  }

  const component = render(
    <Blog blog={blog} user={user} />
  )

  const basicDiv = component.container.querySelector('.basic')
  const advancedDiv = component.container.querySelector('.advanced')

  expect(basicDiv).toHaveStyle('display: block')
  expect(advancedDiv).toHaveStyle('display: none')
})


test('render advanced view when "view-button" pressed', () => {

  const user = {
    username: 'jrkarmau',
    name: 'Jovan Karmakka'
  }

  const blog = {
    author: 'Joel Spolsky',
    title: '12 Steps to Better Code',
    url: 'https://www.joelonsoftware.com',
    likes: 5,
    user: user
  }

  const component = render(
    <Blog blog={blog} user={user} />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  const basicDiv = component.container.querySelector('.basic')
  const advancedDiv = component.container.querySelector('.advanced')

  expect(basicDiv).toHaveStyle('display: none')
  expect(advancedDiv).toHaveStyle('display: block')
})


test('Like button is pressed two times', () => {

  const user = {
    username: 'jrkarmau',
    name: 'Jovan Karmakka'
  }

  const blog = {
    author: 'Joel Spolsky',
    title: '12 Steps to Better Code',
    url: 'https://www.joelonsoftware.com',
    likes: 5,
    user: user
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} user={user} updateBlog={mockHandler} />
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

  const div = component.container.querySelector('.blog')
  expect(div).toHaveTextContent(
    '12 Steps to Better Code Joel Spolsky'
  )
})

