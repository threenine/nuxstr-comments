import type { Event as NToolEvent, Filter } from 'nostr-tools'
import { SimplePool, verifyEvent } from 'nostr-tools'

export class NostrManager {
  private static instance: NostrManager
  private pool: SimplePool
  private relays: string[]

  private constructor(relays: string[]) {
    this.pool = new SimplePool()
    this.relays = relays
  }

  public static getInstance(relays: string[]): NostrManager {
    if (!NostrManager.instance) {
      NostrManager.instance = new NostrManager(relays)
    }
    else {
      // Add any new relays to the existing set
      relays.forEach((relay) => {
        if (!NostrManager.instance.relays.includes(relay)) {
          NostrManager.instance.relays.push(relay)
        }
      })
    }
    return NostrManager.instance
  }

  public subscribe(filter: Filter, onEvent: (event: NToolEvent) => void) {
    return this.pool.subscribeMany(this.relays, filter, {
      onevent(event) {
        if (verifyEvent(event)) {
          onEvent(event)
        }
      },
    })
  }

  public async publish(event: NToolEvent): Promise<void> {
    await this.pool.publish(this.relays, event)
  }

  public async getEvent(filter: Filter): Promise<NToolEvent | null> {
    return await this.pool.get(this.relays, filter)
  }

  public async close() {
    this.pool.close(this.relays)
  }
}
