<template>
  <main>
    <section v-for="group in grouped" :key="group.month" class="group">
      <p class="label month">{{ group.month }}</p>
      <div>
        <EventCard
          v-for="e in group.events"
          :key="e.id"
          :event="e"
          :now="now"
        />
      </div>
    </section>

    <p v-if="!grouped.length" class="empty">
      nothing matches. even london has limits.
    </p>
  </main>
</template>

<script setup>
import events from '~/data/events.json'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const activeScenes = useState('activeScenes', () => [])

// `now` is set after mount so static generation and the client agree
// during hydration; date-aware filtering kicks in immediately after.
const now = ref(null)
onMounted(() => { now.value = new Date() })

const filtered = computed(() => {
  // Sort key: upcoming things by start date; already-running things
  // (exhibitions, seasons) by their closing date, so they surface as
  // "catch it before it goes" rather than hogging the top of the feed.
  const todayISO = now.value ? now.value.toISOString().slice(0, 10) : null
  const key = (e) => (todayISO && e.date < todayISO) ? (e.endDate || todayISO) : e.date
  let list = [...events].sort((a, b) => key(a).localeCompare(key(b)))

  if (now.value) {
    list = list.filter((e) => {
      const end = new Date((e.endDate || e.date) + 'T23:59:59')
      return end >= now.value // never show the past
    })
  }

  if (activeScenes.value.length) {
    list = list.filter(e => activeScenes.value.includes(e.scene))
  }

  return list
})

const grouped = computed(() => {
  const todayISO = now.value ? now.value.toISOString().slice(0, 10) : null
  const key = (e) => (todayISO && e.date < todayISO) ? (e.endDate || todayISO) : e.date
  const groups = []
  for (const e of filtered.value) {
    const k = key(e)
    const month = MONTH_NAMES[Number(k.slice(5, 7)) - 1]
    const last = groups[groups.length - 1]
    if (last && last.month === month) last.events.push(e)
    else groups.push({ month, events: [e] })
  }
  return groups
})

</script>

<style scoped>

.group + .group { margin-top: 2.2rem; }

.month {
  position: sticky;
  top: 0;
  z-index: 2;
  margin: 0;
  padding: 0.7rem 0 0.5rem;
  background: var(--bg);
  border-bottom: 1px solid var(--rule);
}

.empty {
  margin-top: 3rem;
  font-size: 0.85rem;
  color: var(--mut);
}
</style>
