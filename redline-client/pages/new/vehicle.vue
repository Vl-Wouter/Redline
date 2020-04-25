<template>
  <main>
    <header>
      <back-link />
      <h2>Add vehicles to your account.</h2>
    </header>
    <main>
      <form
        method="POST"
        @submit.prevent="addVehicle"
        enctype="multipart/form-data"
      >
        <p>Add a vehicle to your profile using this form!</p>
        <form-field
          label="Brand"
          field="brand"
          helper="e.g. BMW, Ford, Audi, ..."
        >
          <text-input name="brand" v-model="form.brand" />
        </form-field>
        <form-field label="Model" field="model"
          ><text-input name="model" v-model="form.model"
        /></form-field>
        <form-field label="Photo" field="photo">
          <file-input
            name="photo"
            @files="
              (photo) => {
                form.photo = photo
              }
            "
          />
        </form-field>
        <v-button btn-type="submit" class="primary control"
          >Add vehicle</v-button
        >
      </form>
    </main>
  </main>
</template>

<script>
import BackLink from '~/components/ui/BackLink'
import { FormField, TextInput, FileInput } from '~/components/forms'
import Button from '~/components/ui/Button'
export default {
  layout: 'no_nav',
  middleware: ['authenticated'],
  components: {
    BackLink,
    FormField,
    TextInput,
    FileInput,
    'v-button': Button
  },
  data: () => ({
    vehicles: [],
    form: {
      brand: '',
      model: '',
      photo: ''
    }
  }),
  methods: {
    async addVehicle() {
      const formData = new FormData()
      Object.keys(this.form).forEach((key) => {
        formData.append(key, this.form[key])
      })
      try {
        await this.$store.dispatch('user/addVehicle', formData)
      } catch (error) {
        console.log(error.response ? error.response.data : error)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
