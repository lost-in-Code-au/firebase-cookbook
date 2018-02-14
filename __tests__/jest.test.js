function sum(a, b) {
	return a + b
}
  
test('this should test the jest is working fine', () => {
	expect(sum(2, 3)).toEqual(5)
})