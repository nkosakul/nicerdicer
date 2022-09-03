<template>
  <header class="flex items-center justify-between">
    <p>TODO: LOGO</p>
    <nav aria-labelledby="nav-label">
      <span id="nav-label" class="sr-only">Main Navigation</span>
      <ul class="flex items-center gap-6">
        <li>
          <router-link :to="{ name: 'home' }">Home?</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'manual' }">How to play?</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
