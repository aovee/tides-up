<script setup lang="ts">
import {
  type CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate
} from '@internationalized/date'

const date = defineModel<string | null>('date')

const props = defineProps<{
  min?: string
  max?: string
}>()

const dateModel = computed<CalendarDate | null>({
  get: () => (date.value ? parseDate(date.value) : null),
  set: (v) => {
    date.value = v ? v.toString() : null
  }
})

const minValue = computed(() => (props.min ? parseDate(props.min) : undefined))
const maxValue = computed(() => (props.max ? parseDate(props.max) : undefined))

const df = new DateFormatter('fr-FR', {
  dateStyle: 'medium'
})
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
      {{
        dateModel
          ? df.format(dateModel.toDate(getLocalTimeZone()))
          : 'Choisir une date'
      }}
    </UButton>

    <template #content>
      <UCalendar
        v-model="dateModel"
        :min-value="minValue"
        :max-value="maxValue"
        class="p-2"
      />
    </template>
  </UPopover>
</template>
