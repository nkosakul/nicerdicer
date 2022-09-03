<template>
  <p>
    <ThePlayer
      ref="playerOne"
      :name="'Player-One'"
      :is-player-turn="isPlayerOneTurn"
      :local-player="localPlayer"
      @played-my-turn="playedMyTurn"
    />
  </p>
  <hr />
  <p>
    <ThePlayer
      ref="playerTwo"
      :name="'Player-Two'"
      :is-player-turn="isPlayerTwoTurn"
      :other-player="otherPlayer"
      @played-my-turn="playedMyTurn"
    />
  </p>
</template>

<script lang="ts">
import { supabase } from '@/supabase';
import { defineComponent } from 'vue';
import ThePlayer from './ThePlayer.vue';

export default defineComponent({
  name: 'TheWorld',
  components: {
    ThePlayer,
  },
  data() {
    return {
      isPlayerOneTurn: true,
      isPlayerTwoTurn: false,
      localPlayer: '',
      otherPlayer: '',
    };
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
  },
  created() {
    const userId = supabase.auth.user()?.id;
    const localSession = JSON.parse(
      localStorage.getItem('supabase.auth.token') || ''
    );
    const localSessionUserId = localSession.currentSession?.user?.id || '';
    if (userId === localSessionUserId) {
      this.localPlayer = localSessionUserId;
    }

    // find other users connected to this game.
  },
});
</script>
