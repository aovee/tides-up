<script setup lang="ts">
useSeoMeta({
  title: 'Nouveau rappel'
})
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
        <RemindersForm mode="create" />
      </UCard>
    </UPageBody>

    <template #right>
      <NotificationsUpcoming />
    </template>
  </UPage>
</template>
