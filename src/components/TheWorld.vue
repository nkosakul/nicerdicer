<template>
  <p>
    <ThePlayer
      ref="playerOne"
      :is-player-turn="isPlayerOneTurn"
      :player="localPlayer"
      @played-my-turn="playedMyTurn"
    />
  </p>
  <hr />
  <p>
    <ThePlayer
      ref="playerTwo"
      :is-player-turn="isPlayerTwoTurn"
      :player="otherPlayer"
      @played-my-turn="playedMyTurn"
      @fetch-me-boss="fetchMeBoss"
    />
  </p>
</template>

<script lang="ts">
import ThePlayer from '@/components/ThePlayer.vue';
import LocalStorageRepository from '@/repositories/LocalStorageRepository';
import ProfileRepository from '@/repositories/ProfileRepository';
import { useGameStore } from '@/stores/gameStore';
import { defineComponent } from 'vue';
import type { User } from '@supabase/supabase-js';

export default defineComponent({
  name: 'TheWorld',
  components: {
    ThePlayer,
  },
  data() {
    return {
      isPlayerOneTurn: true,
      isPlayerTwoTurn: false,
      gameStore: useGameStore(),
      otherPlayer: null,
    };
  },
  computed: {
    localPlayer(): User | null {
      const localSession = LocalStorageRepository.getLocalUserSession();
      const localSessionUser = localSession?.currentSession?.user || null;

      return localSessionUser;
    },
  },
  methods: {
    playedMyTurn() {
      if (this.isPlayerOneTurn) {
        this.isPlayerOneTurn = false;
        this.isPlayerTwoTurn = true;
        return;
      }

      if (this.isPlayerTwoTurn) {
        this.isPlayerOneTurn = true;
        this.isPlayerTwoTurn = false;
        return;
      }
    },
    async fetchOtherPlayer() {
      // find other users connected to this game.
      const _game_id = this.gameStore.game?.id;
      const otherplayer = await ProfileRepository.getOtherPlayer(
        _game_id,
        this.gameStore.user?.id
      ).then(_ => _);

      if (!otherplayer) return;

      this.otherPlayer = otherplayer;
      return otherplayer;
    },
    async fetchMeBoss() {
      await this.fetchOtherPlayer();
    },
  },
  watch: {
    async isPlayerOneTurn() {
      return 1;
    },
  },
});
</script>
