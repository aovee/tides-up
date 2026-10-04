<script setup lang="ts">
const { data: reminders } = useFetch<Reminder[]>('/api/reminders', {
  default: () => []
})

const { data: categories } = await useFetch<Category[]>('/api/categories', {
  default: () => []
})

interface ReminderWithCategory extends Reminder {
  category?: Category
}

const initialReminderGroups: Record<ReminderStatus, ReminderWithCategory[]> = {
  early: [],
  due: [],
  late: []
}

const remindersByStatus = computed<
  Record<ReminderStatus, ReminderWithCategory[]>
>(() => {
  const grouped = { ...initialReminderGroups }

  reminders.value.forEach((reminder) => {
    const scheduleReminder = computeSchedule(reminder)
    const reminderWithCategory: ReminderWithCategory = {
      ...reminder,
      category: categories.value.find((c) => c.id === reminder.categoryId)
    }

    grouped[scheduleReminder.status].push(reminderWithCategory)
  })

  return grouped
})
</script>

<template>
  <div class="grid gap-5">
    <div v-for="(group, status) in remindersByStatus" :key="status">
      <div class="text-highlighted text-sm flex items-center gap-2">
        {{ getStatusLabel(status) }}
        <UBadge :label="group.length" color="primary" size="sm" />
      </div>

      <UPageGrid class="mt-5">
        <UCard
          v-for="(reminder, reminderIndex) in group"
          :key="reminderIndex"
          :to="`/reminders/${reminder.id}`"
          :ui="{ body: 'grid gap-3' }"
        >
          <div class="flex items-center gap-2 text-sm">
            <UIcon
              :name="reminder.category?.icon || 'i-ph-bell'"
              size="sm"
              class="text-primary"
            />
            <div class="text-muted">
              {{ reminder.category?.name || 'Sans catégorie' }}
            </div>
          </div>

          <div class="text-highlighted font-semibold">
            {{ reminder.name }}
          </div>
        </UCard>
      </UPageGrid>
    </div>
  </div>
</template>
