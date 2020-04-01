<template>
  <div class="form__field">
    <label v-if="label" :for="field" class="field__label">{{ label }}</label>
    <span v-if="helper" class="small">{{ helper }}</span>
    <slot />
    <span v-if="error">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    error: String,
    helper: String,
    label: String,
    field: String
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

    input {
      border-color: app-color('primary');
    }
  }

  .field__label {
    display: block;
    font-size: 0.9rem;
    color: app-color-level('foreground', 2);
    transition: all 0.2s ease-in-out;
  }

  .small {
    font-size: 0.8rem;
    color: app-color-level('foreground', 3);
  }

  input {
    border: none;
    background: none;
    padding: 8px 0;
    border-bottom: 1px solid #bcbcbc;
    width: 100%;
    font-size: 1rem;
    font-family: $base-font-family;
  }
}
</style>
