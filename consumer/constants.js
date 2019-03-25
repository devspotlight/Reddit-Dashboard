// Millisecond interval to expect new data
const interval = (module.exports.INTERVAL = 1000)

// Max items to display for rolling data
module.exports.MAX_SIZE = 1 * 60 * (1000 / interval)

module.exports.KAFKA_TOPIC = `${
  process.env.KAFKA_PREFIX ? process.env.KAFKA_PREFIX : ''
}${process.env.KAFKA_TOPIC}`
console.info(`Kafka topic: ${module.exports.KAFKA_TOPIC}`) // eslint-disable-line no-console
