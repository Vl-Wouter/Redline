<template>
  <section class="w-full">
    <p class="text-xs text-gray-700">Only .png, .jpg, .gif files are allowed</p>
    <input
      :id="name"
      type="file"
      :name="name"
      class="invisible absolute w-0 h-0"
      :multiple="allowMultiple"
      @change="handleFiles($event.target.files)"
    />
    <label v-if="labelElement" :for="name"><slot /></label>
    <label
      v-if="labelText"
      :for="name"
      class="w-full px-4 py-2 rounded bg-redline text-white cursor-pointer"
    >
      <font-awesome-icon icon="upload" class="mr-2" />
      {{
        labelContent
          ? labelContent
          : allowMultiple
          ? 'Choose files'
          : 'Choose a file'
      }}</label
    >
  </section>
</template>

<script>
export default {
  props: {
    value: {
      type: File,
      default() {
        return null
      },
    },
    name: {
      type: String,
      default: 'fileUpload',
    },
    allowMultiple: {
      type: Boolean,
      default: false,
    },
    labelElement: {
      type: Boolean,
      default: false,
    },
    labelText: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      labelContent: null,
    }
  },
  methods: {
    handleFiles(files) {
      if (files.length < 1) {
        return
      }
      if (files.length > 1) {
        this.labelContent = `${files.length} files`
        this.$emit('files', files)
      } else {
        this.labelContent = files[0].name
        this.$emit('files', files[0])
      }
    },
  },
}
</script>
