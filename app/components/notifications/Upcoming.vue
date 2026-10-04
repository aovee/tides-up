<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const items = [
  {
    title: 'Brosse  dents',
    description: 'dim. 27 septembre · 19:00'
  },
  {
    title: 'Draps',
    description: 'jeu. 1er octbre · 10:00'
  }
] satisfies TimelineItem[]
</script>

<template>
  <div
    class="hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-var(--ui-header-height))] lg:sticky lg:top-(--ui-header-height) py-8 lg:ps-4 lg:-ms-4"
  >
    <div class="flex items-center gap-2 font-semibold text-lg mb-5">
      <UIcon name="i-ph-bell-ringing" class="text-primary" />
      Prochaines notifications
    </div>

    <UTimeline
      :items="items"
      size="xs"
      class="w-full ps-1"
      :ui="{
        indicator: 'size-2 bg-primary mt-1.5',
        wrapper: 'mt-0'
      }"
    />
  </div>
</template>
