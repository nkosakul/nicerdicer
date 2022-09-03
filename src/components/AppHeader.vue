<template>
  <header class="py-4 bg-ci">
    <div class="container flex items-center justify-between text-white">
      <p>TODO: LOGO</p>
      <nav aria-labelledby="nav-label">
        <span id="nav-label" class="sr-only">Main Navigation</span>
        <ul class="flex items-center gap-6">
          <li>
            <router-link :to="{ name: 'home' }">Home</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'manual' }">How to play?</router-link>
          </li>

          <!-- this is only for developing -->
          <li>
            <router-link :to="{ name: 'game', params: { gameId: 'dev' } }"
              >Gameboard</router-link
            >
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
