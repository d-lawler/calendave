<template>
  <main>
    <h2 class="heading">The rooms that matter</h2>
    <p class="intro">
      the evergreen backbone — where to look when the listings run dry.
      grouped loosely; the best rooms refuse categories anyway.
    </p>

    <div class="grid">
      <a
        v-for="v in venues"
        :key="v.name"
        :href="v.url"
        target="_blank"
        rel="noopener"
        class="venue"
        :class="`scene-${v.scenes[0]}`"
      >
        <div class="head">
          <h3>{{ v.name }}</h3>
          <span class="area">{{ v.area }}</span>
        </div>
        <p class="note">{{ v.note }}</p>
        <div class="chips">
          <span v-for="s in v.scenes" :key="s" class="chip" :class="`scene-${s}`">
            {{ s === 'odd' ? 'words & odd' : s }}
          </span>
        </div>
      </a>
    </div>
  </main>
</template>

<script setup>
import venues from '~/data/venues.json'
</script>

<style scoped>
.heading {
  font-size: 1.6rem;
  font-weight: 900;
  margin: 0 0 0.3rem;
}

.intro {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--ink-soft);
  margin: 0 0 1.4rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.venue {
  background: var(--card);
  border: var(--edge);
  box-shadow: 4px 4px 0 var(--ink);
  padding: 0.9rem 1rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  transition: transform 0.12s, box-shadow 0.12s;
}

.venue:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 var(--scene);
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.head h3 { margin: 0; font-size: 0.98rem; font-weight: 900; }

.area {
  font-size: 0.64rem;
  font-weight: 700;
  white-space: nowrap;
  color: var(--ink-soft);
}

.note {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.45;
  color: var(--ink-soft);
  flex-grow: 1;
}

.chips { display: flex; gap: 0.35rem; flex-wrap: wrap; }

.chip {
  font-family: var(--font-head);
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.56rem;
  letter-spacing: 0.08em;
  color: var(--card);
  background: var(--scene);
  padding: 0.12rem 0.4rem;
}
</style>
