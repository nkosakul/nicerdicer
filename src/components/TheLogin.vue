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
import { ref } from 'vue';
import ProfileRepository from '@/repositories/ProfileRepository';

export default {
  setup() {
    const loading = ref(false);
    const name = ref('');
    const password = ref('');
    const loginName = ref('');
    const loginPassword = ref('');

    const signIn = async (name: string, password: string) => {
      return await ProfileRepository.signIn(name, password);
    };

    const handleLogin = async () => {
      loading.value = true;
      await signIn(loginName.value, loginPassword.value);
      loading.value = false;
    };

    const handleSignUp = async () => {
      loading.value = true;
      // todo implement honey pot
      const user = await ProfileRepository.signUp(name.value, password.value);

      if (user && 'refresh_token' in user) {
        await signIn(name.value, password.value);
      }
      loading.value = false;
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
