import { useRuntimeConfig } from '#imports'
import type { Filter, Event } from 'nostr-tools'
import { NostrManager } from '../classes/NostrManager'

export const useNostr = (relays?: string[]) => {
  const config = useRuntimeConfig()
  const opts = (config.public?.nuxstrComments || {}) as {
    relays?: string[]
  }

  const effectiveRelays = relays || opts.relays || []
  const nostrManager = NostrManager.getInstance(effectiveRelays)

  const subscribe = (filter: Filter, onEvent: (event: Event) => void) => {
    return nostrManager.subscribe(filter, onEvent)
  }

  const publish = (event: Event) => {
    console.log('publishing Comment', event)
    return nostrManager.publish(event)
  }

  const getEvent = (filter: Filter) => {
    return nostrManager.getEvent(filter)
  }

  return {
    nostrManager,
    subscribe,
    publish,
    getEvent,
  }
}
