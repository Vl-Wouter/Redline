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
  background: app-color-level('background', -0.4);
  padding: 12px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  color: inherit;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &:only-child {
    margin: 0;
  }

  .unicon {
    height: 16px;
    fill: currentColor;
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
    background: none;
    color: app-color($name);

    &:hover,
    &:focus {
      color: app-color-level($name, 2);
    }
  }
}
</style>
