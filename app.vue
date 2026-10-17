<template>
  <div class="shell">
    <header class="masthead">
      <div class="bar">
        <NuxtLink to="/" class="brand">Calendave</NuxtLink>
        <nav class="nav">
          <NuxtLink to="/" exact-active-class="active">what's on</NuxtLink>
          <NuxtLink to="/venues" exact-active-class="active">venues</NuxtLink>
        </nav>
        <div v-if="route.path === '/'" class="filters">
          <button
            v-for="s in scenes"
            :key="s.id"
            class="pill"
            :class="[`scene-${s.id}`, { on: activeScenes.includes(s.id) }]"
            @click="toggleScene(s.id)"
          >
            <i class="dot" />{{ s.label }}
          </button>
        </div>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>

<script setup>
const route = useRoute()

const scenes = [
  { id: 'music', label: 'music' },
  { id: 'cinema', label: 'cinema' },
  { id: 'art', label: 'art' },
  { id: 'odd', label: 'words' }
]

// Shared with pages/index.vue, which does the filtering.
const activeScenes = useState('activeScenes', () => [])

function toggleScene (id) {
  const i = activeScenes.value.indexOf(id)
  if (i === -1) activeScenes.value.push(id)
  else activeScenes.value.splice(i, 1)
}
</script>

<style scoped>
.shell {
  max-width: 780px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}

.masthead {
  margin-bottom: 2.4rem;
}

.brand {
  margin-right: -1.6rem; /* cancel the bar's column gap */
  /* same width as the event card's date column + gap, so the tabs
     line up with event titles */
  flex: 0 0 9.75rem;
  /* matches EventCard .title */
  font-weight: 550;
  font-size: 0.92rem;
  letter-spacing: -0.01em;
  text-decoration: none;
  padding: 0.55rem 0;
}

.bar {
  display: flex;
  align-items: baseline;
  column-gap: 1.6rem;
  border-bottom: 1px solid var(--rule);
}

.nav {
  display: flex;
  gap: 1.6rem;
}

.nav a {
  font-size: 0.82rem;
  color: var(--mut);
  text-decoration: none;
  padding: 0.55rem 0;
  transition: color 0.12s;
}

.nav a:hover { color: var(--ink); }

.nav a.active { color: var(--ink); }

.filters {
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 1.1rem;
}

.pill {
  font-size: 0.8rem;
  color: var(--mut);
  display: inline-flex;
  align-items: center;
  transition: color 0.12s;
}

.pill:hover,
.pill.on { color: var(--ink); }

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

.pill.on .dot { opacity: 1; }

/* phones: wordmark on its own line, tabs and categories share the next */
@media (max-width: 640px) {
  .bar {
    flex-wrap: wrap;
    column-gap: 0.7rem;
  }

  .brand {
    flex-basis: 100%;
    margin-right: 0;
    padding-bottom: 0.2rem;
  }

  .nav { gap: 0.7rem; }

  .filters {
    flex-wrap: nowrap;
    gap: 0.7rem;
  }

  .nav a,
  .pill { font-size: 0.75rem; }

  .pill .dot { margin-right: 0.3rem; }
}

@media (max-width: 380px) {
  .bar,
  .nav,
  .filters { column-gap: 0.55rem; }

  .nav a,
  .pill { font-size: 0.7rem; }
}
</style>
