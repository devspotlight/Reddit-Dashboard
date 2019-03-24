/* eslint no-console: 0 */

import * as d3 from 'd3' // See https://d3js.org/

export default class DataTable {
  /**
   * Constructs a data table instance
   * @param selector       String to select target <table> element
   * @param thresholdInputSlct  Selector for input with threshold value
   * @param maxSize             Max. number of rows for the table
   */
  constructor(selector, thresholdInputSlct, maxSize, pauseButtonSlct = false) {
    // Target table adn threshbold <input>
    this.tbody = d3.select(selector)
    this._thld = d3.select(thresholdInputSlct)
    console.log(
      'DataTable: Selected tbody and threshold',
      this.tbody,
      this._thld
    )

    // Max number of rows in the table
    this._maxSize = maxSize

    // Actual rows of data
    this._rowData = []

    // Paused flag
    this.paused = false
    this._pauseButton = false
    if (pauseButtonSlct) {
      this._pauseButton = d3.select(pauseButtonSlct)
      console.log('DataTable: Selected pause button', this._pauseButton)
    }
  }

  /**
   * Constructs properties for DOM manipulation
   * See `aggregate` usage in ../../src/index.js
   */
  init() {
    if (this._pauseButton)
      this._pauseButton.on('click', this.togglePause.bind(this))
  }

  /**
   * Prevent graphic table refresh.
   * (Data continues to be updated in the background.)
   */
  togglePause() {
    if (this._pauseButton)
      this._pauseButton.text(this.paused ? 'Pause' : 'Resume')
    this.paused = !this.paused
    // if (this.paused) {
    //   let tr = this.tbody.insert('tr', ':first-child')
    //   tr.append('td')
    //     .attr('colspan', 2)
    //   tr.append('td')
    //     .attr('colspan', 2)
    //     .text('...')
    // }
  }

  /**
   * Appends data rows to the bottom of the table,
   * removing the oldest beyond the max
   * @param data
   */
  update(data) {
    // console.log('DataTable.update: Received', data)
    //
    // // Filter out comments with a score above the threshold
    // let threshold = Number(this._thld.node().value) / 100
    // if (Number.isNaN(threshold)) threshold = 0.2
    //
    // Append most recent (filtered) messages to our table rows
    data.forEach((msg) => {
      // if (msg.score < threshold) this._rowData.push(msg)
      this._rowData.push(msg)
    })

    if (this._rowData.length >= this._maxSize)
      this._rowData.splice(0, this._rowData.length - this._maxSize)

    // Bind data rows to target table
    let rows = this.tbody.selectAll('tr').data(this._rowData, (d) => d)

    if (!this.paused) {
      rows.exit().remove()

      let tr = rows.enter().insert('tr', ':first-child')
      tr.append('td').text((cmt) => cmt.datetime)
      tr.append('td')
        .append('a')
        .attr('href', (cmt) => `https://www.reddit.com/${cmt.username}`)
        .attr('target', '_blank')
        .text((cmt) => cmt.username)
      tr.append('td')
        .append('a')
        .attr(
          'href',
          (cmt) => `https://www.reddit.com/r/politics/comments/${cmt.link_hash}`
        )
        .attr('target', '_blank')
        .text((cmt) => cmt.comment_prev)
      tr.append('td').text((cmt) => cmt.behavior)
    }
    //
    // console.log(
    //   'DataTable.update: New row data',
    //   this._maxSize,
    //   this._rowData.slice(0)
    // )
  }
}
