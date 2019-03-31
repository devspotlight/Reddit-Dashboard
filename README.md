## kafka-stream-viz

> Based on https://github.com/heroku/kafka-demo

A simple app that streams comments from reddit/r/politics and analyzes the usrs behavior in real-time by using our machine learning API. They are read from a Kafka topic named `reddit-comments`.

### Development Setup

**Node > [v10.13](https://nodejs.org/dist/v10.13.0/docs/api/) "Dubnium" required**

```sh
npm install
```

Additionally these environment variables need to be defined:

- `KAFKA_URL`: A comma separated list of SSL URLs to the Kafka brokers making up the cluster.
- `KAFKA_CLIENT_CERT`: The required client certificate (in PEM format) to authenticate clients against the broker.
- `KAFKA_CLIENT_CERT_KEY`: The required client certificate key (in PEM format) to authenticate clients against the broker.
- `KAFKA_TOPIC`: The Kafka topics to subscribe to.
- `KAFKA_PREFIX`: (optional) This is only used by [Heroku's multi-tenant Apache Kafka plans](https://devcenter.heroku.com/articles/multi-tenant-kafka-on-heroku) (i.e. `basic` plans)

> By default the above vars are obtained using the `heroku` command, which needs to be configured with a default app containing the Kafka cluster.

### Development Server

```sh
npm run dev
```

Open http://localhost:3000 in a browser and watch data stream in...
