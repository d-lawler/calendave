<template>
  <a
    :href="event.url"
    target="_blank"
    rel="noopener"
    class="card"
    :class="`scene-${event.scene}`"
  >
    <div class="topline">
      <span class="scene-chip">{{ sceneLabel }}</span>
      <span v-if="urgency" class="stamp">{{ urgency }}</span>
      <span class="when">{{ whenLabel }}</span>
    </div>
    <h3 class="title">{{ event.title }}</h3>
    <p class="venue">@ {{ event.venue }}<span v-if="event.time"> · {{ event.time }}</span></p>
    <p class="blurb">{{ event.blurb }}</p>
    <div class="bottomline">
      <span v-for="t in event.tags.slice(0, 3)" :key="t" class="tag">#{{ t }}</span>
      <span v-if="event.price" class="price">{{ event.price }}</span>
    </div>
  </a>
</template>

<script setup>
const props = defineProps({
  event: { type: Object, required: true },
  now: { type: Date, default: null }
})

const SCENES = { music: 'music', cinema: 'cinema', art: 'art', odd: 'words & odd' }
const sceneLabel = computed(() => SCENES[props.event.scene] || props.event.scene)

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
  return started ? `until ${fmt(e.endDate)}` : `${fmt(e.date)} → ${fmt(e.endDate)}`
})

const urgency = computed(() => {
  if (!props.now) return null
  const e = props.event
  const start = new Date(e.date + 'T00:00:00')
  const end = new Date((e.endDate || e.date) + 'T23:59:59')
  const dayMs = 86400000
  if (start <= props.now && end >= props.now) {
    if (isRange.value && (end - props.now) < 8 * dayMs) return 'LAST DAYS'
    if (!isRange.value) return 'TODAY'
    return 'ON NOW'
  }
  if (start > props.now && (start - props.now) < 3 * dayMs) return 'SOON'
  return null
})
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  background: var(--card);
  border: var(--edge);
  box-shadow: 4px 4px 0 var(--ink);
  padding: 1rem 1rem 0.9rem;
  text-decoration: none;
  transition: transform 0.12s, box-shadow 0.12s;
  overflow: hidden;
}

.card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 var(--scene);
}

.topline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.topline .when { margin-left: auto; }

.scene-chip {
  font-family: var(--font-head);
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: var(--card);
  background: var(--scene);
  padding: 0.15rem 0.45rem;
}

.when {
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
}

.title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1.1;
}

.venue {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--scene);
  filter: saturate(0.9) brightness(0.85);
}

.blurb {
  margin: 0;
  font-size: 0.74rem;
  line-height: 1.45;
  color: var(--ink-soft);
  flex-grow: 1;
}

.bottomline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: baseline;
  font-size: 0.64rem;
}

.tag { color: var(--ink-soft); }

.price {
  margin-left: auto;
  font-weight: 700;
}

.stamp {
  font-family: var(--font-head);
  font-weight: 900;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--scene);
  border: 2px solid var(--scene);
  padding: 0.08rem 0.35rem;
  transform: rotate(-3deg);
  white-space: nowrap;
}
</style>
