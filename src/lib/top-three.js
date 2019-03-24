/* eslint no-console: 0 */

import * as d3 from 'd3' // See https://d3js.org/

export default class MinThree {
  /**
   * Constructs a min three instance
   * @param tableSelector Selector string to select target <table> element
   * @param elType        Children HTML element type under `tableSelector`
   * @param minType       Type of minimum to find:
   *                      'neg' includes negative numbers (Default value)
   *                      'pos' ignores negative numbers
   */
  constructor(selector, elType = 'li', minType = 'neg') {
    // Set minimum type
    if (-1 == ['neg', 'pos'].indexOf(minType)) this._minType = 'neg'
    else this._minType = minType

    this._container = d3.select(selector)
    this._elType = elType

    // Array of objects to hold user stats
    this._usrScores = []
  }

  /**
   * Sets properties for DOM manipulation
   * See `aggregate` usage in ../../src/index.js
   */
  init() {
    this.min3 = [
      this._container.select(`${this._elType}:nth-child(1)`),
      this._container.select(`${this._elType}:nth-child(2)`),
      this._container.select(`${this._elType}:nth-child(3)`)
    ]

    // Initial display of min 3 values
    this.min3[0].text('TBD')
    this.min3[1].text('TBD')
    this.min3[2].text('TBD')
  }

  /**
   * Update min 3 users with lowest score (of this._minType)
   * @param Array data  Most recent predicted messages
   */
  update(data) {
    // Update this._usrScores array, adding elements or recalculating score averages as needed
    data.forEach((msg) => {
      // Skip negative scores if `this._minType` is 'pos'
      if ('pos' === this._minType && 0 > msg.score) return

      // Try to find stats for this username
      let usr = this._usrScores.find((usr) => usr.username == msg.username)

      if (usr) {
        // console.log('Existing user', msg.username, usr)
        // If the user is already in our stats object:

        usr.score_avg =
          (usr.comment_count * usr.score_avg + msg.score) /
          (usr.comment_count + 1)
        usr.comment_count = usr.comment_count + 1
        // this._usrScores[msg.username] = usr
      } else {
        // If the user is new to our stats:

        // console.log('New user', {
        //   username: msg.username,
        //   comment_count: 1,
        //   score_avg: msg.score
        // })
        this._usrScores.push({
          username: msg.username,
          comment_count: 1,
          score_avg: msg.score
        })
      }
    })
    // console.log(
    //   'MinThree.update: Update scores',
    //   this._container.attr('id'),
    //   this._usrScores.slice(0)
    // )

    // Keep this._usrScores sorted by min `score_avg`
    this._usrScores.sort((usrA, usrB) => {
      if (usrA.score_avg > usrB.score_avg) return 1
      else if (usrA.score_avg == usrB.score_avg) return 0
      else return -1
    })
    // console.log(
    //   'MinThree.update: Sort scores',
    //   this._container.attr('id'),
    //   this._usrScores.slice(0)
    // )

    // Update display of min 3 values
    if (0 in this._usrScores) this.min3[0].text(this._usrScores[0].username)
    if (1 in this._usrScores) this.min3[1].text(this._usrScores[1].username)
    if (2 in this._usrScores) this.min3[2].text(this._usrScores[2].username)
  }
}
