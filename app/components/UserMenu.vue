<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { user, clear } = useUserSession()
const colorMode = useColorMode()

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: user.value?.email,
      type: 'label'
    }
  ],
  [
    {
      label: 'Thème',
      icon: colorMode.value === 'light' ? 'i-ph-sun' : 'i-ph-moon',
      children: [
        {
          label: 'Light',
          icon: 'i-ph-sun',
          type: 'checkbox',
          checked: colorMode.value === 'light',
          onSelect(e: Event) {
            e.preventDefault()

            colorMode.preference = 'light'
          }
        },
        {
          label: 'Dark',
          icon: 'i-ph-moon',
          type: 'checkbox',
          checked: colorMode.value === 'dark',
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = 'dark'
            }
          },
          onSelect(e: Event) {
            e.preventDefault()
          }
        }
      ]
    }
  ],
  [
    {
      label: 'Se déconnecter',
      color: 'error' as const,
      icon: 'i-ph-sign-out',
      onClick: async () => {
        await clear()
        await navigateTo('/')
      }
    }
  ]
])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      :label="user?.email.charAt(0).toUpperCase()"
      class="rounded-full"
    />
  </UDropdownMenu>
</template>
