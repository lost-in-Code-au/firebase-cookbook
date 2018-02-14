import 'react-native'
import React from 'react'
import App from '../App'
import renderer from 'react-test-renderer'

test('renders app screen', async () => {
  const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})
