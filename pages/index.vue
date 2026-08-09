<template>
  <main>
    <div class="controls">
      <div class="line">
        <button
          v-for="s in scenes"
          :key="s.id"
          class="pill"
          :class="[`scene-${s.id}`, { on: activeScenes.includes(s.id) }]"
          @click="toggleScene(s.id)"
        >
          <i class="dot" />{{ s.label }}
        </button>
        <span class="spacer" />
        <button class="dice" title="pick something at random" @click="rollDice">
          surprise me ↷
        </button>
      </div>

      <div class="line">
        <button
          v-for="w in windows"
          :key="w.id"
          class="pill quiet"
          :class="{ on: activeWindow === w.id }"
          @click="activeWindow = w.id"
        >
          {{ w.label }}
        </button>
      </div>

      <input
        v-model="query"
        type="search"
        class="search"
        placeholder="search — try '35mm', 'noise', 'free'"
      >
    </div>

    <template v-for="group in grouped" :key="group.month">
      <p class="label month">{{ group.month }}</p>
      <div>
        <EventCard
          v-for="e in group.events"
          :key="e.id"
          :event="e"
          :now="now"
          :class="{ spotlight: diceId === e.id }"
        />
      </div>
    </template>

    <p v-if="!grouped.length" class="empty">
      nothing matches — even london has limits.
    </p>
  </main>
</template>

<script setup>
import events from '~/data/events.json'

const scenes = [
  { id: 'music', label: 'music' },
  { id: 'cinema', label: 'cinema' },
  { id: 'art', label: 'art' },
  { id: 'odd', label: 'words & odd' }
]

const windows = [
  { id: 'all', label: 'everything' },
  { id: 'week', label: '7 days' },
  { id: 'fortnight', label: '2 weeks' },
  { id: 'month', label: '30 days' }
]

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const activeScenes = ref([])
const activeWindow = ref('all')
const query = ref('')
const diceId = ref(null)

// `now` is set after mount so static generation and the client agree
// during hydration; date-aware filtering kicks in immediately after.
const now = ref(null)
onMounted(() => { now.value = new Date() })

function toggleScene (id) {
  diceId.value = null
  const i = activeScenes.value.indexOf(id)
  if (i === -1) activeScenes.value.push(id)
  else activeScenes.value.splice(i, 1)
}

const filtered = computed(() => {
  // Sort key: upcoming things by start date; already-running things
  // (exhibitions, seasons) by their closing date, so they surface as
  // "catch it before it goes" rather than hogging the top of the feed.
  const todayISO = now.value ? now.value.toISOString().slice(0, 10) : null
  const key = (e) => (todayISO && e.date < todayISO) ? (e.endDate || todayISO) : e.date
  let list = [...events].sort((a, b) => key(a).localeCompare(key(b)))

  if (now.value) {
    const cutoff = { week: 7, fortnight: 14, month: 30 }[activeWindow.value]
    list = list.filter((e) => {
      const end = new Date((e.endDate || e.date) + 'T23:59:59')
      if (end < now.value) return false // never show the past
      if (!cutoff) return true
      const start = new Date(e.date + 'T00:00:00')
      const horizon = new Date(now.value.getTime() + cutoff * 86400000)
      return start <= horizon
    })
  }

  if (activeScenes.value.length) {
    list = list.filter(e => activeScenes.value.includes(e.scene))
  }

  const q = query.value.trim().toLowerCase()
  if (q) {
    list = list.filter(e =>
      [e.title, e.venue, e.blurb, e.price || '', ...e.tags].join(' ').toLowerCase().includes(q)
    )
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

function rollDice () {
  const pool = filtered.value
  if (!pool.length) return
  const pick = pool[Math.floor(Math.random() * pool.length)]
  diceId.value = pick.id
  nextTick(() => {
    document.querySelector('.spotlight')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2.2rem;
}

.line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.1rem;
  align-items: center;
}

.spacer { flex-grow: 1; }

.pill {
  font-size: 0.8rem;
  color: var(--mut);
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0;
}

.pill:hover { color: var(--ink); }

.pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--scene);
  display: inline-block;
  margin-right: 0.4rem;
  opacity: 0.35;
  transition: opacity 0.12s;
}

.pill.on {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 5px;
}

.pill.on .dot { opacity: 1; }

.pill.quiet { font-size: 0.72rem; }

.dice {
  font-size: 0.78rem;
  color: var(--mut);
}

.dice:hover { color: var(--ink); }

.search {
  font-family: var(--font);
  font-size: 0.85rem;
  border: none;
  border-bottom: 1px solid var(--rule);
  background: transparent;
  padding: 0.45rem 0;
  width: 100%;
  color: var(--ink);
}

.search::placeholder { color: var(--mut); opacity: 0.7; }

.search:focus {
  outline: none;
  border-bottom-color: var(--ink);
}

.month {
  margin: 2.2rem 0 0.4rem;
}

.month:first-of-type { margin-top: 0; }

.spotlight {
  background: var(--hover);
  outline: 1px dashed var(--mut);
  outline-offset: -1px;
}

.empty {
  margin-top: 3rem;
  font-size: 0.85rem;
  color: var(--mut);
}
</style>
