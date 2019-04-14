import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import LetterPreview from '../components/letter-preview'

import styles from './index.module.css';

class RootIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const letters = get(this, 'props.data.allContentfulLetter.edges')

    return (
      <Layout location={this.props.location} >
        <div className={styles.container}>
          <Helmet title={siteTitle} />
          <div className="wrapper">
            <div className={styles.intro}>
              <p>
                My grandparents immigrated to Palestine in the mid thirties
                from different cities in Poland. They met there and started
                a life together in a new land. Between 1934 and 1941 they
                received letters from their families in Europe,
                and from each other. This archive of letters is dedicated to their memory.
              </p>
            </div>
            <div className={styles.intro}>
              - <a href="https://twitter.com/Hoffrocket" target="_new">Jon Hoffman</a>
            </div>
            <h2 className="section-headline">Letters</h2>
            <ul className="article-list">
              {letters.map(({ node }) => {
                return (
                  <li key={node.id}>
                    <LetterPreview letter={node} />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Layout>
    )
  }
}

export default RootIndex

export const pageQuery = graphql`
  query HomeQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulLetter(sort: { fields: [date], order: ASC }) {
      edges {
        node {
          slug
          images {
            fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: THUMB) {
            ...GatsbyContentfulFluid_tracedSVG
            }
          }
          date(formatString: "MMMM Do, YYYY")
          message {
            childMarkdownRemark {
              excerpt(pruneLength:240)
            }
          }
        }
      }
    }
  }
`
