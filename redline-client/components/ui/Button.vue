<template>
  <button :type="btnType" class="btn" :class="[control, btnColor]">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    control: Boolean,
    btnType: String,
    btnColor: String
  }
}
</script>

<style lang="scss" scoped>
.btn {
  border: none;
  background: none;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  color: inherit;
}

.control {
  width: 100%;
}

@each $name, $value in $app-colors {
  .#{$name} {
    background: app-color($name);
    color: app-color('background');

    &:hover,
    &:focus {
      background: app-color-level($name, 2);
    }
  }

  .text-#{$name} {
    color: app-color($name);

    &:hover,
    &:focus {
      color: app-color-level($name, 2);
    }
  }
}
</style>
