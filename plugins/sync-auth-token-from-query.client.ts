import { INVITE_CODE_SYNC_QUERY, ROUTE_SYNC_QUERY_ITEMS } from '~/utils/route-sync-query'
import { setRoxyInviteCode } from '~/utils/auth'

export default defineNuxtPlugin({
  name: 'sync-auth-token-from-query',
  enforce: 'pre',
  setup() {
    const route = useRoute()
    const router = useRouter()

    function trySyncStatesFromQuery() {
      let synced = false
      const query = { ...route.query }

      for (const item of ROUTE_SYNC_QUERY_ITEMS) {
        if (!item.consumeFromQuery)
          continue

        const itemSynced = item.consumeFromQuery(route)
        if (itemSynced)
          delete query[item.queryKey]

        synced = synced || itemSynced
      }

      if (synced) {
        router.replace({ path: route.path, query, hash: route.hash })
      }
    }

    function consumeInviteCodeFromQuery() {
      if (route.query.token !== undefined && route.query.token !== null && route.query.token !== '')
        return

      const raw = route.query[INVITE_CODE_SYNC_QUERY]
      if (raw === undefined || raw === null || raw === '')
        return

      const code = Array.isArray(raw) ? raw[0] : raw
      if (!code)
        return

      setRoxyInviteCode(String(code))
      sessionStorage.setItem('invite-code-sync', String(code))

      const query = { ...route.query }
      delete query[INVITE_CODE_SYNC_QUERY]
      router.replace({ path: route.path, query, hash: route.hash })
    }

    watch(
      () => ROUTE_SYNC_QUERY_ITEMS.map(item => route.query[item.queryKey]),
      trySyncStatesFromQuery,
      { immediate: true },
    )
    watch(
      () => [route.query.token, route.query[INVITE_CODE_SYNC_QUERY]],
      consumeInviteCodeFromQuery,
      { immediate: true },
    )
  },
})
