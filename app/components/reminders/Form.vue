<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { RadioGroupItem } from '@nuxt/ui'

export interface ReminderFormState {
  name: string
  categoryId: number | null
  kind: 'recurring' | 'once'
  minInterval: number | null
  maxInterval: number | null
  unit: IntervalUnit
  lastDoneOn: string | null
  dueOn: string | null
  notifyDaysBefore: number
  notifyOnWindowOpen: boolean
  note: string | null
}

const props = defineProps<{
  mode: 'create' | 'edit'
  initial?: Partial<ReminderFormState>
  loading?: boolean
}>()

const schema =
  props.mode === 'create' ? createReminderSchema : updateReminderSchema

const { data: categories } = await useFetch<Category[]>('/api/categories', {
  default: () => []
})

const emit = defineEmits<{ submit: [ReminderFormState] }>()

const state = reactive<ReminderFormState>({
  name: '',
  categoryId: null,
  kind: 'recurring',
  minInterval: 1,
  maxInterval: 2,
  unit: 'month',
  lastDoneOn: todayIso(),
  dueOn: null,
  notifyDaysBefore: 1,
  notifyOnWindowOpen: false,
  note: null,
  ...props.initial
})

const categoryModel = computed({
  get: () => state.categoryId ?? null,
  set: (v: number) => {
    state.categoryId = v === null ? null : v
  }
})

const categoryItems = computed<RadioGroupItem[]>(() => {
  return categories.value.map((i) => {
    return {
      label: i.name,
      value: i.id,
      icon: i.icon
    }
  })
})

const kindItems = [
  {
    label: 'Récurrent',
    value: 'recurring',
    description: 'Entre X et Y après la dernière fois'
  },
  {
    label: 'Date unique',
    value: 'once',
    description: 'Un rdv ponctuel, une échéance'
  }
]
const unitItems = (Object.keys(UNIT_LABELS) as IntervalUnit[]).map((value) => ({
  label: UNIT_LABELS[value][1],
  value
}))

const handleSubmit = async () => {
  emit('submit', { ...state, note: state.note?.trim() || null })
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-5"
    @submit="handleSubmit"
  >
    <UFormField label="Quoi" class="w-full" name="name" required>
      <UInput
        v-model="state.name"
        placeholder="Brosse à dents, draps, injection"
        class="w-full"
        autofocus
      />
    </UFormField>

    <UFormField label="Catégorie" name="categoryId" class="w-full">
      <URadioGroup
        v-model="categoryModel"
        :items="categoryItems"
        color="primary"
        variant="table"
        orientation="horizontal"
        default-value="system"
        size="sm"
        :ui="{ wrapper: 'flex-row' }"
        indicator="hidden"
      >
      </URadioGroup>
    </UFormField>

    <UFormField label="Type" name="kind">
      <URadioGroup
        v-model="state.kind"
        :items="kindItems"
        variant="card"
        orientation="horizontal"
      />
    </UFormField>

    <template v-if="state.kind === 'recurring'">
      <UFormField
        label="Entre chaque fois"
        class="w-full"
        help="Minimum : pas avant. Maximum : la date limite."
      >
        <div class="flex items-center gap-3">
          <UInputNumber v-model="state.minInterval" :min="0" placeholder="7" />
          à
          <UInputNumber v-model="state.maxInterval" :min="0" placeholder="14" />

          <USelect v-model="state.unit" :items="unitItems" class="min-w-40" />
        </div>
      </UFormField>

      <UFormField
        v-if="mode === 'create'"
        label="Dernière fois"
        name="lastDoneOn"
        required
      >
        <FormDatepicker v-model:date="state.lastDoneOn" :max="todayIso()" />
      </UFormField>
    </template>

    <UFormField v-else label="Date" name="dueOn" required>
      <FormDatepicker v-model:date="state.dueOn" />
    </UFormField>

    <USeparator />

    <div class="flex items-center gap-2 font-semibold text-sm mb-5">
      <UIcon name="i-ph-bell-ringing" class="text-primary" />
      Notifications
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <UFormField name="notifyDaysBefore">
        <div class="flex items-center gap-3">
          <UInputNumber
            v-model="state.notifyDaysBefore"
            placeholder="1"
            class="w-28"
            :min="0"
          />
          jour(s) avant la date limite
        </div>
      </UFormField>

      <UFormField v-if="state.kind === 'recurring'" name="notifyOnWindowOpen">
        <USwitch
          v-model="state.notifyOnWindowOpen"
          label="Prévenir aussi à le jour J"
          description="« Tu peux le faire à partir d'aujourd'hui »"
        />
      </UFormField>
    </div>

    <UFormField label="Note" name="note">
      <UTextarea
        :model-value="state.note ?? undefined"
        @update:model-value="state.note = $event || null"
        :rows="2"
        autoresize
        class="w-full"
        placeholder="Exemple : 'Pense à prendre le code de la porte'"
      />
    </UFormField>

    <USeparator />

    <div class="flex items-center justify-end gap-3">
      <UButton
        label="Annuler"
        icon="i-ph-caret-left"
        color="neutral"
        to="/reminders"
      />
      <UButton
        type="submit"
        icon="i-ph-checks"
        color="primary"
        :loading="loading"
        :label="mode === 'create' ? 'Créer le rappel' : 'Enregistrer'"
      />
    </div>
  </UForm>
</template>
