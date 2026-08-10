<template>
  <div class="shell">
    <header class="masthead">
      <NuxtLink to="/" class="brand">Calendave</NuxtLink>
      <nav class="nav">
        <NuxtLink to="/" exact-active-class="active">what's on</NuxtLink>
        <NuxtLink to="/venues" exact-active-class="active">venues</NuxtLink>
      </nav>
    </header>

    <NuxtPage />
  </div>
</template>

<style scoped>
.shell {
  max-width: 780px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}

.masthead {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3rem;
}

.brand {
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 1.4rem;
}

.nav a {
  font-size: 0.8rem;
  color: var(--mut);
  text-decoration: none;
}

.nav a:hover { color: var(--ink); }

.nav a.active {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 5px;
}
</style>
