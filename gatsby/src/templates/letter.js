import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import Img from 'gatsby-image'
import Layout from '../components/layout'

import styles from './letter.module.css'
import navStyles from '../components/navigation.module.css'

class LetterTemplate extends React.Component {
  render() {
    const letter = get(this.props, 'data.contentfulLetter')
    console.log(this.props);
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const nextSlug = get(this.props, 'pageContext.nextSlug');
    const previousSlug = get(this.props, 'pageContext.previousSlug');
    const heroImage = () => {
      if (!isEmpty(letter.images)) {
        return (
          <div className={styles.hero}>
            <Img className={styles.heroImage} fluid={letter.images[0].fluid} />
          </div>
        );
      }
      return <></>;
    }

    return (
      <Layout location={this.props.location} >
        <div style={{ background: '#fff' }}>
          <Helmet title={`${letter.date} | ${siteTitle}`} />
          {heroImage()}
          <div className="wrapper">
            <h1 className="section-headline">{letter.date}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: letter.message.childMarkdownRemark.html,
              }}
            />
            <nav role="navigation">
              <ul className={navStyles.navigation}>
                {previousSlug && <li className={navStyles.navigationItem}><Link to={`/letter/${previousSlug}`}>Previous Letter</Link></li>}
                {nextSlug && <li className={navStyles.navigationItem}><Link to={`/letter/${nextSlug}`}>Next Letter</Link></li>}
              </ul>
            </nav>
          </div>
        </div>
      </Layout>
    )
  }
}

export default LetterTemplate

export const pageQuery = graphql`
  query LetterById($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulLetter(id: { eq: $slug }) {
      id
      date(formatString: "MMMM Do, YYYY")
      images {
        fluid(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulFluid_tracedSVG
        }
      }
      message {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
