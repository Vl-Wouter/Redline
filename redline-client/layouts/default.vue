<template>
  <div>
    <Nuxt />
  </div>
</template>

<script>
export default {
  name: 'Default',
}
</script>

<style>
html {
  font-family: 'Muli', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;

  @apply bg-gray-100;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
