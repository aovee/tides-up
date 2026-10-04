<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const route = useRoute()
const { fetch: refreshSession } = useUserSession()
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    await $fetch('/api/auth/verify', {
      method: 'POST',
      body: { token: String(route.query.token ?? '') }
    })
    await refreshSession()
    await navigateTo('/', { replace: true })
  } catch (e) {
    error.value = errorMessage(e)
  }
})
</script>

<template>
  <UCard class="w-full max-w-sm text-center">
    <div v-if="error" class="space-y-3">
      <UIcon name="i-lucide-link-2-off" class="size-10 text-error" />
      <p>{{ error }}</p>
      <UButton to="/login"> Demander un nouveau lien </UButton>
    </div>
    <div v-else class="flex items-center justify-center gap-2 text-muted">
      <UIcon name="i-lucide-loader-circle" class="animate-spin" />
      Connexion…
    </div>
  </UCard>
</template>
