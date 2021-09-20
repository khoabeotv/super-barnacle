const dev = process.env.NODE_ENV !== 'production'

module.exports = {
  API_BASE: dev ? 'https://localhost:4003/api/v1/barnacle' : 'https://pos.pages.fm/api/v1/barnacle'
}
