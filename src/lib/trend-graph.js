/* eslint no-console: 0 */

import * as d3 from 'd3' // See https://d3js.org/

export default class TrendGraph {
  /**
   * Constructs a trend graph instance
   * @param tableSelector string to select target <table> element
   */
  constructor(selector, bufferSize) {
    this.graph = d3.select(selector)
    this._bufferSize = bufferSize
  }

  /**
   * See `aggregate` usage in ../../src/index.js
   */
  init() {}

  /**
   * TODO: Graph trend...
   * @param data
   */
  update(data) {
    data
    // console.log(data)
  }
}
