const {
  addParagraph,
  addDiv,
} = require('./main');

describe('addParagraph()', () => {
  test('should append a paragraph to the body', () => {
    let paragraphs = document.querySelectorAll('p');
    expect(paragraphs.length).toBe(0);

    const testText = 'Hello World';
    addParagraph(testText);
    paragraphs = document.querySelectorAll('p');
    expect(paragraphs.length).toBe(1);
    expect(paragraphs[0].innerHTML).toBe(testText);
  });
});

describe('addDiv()', () => {
  test('should append a div to the body', () => {
    let div = document.querySelectorAll('div')
    expect(div.length).toBe(0)

    addDiv()
    div = document.querySelectorAll('div')
    expect(div.length).toBe(1)
  });
});
