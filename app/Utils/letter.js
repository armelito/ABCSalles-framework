import each from 'lodash/each'

export function splitWord ({ element, expression = ''})
{

  let innerHTML = ''

  let letters = splitLetter(element.innerHTML.toString().trim(), expression)

  each(letters, letter => {
    const html = `<span>${letter}</span>`
    innerHTML += html
  })

  element.innerHTML = innerHTML

  const spans = element.querySelectorAll('span')

  return spans
}

function splitLetter (text, expression)
{
  const splits = text.split('&nbsp;')

  let words = []

  each(splits, (item, index) =>
  {
    if (index > 0)
    {
      words.push(' ')
    }

    words = words.concat(item.split(expression))

    let isLink = false
    let link = ''

    const innerHTML = []

    each(words, word =>
    {
      if (!isLink && (word.includes('<a') || word.includes('<strong')))
      {
        link = ''

        isLink = true
      }

      if (isLink)
      {
        link += ` ${word}`
      }

      if (isLink && (word.includes('/a>') || word.includes('/strong>')))
      {
        innerHTML.push(link)

        link = ''
      }

      if (!isLink && link === '')
      {
        innerHTML.push(word)
      }

      if (isLink && (word.includes('/a>') || word.includes('/strong>')))
      {
        isLink = false
      }
    })

    words = innerHTML
  })

  return words
}
