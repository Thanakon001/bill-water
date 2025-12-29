<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Page metadata is now handled in individual pages or layouts
// and global head configuration
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ระบบมิเตอร์น้ำ` : 'ระบบมิเตอร์น้ำ'
  }
})
</script>
