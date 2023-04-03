import GithubSlugger from 'github-slugger'

import { hasProperty } from 'hast-util-has-property'
import { headingRank } from 'hast-util-heading-rank'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'

const slugger = new GithubSlugger()

/**
 * Extracts headings from a unified tree.
 *
 * To be used *AFTER* the `rehype-slug` plugin.
 *
 * Based on https://github.com/rehypejs/rehype-slug/blob/4.0.1/index.js
 */
export const rehypeExtractHeadings = ({ rank = 2, headings }) => {
  slugger.reset()
  return (tree) => {
    visit(tree, 'element', function (node) {
      if (headingRank(node) !== rank) {
        return
      }

      const id = slugger.slug(toString(node))

      node.properties.id = id
      headings.push({ title: toString(node), id })
    })
  }
}
