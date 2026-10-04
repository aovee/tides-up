<script setup lang="ts">
useSeoMeta({
  title: 'Nouveau rappel'
})

const loading = ref(false)
const toast = useToast()

async function create(data: ReminderFormState) {
  loading.value = true
  try {
    await $fetch('/api/reminders', { method: 'POST', body: data })
    toast.add({ title: 'Rappel créé', color: 'success' })
    await navigateTo('/')
  } catch (error) {
    toast.add({ title: errorMessage(error), color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <UButton
          color="primary"
          variant="outline"
          icon="i-ph-plus"
          label="Nouveau rappel"
          block
        />

        <RemindersDateFilters />
      </UPageAside>
    </template>

    <UPageHeader
      title="Nouveau rappel"
      description="Tu seras prévenu la veille de la date limite."
      :ui="{ description: 'text-base' }"
    >
      <template #headline>
        <UButton variant="ghost" to="/reminders">
          <UIcon name="i-ph-arrow-left" />
          Retour
        </UButton>
      </template>
    </UPageHeader>

    <UPageBody>
      <UCard variant="soft">
        <RemindersForm mode="create" @submit="create" />
      </UCard>
    </UPageBody>

    <template #right>
      <NotificationsUpcoming />
    </template>
  </UPage>
</template>
