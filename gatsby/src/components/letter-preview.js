import React from 'react'
import { Link } from 'gatsby'
import isEmpty from 'lodash/isEmpty'
import Img from 'gatsby-image'

import styles from './letter-preview.module.css'

export default ({ letter }) => (
  <div className={styles.preview}>
    {!isEmpty(letter.images) && <Img alt="" fluid={letter.images[0].fluid} /> }
    <h3 className={styles.previewTitle}>
      <Link to={`/letter/${letter.slug}`}>{letter.date}</Link>
    </h3>
    <p>
      {letter.message.childMarkdownRemark.excerpt}
    </p>
  </div>
)
