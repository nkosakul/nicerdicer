<template>
  <form class="row flex-center flex" @submit.prevent="handleLogin">
    <div>
      <input
        v-model="loginName"
        class="inputField"
        type="text"
        placeholder="Your username"
      />
    </div>
    <div>
      <input
        v-model="loginPassword"
        class="inputField"
        type="password"
        placeholder="Your password"
      />
    </div>
    <div>
      <input
        type="submit"
        class="button block"
        :value="loading ? 'Loading' : 'Login'"
        :disabled="loading"
      />
    </div>
  </form>

  <form class="row flex-center flex" @submit.prevent="handleSignUp">
    <div>
      <input
        v-model="name"
        class="inputField"
        type="text"
        placeholder="Your username"
      />
    </div>
    <div>
      <input
        v-model="password"
        class="inputField"
        type="password"
        placeholder="Your password"
      />
    </div>
    <div>
      <input
        type="submit"
        class="button block"
        :value="loading ? 'Loading' : 'SignUp'"
        :disabled="loading"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { ref } from 'vue';
import { supabase } from '@/supabase';

export default {
  setup() {
    const gameStore = useGameStore();
    const loading = ref(false);
    const name = ref('');
    const password = ref('');
    const loginName = ref('');
    const loginPassword = ref('');

    const handleLogin = async () => {
      // try to login
      try {
        loading.value = true;

        const {
          data: { user: user },
          error: er,
        } = await supabase.auth.signInWithPassword({
          email: loginName.value + '@xx.xxx',
          password: loginPassword.value,
        });

        if (er) {
          throw er;
        }

        gameStore.setUser(user);
      } catch (error) {
        const e = error as Error;
        alert(e.message);
      } finally {
        loading.value = false;
      }
    };

    const handleSignUp = async () => {
      try {
        // todo implement honey pot
        const { data: data, error: error } = await supabase.auth.signUp({
          email: name.value + '@xx.xxx',
          password: password.value,
        });
        if (error) throw error;

        if (data && 'refresh_token' in data) {
          const {
            data: { user: user },
          } = await supabase.auth.signInWithPassword({
            email: loginName.value + '@xx.xxx',
            password: loginPassword.value,
          });
          gameStore.setUser(user);
          return;
        }

        // todo when it returns a user.
      } catch (error) {
        const e = error as Error;
        alert(e.message);
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      name,
      password,
      loginName,
      loginPassword,
      handleLogin,
      handleSignUp,
    };
  },
};
</script>
