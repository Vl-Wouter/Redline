<template>
  <div class="alert" :class="type">
    <p>
      <span class="type">{{ type }}:</span>&nbsp;<slot />
    </p>
    <button @click="$emit('removeError')"><unicon name="times" /></button>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info',
      validator(value) {
        return ['warning', 'error', 'info', 'success'].includes(value) !== -1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  line-height: 48px;
  box-shadow: 0 5px 10px rgba(179, 47, 47, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .type {
    font-weight: 700;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
  }
}

.error {
  background: rgb(247, 189, 189);
  color: rgb(88, 29, 29);

  button.unicon {
    fill: inherit;
  }
}
</style>
