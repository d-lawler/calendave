<template>
  <div class="shell">
    <header class="masthead">
      <NuxtLink to="/" class="logo-link">
        <h1 class="logo">DAVE<span>CAL</span></h1>
      </NuxtLink>
      <p class="strap">a personal radar for leftfield london</p>
      <nav class="nav">
        <NuxtLink to="/" exact-active-class="active">what's on</NuxtLink>
        <NuxtLink to="/venues" exact-active-class="active">the venues</NuxtLink>
      </nav>
    </header>

    <NuxtPage />

    <footer class="footer">
      <p>
        hand-curated · no algorithms were harmed · listings verified
        {{ verifiedDate }} — always check the venue before setting out
      </p>
    </footer>
  </div>
</template>

<script setup>
// Bump this whenever the events data is refreshed
const verifiedDate = 'Aug 2026'
</script>

<style scoped>
.shell {
  max-width: 1060px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem 4rem;
}

.masthead {
  border-bottom: 3px solid var(--ink);
  padding: 1.5rem 0 0.9rem;
  margin-bottom: 1.5rem;
  position: relative;
}

.logo-link { text-decoration: none; }

.logo {
  font-size: clamp(3rem, 10vw, 5.5rem);
  font-weight: 900;
  margin: 0;
  line-height: 0.85;
  letter-spacing: -0.05em;
}

.logo span {
  -webkit-text-stroke: 2px var(--ink);
  color: transparent;
}

.strap {
  margin: 0.5rem 0 1rem;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--ink-soft);
}

.nav {
  display: flex;
  gap: 0.6rem;
}

.nav a {
  font-family: var(--font-head);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  text-decoration: none;
  border: var(--edge);
  padding: 0.35rem 0.9rem;
  background: var(--card);
  box-shadow: 3px 3px 0 var(--ink);
  transition: transform 0.1s, box-shadow 0.1s;
}

.nav a:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--ink);
}

.nav a.active {
  background: var(--ink);
  color: var(--paper);
}

.footer {
  margin-top: 4rem;
  border-top: 3px solid var(--ink);
  padding-top: 0.8rem;
  font-size: 0.7rem;
  color: var(--ink-soft);
}
</style>
