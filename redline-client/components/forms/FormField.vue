<template>
  <div class="form__field">
    <label v-if="label" :for="field" class="field__label">{{ label }}</label>
    <span v-if="helper" class="small">{{ helper }}</span>
    <slot />
    <span v-show="error" class="error">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: String,
      default() {
        return null
      }
    },
    helper: {
      type: String,
      default() {
        return ''
      }
    },
    label: {
      type: String,
      default() {
        return ''
      }
    },
    field: {
      type: String,
      default() {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form__field {
  // background: lightblue;
  border-radius: 4px;
  width: 100%;
  margin: 16px 0;

  &:focus-within {
    .field__label {
      color: app-color('primary');
      transition: all 0.2s ease-in-out;
    }

    // input {
    //   border-color: app-color('primary');
    // }
  }

  .error {
    font-size: 0.9rem;
    color: app-color('error');
  }

  .field__label {
    display: block;
    font-size: 1rem;
    color: app-color-level('foreground', 0.5);
    transition: all 0.2s ease-in-out;
  }

  .small {
    font-size: 0.8rem;
    color: app-color-level('foreground', 3);
    margin-bottom: 8px;
    display: block;
  }

  label {
    margin-bottom: 4px;
  }
}
</style>
