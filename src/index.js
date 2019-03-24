/* eslint no-console: 0 */

import '../styles/style.css'

// TODO: Consider adding http://square.github.io/crossfilter/

import DataTable from './lib/data-table'
import TrendGraph from './lib/trend-graph'
// import TopThree from './lib/top-three'

import { MAX_SIZE } from '../consumer/constants'

// Enable "Architecture" button (coupled to ../../views/index.pug)
let architectureLink = document.querySelector('.architecture-link')
let main = document.querySelector('main')
let architectureFrame = document.querySelector('.architecture-iframe')
architectureLink.addEventListener('click', () => {
  const isOpen = main.classList.contains('open')
  if (isOpen) {
    architectureFrame.removeAttribute('src')
    main.classList.remove('open')
  } else {
    architectureFrame.setAttribute(
      'src',
      '/public/kafka-diagram/kafka-diagram-v2.html'
    )
    main.classList.add('open')
  }
})

/*
 * Combines GUI elements into (coupled to ../../views/index.pug)
 */
const aggregate = [
  new DataTable('.data-table table tbody', '#threshold', MAX_SIZE, '#pause'),
  new TrendGraph('#trend-graph', MAX_SIZE)
  // new TopThree('#trolls', 'li', 'pos')
  // new TopThree('#bots', 'li', 'neg')
]

const url = `ws${window.location.href.match(/^http(s?:\/\/.*)\/.*$/)[1]}`
const ws = new window.WebSocket(url)

// Initialize GUI elements
aggregate.forEach((a) => a.init())

ws.onmessage = (e) => {
  const data = JSON.parse(e.data)
  // console.log(`${data.length} new messages`, data)

  // Update all GUI elements with websocket data stream
  aggregate.forEach((a) => a.update(data))
}
