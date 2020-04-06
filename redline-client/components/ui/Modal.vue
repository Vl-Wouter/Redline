<template>
  <div class="modal__background">
    <div class="modal__block">
      <slot />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.modal__background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #00000080;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal__block {
  background: app-color('background');
  border-radius: 4px;
  padding: 16px;
}
</style>
