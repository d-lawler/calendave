<template>
  <a
    :href="event.url"
    target="_blank"
    rel="noopener"
    class="row"
    :class="`scene-${event.scene}`"
  >
    <span class="date">
      {{ whenLabel }}
      <em v-if="urgency" class="urgency">{{ urgency }}</em>
    </span>
    <span class="body">
      <span class="title">{{ event.title }}</span>
      <span class="meta">
        <i class="dot" />{{ event.venue }}<template v-if="event.time"> · {{ event.time }}</template><template v-if="event.price"> · {{ event.price }}</template>
      </span>
      <span class="blurb">{{ event.blurb }}</span>
    </span>
  </a>
</template>

<script setup>
const props = defineProps({
  event: { type: Object, required: true },
  now: { type: Date, default: null }
})

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function fmt (iso) {
  const d = new Date(iso + 'T12:00:00')
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

const isRange = computed(() => !!props.event.endDate && props.event.endDate !== props.event.date)

const whenLabel = computed(() => {
  const e = props.event
  if (!isRange.value) return fmt(e.date)
  const started = props.now && new Date(e.date + 'T00:00:00') <= props.now
  return started ? `until ${fmt(e.endDate)}` : `${fmt(e.date)} – ${fmt(e.endDate)}`
})

const urgency = computed(() => {
  if (!props.now) return null
  const e = props.event
  const start = new Date(e.date + 'T00:00:00')
  const end = new Date((e.endDate || e.date) + 'T23:59:59')
  const dayMs = 86400000
  if (start <= props.now && end >= props.now) {
    if (isRange.value && (end - props.now) < 8 * dayMs) return 'last days'
    if (!isRange.value) return 'today'
    return 'on now'
  }
  if (start > props.now && (start - props.now) < 3 * dayMs) return 'soon'
  return null
})
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 8.5rem 1fr;
  gap: 1.25rem;
  padding: 0.9rem 0;
  text-decoration: none;
  border-bottom: 1px solid var(--rule);
  transition: background 0.12s;
}

.row:hover { background: var(--hover); }

.date {
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--mut);
  padding-top: 0.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.urgency {
  font-style: normal;
  font-size: 0.66rem;
  color: var(--scene);
}

.body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.title {
  font-weight: 550;
  font-size: 0.92rem;
  letter-spacing: -0.01em;
}

.row:hover .title { color: var(--scene); }

.meta {
  font-size: 0.76rem;
  color: var(--mut);
  display: flex;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--scene);
  display: inline-block;
  margin-right: 0.45rem;
  flex-shrink: 0;
}

.blurb {
  font-size: 0.78rem;
  color: var(--mut);
  line-height: 1.55;
  margin-top: 0.15rem;
}

@media (max-width: 640px) {
  .row { grid-template-columns: 1fr; gap: 0.3rem; }
  .date { flex-direction: row; gap: 0.6rem; }
}
</style>
