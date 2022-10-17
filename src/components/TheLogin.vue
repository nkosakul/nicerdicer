<template>
  <div class="flex items-center justify-center min-h-full">
    <div class="px-8 py-6 text-left bg-white shadow-lg">
      <form
        v-if="!isSignUpVisibile"
        class="flex-center"
        @submit.prevent="handleLogin"
      >
        <div>
          <label for="loginName" class="labels">Username</label>
          <input
            v-model="loginName"
            class="input-fields"
            type="text"
            placeholder="your username"
            name="loginName"
          />
        </div>
        <div>
          <label for="loginPassword" class="labels">Password</label>
          <input
            v-model="loginPassword"
            class="input-fields"
            type="password"
            placeholder="your password"
            name="loginPassword"
          />
        </div>
        <input
          type="submit"
          class="buttons"
          :value="loading ? 'Loading' : 'Login'"
          :disabled="loading"
        />
      </form>
      <form
        v-if="isSignUpVisibile"
        class="flex-center"
        @submit.prevent="handleSignUp"
      >
        <div>
          <label for="name" class="labels">Username</label>
          <input
            v-model="name"
            class="input-fields"
            type="text"
            placeholder="your username"
            name="name"
          />
        </div>
        <div>
          <label for="name" class="labels">Password</label>
          <input
            v-model="password"
            class="input-fields"
            type="password"
            placeholder="your password"
            name="password"
          />
        </div>
        <div>
          <input
            type="submit"
            class="buttons"
            :value="loading ? 'Loading' : 'Create'"
            :disabled="loading"
          />
        </div>
      </form>
      <button
        class="underline text-sm pt-4 float-right text-gray-400"
        @click="changeForm"
      >
        {{ switchFormText }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import ProfileRepository from '@/repositories/ProfileRepository';

export default {
  data() {
    return {
      isSignUpVisibile: false,
    };
  },
  computed: {
    switchFormText() {
      return this.isSignUpVisibile
        ? 'or to Login >>'
        : 'or create an account >>';
    },
  },
  methods: {
    changeForm() {
      this.isSignUpVisibile = !this.isSignUpVisibile;
    },
  },
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
