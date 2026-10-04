<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const state = reactive({ email: '' })
const sent = ref(false)
const loading = ref(false)
const toast = useToast()

async function submit() {
  loading.value = true
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: state })
    sent.value = true
  } catch (error) {
    toast.add({ title: errorMessage(error), color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-sm">
    <template #header>
      <div class="flex items-center gap-2">
        <AppLogo />
      </div>
    </template>

    <div v-if="sent" class="space-y-2 text-center">
      <UIcon name="i-lucide-mail-check" class="size-10 text-primary" />
      <p>
        Un lien de connexion a été envoyé à <strong>{{ state.email }}</strong
        >.
      </p>
      <p class="text-sm text-muted">Il est valable 15 minutes.</p>
      <UButton variant="link" @click="sent = false">
        Changer d'adresse
      </UButton>
    </div>

    <UForm
      v-else
      :schema="loginSchema"
      :state="state"
      class="space-y-4"
      @submit="submit"
    >
      <UFormField label="Adresse e-mail" name="email">
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="toi@exemple.fr"
          class="w-full"
          autofocus
        />
      </UFormField>
      <UButton type="submit" block :loading="loading">
        Recevoir un lien de connexion
      </UButton>
    </UForm>
  </UCard>
</template>
