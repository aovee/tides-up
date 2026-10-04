<script setup lang="ts">
useSeoMeta({
  title: 'Vos rappels'
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
          to="/reminders/new"
        />

        <RemindersDateFilters />
      </UPageAside>
    </template>

    <UPageHeader
      headline="Toutes les échéances"
      title="Rappels"
      description="1 en retard · 5 à faire · prochaine notification dim. 27 septembre"
      :ui="{ description: 'text-base' }"
    />

    <UPageBody>
      <RemindersList />
    </UPageBody>

    <template #right>
      <NotificationsUpcoming />
    </template>
  </UPage>
</template>
