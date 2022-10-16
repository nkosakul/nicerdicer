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
      v-if="otherPlayer"
      ref="playerTwo"
      :is-player-turn="isPlayerTwoTurn"
      :player="otherPlayer"
      @played-my-turn="playedMyTurn"
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
import type { Profile } from '@/d';

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
    localPlayer(): User & Profile {
      const localSession = LocalStorageRepository.getLocalUserSession();

      if (!localSession) throw new Error();
      const localSessionUser = localSession?.user;

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
  },
  watch: {
    async isPlayerOneTurn() {
      return 1;
    },
  },
  async created() {
    await this.fetchOtherPlayer();
  },
});
</script>
