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
      const hr = headingRank(node)

      if (hr) {
        node.properties.id = slugger.slug(toString(node).trim())
      }

      if (hr === rank) {
        headings.push({ title: toString(node), id: node.properties.id })
      }
    })
  }
}
