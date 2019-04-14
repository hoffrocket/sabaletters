const Promise = require('bluebird')
const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  return new Promise((resolve, reject) => {
    const letterComp = path.resolve('./src/templates/letter.js')
    resolve(
      graphql(
        `
          {
            allContentfulLetter(sort: { fields: [date], order: ASC }) {
              edges {
                node {
                  slug
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
          const previousSlug = index > 0 ? letters[index - 1].node.slug : null;
          const nextSlug = index < letters.length - 1 ? letters[index + 1].node.slug : null;
          const letterPath = `/letter/${letter.node.slug}/`;
          createPage({
            path: letterPath,
            component: letterComp,
            context: {
              slug: letter.node.slug,
              previousSlug,
              nextSlug,
            },
          });
          createRedirect({
            fromPath: `/${letter.node.slug}.html`,
            toPath: letterPath,
            isPermanent: true
          });
        })
      })
    )
  })
}
