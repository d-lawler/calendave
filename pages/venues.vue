<template>
  <main>
    <p class="intro">
      the evergreen backbone — where to look when the listings run dry.
    </p>

    <a
      v-for="v in venues"
      :key="v.name"
      :href="v.url"
      target="_blank"
      rel="noopener"
      class="row"
      :class="`scene-${v.scenes[0]}`"
    >
      <span class="side">
        <i class="dot" />{{ v.area }}
      </span>
      <span class="body">
        <span class="name">{{ v.name }}</span>
        <span class="note">{{ v.note }}</span>
      </span>
    </a>
  </main>
</template>

<script setup>
import venues from '~/data/venues.json'
</script>

<style scoped>
.intro {
  font-size: 0.85rem;
  color: var(--mut);
  margin: 0 0 2rem;
}

.row {
  display: grid;
  grid-template-columns: 8.5rem 1fr;
  gap: 1.25rem;
  padding: 0.85rem 0.5rem;
  margin: 0 -0.5rem;
  text-decoration: none;
  border-bottom: 1px solid var(--rule);
  transition: background 0.12s;
}

.row:hover { background: var(--hover); }

.side {
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--mut);
  padding-top: 0.15rem;
  display: flex;
  align-items: baseline;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--scene);
  display: inline-block;
  margin-right: 0.45rem;
  flex-shrink: 0;
  align-self: center;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.name {
  font-weight: 550;
  font-size: 0.92rem;
  letter-spacing: -0.01em;
}

.row:hover .name { color: var(--scene); }

.note {
  font-size: 0.78rem;
  color: var(--mut);
  line-height: 1.55;
}

@media (max-width: 560px) {
  .row { grid-template-columns: 1fr; gap: 0.3rem; }
}
</style>
