const Promise = require('bluebird')
const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const letterComp = path.resolve('./src/templates/letter.js')
    resolve(
      graphql(
        `
          {
            allContentfulLetter(sort: { fields: [date], order: ASC }) {
              edges {
                node {
                  id
                }
              }
            }
          }
          `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const letters = result.data.allContentfulLetter.edges
        letters.forEach((letter, index) => {
          previousSlug = index > 0 ? letters[index - 1].node.id : null;
          nextSlug = index < letters.length - 1 ? letters[index + 1].node.id : null;
          createPage({
            path: `/letter/${letter.node.id}/`,
            component: letterComp,
            context: {
              slug: letter.node.id,
              previousSlug,
              nextSlug,
            },
          })
        })
      })
    )
  })
}
