<template>
  <button :type="btnType" class="btn" :class="[control, btnColor]">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    control: Boolean,
    btnType: {
      type: String,
      default() {
        return 'button'
      }
    },
    btnColor: {
      type: String,
      default() {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  border: none;
  background: none;
  padding: 12px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  color: inherit;
  border-radius: 4px;
  margin: 8px 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
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
