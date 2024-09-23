class Event {
  constructor () {
    this.events = {}
  }

  static async build () {
    return new Event()
  }
}
