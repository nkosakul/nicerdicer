<template>
  <p>
    <ThePlayer
      ref="playerOne"
      :name="'You'"
      :is-player-turn="isPlayerOneTurn"
      :player-id="localPlayer"
      @played-my-turn="playedMyTurn"
    />
  </p>
  <hr />
  <p>
    <ThePlayer
      ref="playerTwo"
      :name="'Player-Two'"
      :is-player-turn="isPlayerTwoTurn"
      :player-id="otherPlayer"
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
import { supabase } from '@/supabase';
import { defineComponent } from 'vue';

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
      otherPlayer: '',
    };
  },
  computed: {
    localPlayer(): string {
      const userId = supabase.auth.user()?.id;
      if (!userId) return '';
      const localSession = LocalStorageRepository.getLocalUserSession();
      const localSessionUserId = localSession?.currentSession?.user?.id || '';

      if (userId === localSessionUserId) {
        return localSessionUserId;
      }

      return '';
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
