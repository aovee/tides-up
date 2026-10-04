<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Échéances',
      type: 'label'
    },
    {
      label: 'Toutes',
      icon: 'i-ph-notification',
      type: 'link',
      trailing: 9
    },
    {
      label: 'En retard',
      icon: 'i-ph-warning',
      type: 'link',
      ui: {
        linkLeadingIcon: 'text-warning'
      },
      trailing: 1
    },
    {
      label: 'À faire maintenant',
      icon: 'i-ph-hourglass-high',
      type: 'link',
      trailing: 5
    },
    {
      label: 'Plus tard',
      icon: 'i-ph-moon-stars',
      type: 'link',
      trailing: 3
    }
  ]
])
</script>

<template>
  <div class="mt-5">
    <div>
      <UNavigationMenu orientation="vertical" :items="items">
        <template #item-trailing="{ item }">
          <UBadge v-if="item.trailing" :label="item.trailing" />
        </template>
      </UNavigationMenu>
    </div>
  </div>
</template>
