<template>
  <section class="file__container">
    <section class="file__field">
      <input
        :id="name"
        type="file"
        :name="name"
        class="file__input"
        :multiple="multiFile"
        @change="handleFiles($event.target.files)"
      />
      <label class="input__replacement" :for="name"
        ><unicon name="upload" height="16" />
        {{
          label ? label : multiFile ? 'Choose files' : 'Choose a file'
        }}</label
      >
    </section>
    <section class="previews" :class="{ round: roundPreview }">
      <img
        v-for="preview in previews"
        :key="preview.name"
        :src="preview.url"
        :alt="preview.name"
      />
    </section>
  </section>
</template>

<script>
export default {
  props: {
    value: {
      type: File,
      default() {
        return null
      }
    },
    name: {
      type: String,
      default() {
        return 'fileUpload'
      }
    },
    multiFile: {
      type: Boolean,
      default() {
        return false
      }
    },
    roundPreview: {
      type: Boolean,
      default() {
        return false
      }
    },
    hasPreview: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data: () => ({
    label: '',
    previews: []
  }),
  mounted() {
    if (this.hasPreview) {
      this.previews.push(this.hasPreview)
    }
  },
  methods: {
    handleFiles(files) {
      if (files.length > 1) {
        this.label = `${files.length} files`
        ;[...files].forEach((file) => {
          this.previews.push({
            url: URL.createObjectURL(file),
            name: file.name
          })
        })
      } else {
        this.label = files[0].name
        this.$emit('files', files[0])
        this.previews.splice(0, 1, {
          url: URL.createObjectURL(files[0]),
          name: files[0].name
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.file {
  &__input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    left: 0;
    z-index: -1;
  }

  &__container,
  &__field {
    width: 100%;
  }
}
.input__replacement {
  display: block;
  width: 100%;
  padding: 12px 8px;
  background: app-color-level('background', -0.6);
  font-family: $base-font-family;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.previews {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  min-height: 150px;

  img {
    flex: 1 0 32%;
    margin: 0 1%;
    max-height: 150px;
    object-fit: cover;
    border-radius: 4px;
  }

  &.round {
    display: block;
    img {
      display: block;
      margin: 0 auto;
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
  }
}
</style>
