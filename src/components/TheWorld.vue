<template>
  <p>
    <ThePlayer
      ref="playerOne"
      :is-player-turn="localPlayerTurn"
      :other-player="otherPlayer"
      :player="localPlayer"
      @played-my-turn="playedMyTurn"
    />
  </p>
  <hr />
  <p>
    <ThePlayer
      v-if="otherPlayer"
      ref="playerTwo"
      :is-player-turn="otherPlayerTurn"
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
import GameProfileBoardRepository from '@/repositories/GameProfileBoardRepository';

export default defineComponent({
  name: 'TheWorld',
  components: {
    ThePlayer,
  },
  data() {
    return {
      gameStore: useGameStore(),
      otherPlayer: null,
      localPlayerTurn: true,
      otherPlayerTurn: false,
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
    async playedMyTurn(data: { player: string; is_turn: boolean }) {
      const playerId = data.player;
      const isTurn = data.is_turn;

      if (this.localPlayer.id === playerId) {
        this.localPlayerTurn = isTurn;
        this.otherPlayerTurn = !isTurn;
      } else {
        this.localPlayerTurn = !isTurn;
        this.otherPlayerTurn = isTurn;
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
    async fetchPlayersTurns() {
      this.localPlayerTurn = await GameProfileBoardRepository.fetchTurn(
        this.localPlayer.id,
        this.gameStore.game?.id
      );

      this.otherPlayerTurn = !this.localPlayerTurn;
    },
  },
  async created() {
    await this.fetchOtherPlayer();
    await this.fetchPlayersTurns();
  },
});
</script>
