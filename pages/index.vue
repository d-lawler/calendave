<template>
  <main>
    <div class="controls">
      <div class="scene-filters">
        <button
          v-for="s in scenes"
          :key="s.id"
          class="filter"
          :class="[`scene-${s.id}`, { on: activeScenes.includes(s.id) }]"
          @click="toggleScene(s.id)"
        >
          {{ s.label }}
        </button>
      </div>

      <div class="row-two">
        <div class="time-filters">
          <button
            v-for="w in windows"
            :key="w.id"
            class="filter small"
            :class="{ on: activeWindow === w.id }"
            @click="activeWindow = w.id"
          >
            {{ w.label }}
          </button>
        </div>
        <button class="dice" title="pick something at random" @click="rollDice">
          🎲 surprise me
        </button>
      </div>

      <input
        v-model="query"
        type="search"
        class="search"
        placeholder="search titles, venues, tags… (try '35mm' or 'noise')"
      >
    </div>

    <p class="count" aria-live="polite">
      {{ filtered.length }} thing{{ filtered.length === 1 ? '' : 's' }} worth leaving the house for
    </p>

    <TransitionGroup name="cards" tag="div" class="grid">
      <EventCard
        v-for="e in filtered"
        :key="e.id"
        :event="e"
        :now="now"
        :class="{ spotlight: diceId === e.id }"
      />
    </TransitionGroup>

    <p v-if="!filtered.length" class="empty">
      nothing matches — even london has limits. clear a filter or two.
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
  { id: 'week', label: 'next 7 days' },
  { id: 'fortnight', label: 'next 2 weeks' },
  { id: 'month', label: 'next 30 days' }
]

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
      [e.title, e.venue, e.blurb, ...e.tags].join(' ').toLowerCase().includes(q)
    )
  }

  return list
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
  gap: 0.7rem;
  margin-bottom: 1.2rem;
}

.scene-filters, .time-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.row-two {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
}

.filter {
  font-family: var(--font-head);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.78rem;
  border: var(--edge);
  background: var(--card);
  padding: 0.4rem 0.95rem;
  box-shadow: 3px 3px 0 var(--ink);
  transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
}

.filter:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--ink); }

.filter.on {
  background: var(--scene, var(--ink));
  color: var(--card);
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--ink);
}

.filter.small {
  font-size: 0.65rem;
  padding: 0.3rem 0.7rem;
}

.filter.small.on { background: var(--ink); }

.dice {
  font-family: var(--font-head);
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.72rem;
  border: var(--edge);
  background: var(--ink);
  color: var(--paper);
  padding: 0.4rem 0.9rem;
  box-shadow: 3px 3px 0 rgba(26, 23, 20, 0.35);
}

.dice:hover { transform: rotate(-2deg) scale(1.04); }

.search {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  border: var(--edge);
  background: var(--card);
  padding: 0.55rem 0.8rem;
  width: 100%;
  box-shadow: inset 2px 2px 0 rgba(26, 23, 20, 0.08);
}

.search:focus { outline: 3px solid var(--ink); outline-offset: -1px; }

.count {
  font-size: 0.7rem;
  font-style: italic;
  color: var(--ink-soft);
  margin: 0 0 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
  gap: 1.1rem;
}

.cards-enter-active, .cards-leave-active { transition: all 0.18s ease; }
.cards-enter-from, .cards-leave-to { opacity: 0; transform: translateY(6px); }
.cards-leave-active { position: absolute; visibility: hidden; }

.spotlight {
  outline: 4px dashed var(--ink);
  outline-offset: 4px;
}

.empty {
  margin-top: 2.5rem;
  font-style: italic;
  color: var(--ink-soft);
}
</style>
