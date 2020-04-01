<template>
  <div class="card">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  box-shadow: 0 5px 10px #00000020;
  padding: 8px 16px;
  margin: 16px 0;
  border-radius: 4px;
  color: app-color('foreground');
  font-weight: 400;
}
</style>
