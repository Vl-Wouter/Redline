<template>
  <main class="min-h-screen bg-gray-100">
    <header
      class="sticky top-0 z-10 w-full shadow-sm py-2 px-4 flex flex-row justify-between lg:justify-center lg:space-x-48 items-center bg-white"
    >
      <nuxt-link to="/" class="block text-redline">
        {{ steps.current > 1 ? 'Back' : 'Cancel' }}
      </nuxt-link>
      <p class="text-gray-700">Step {{ steps.current }} of {{ steps.total }}</p>
    </header>
    <main class="container mx-auto">
      <form
        method="post"
        class="lg:w-1/2 lg:mx-auto px-4"
        @submit.prevent="submit"
      >
        <f-group
          label="Seach by VIN"
          field="vin"
          helper="Searching by VIN allows us to pre-fill the information about your vehicle"
        >
          <input id="vin" v-model="vin" type="text" name="vin" />
        </f-group>
        <div class="my-2 border-b"></div>
        <f-group label="Make" field="make" helper="e.g. Ford, Audi, BMW, ...">
          <input id="make" v-model="form.make" type="text" name="make" />
        </f-group>
        <f-group label="Model" field="model"
          ><input id="model" v-model="form.model" type="text" name="model"
        /></f-group>
        <f-group label="Year" field="year"
          ><input id="year" v-model="form.year" type="text" name="year"
        /></f-group>
        <f-group
          label="Photo"
          field="photo"
          helper="Show off your car with a beautiful photo"
        >
          <file-input
            name="photo"
            label-element
            @files="
              (fileData) => {
                form.photo = fileData
              }
            "
          >
            <div
              class="w-full h-40 rounded bg-gray-400 flex justify-center items-center overflow-hidden cursor-pointer"
            >
              <img
                v-if="photoString"
                :src="photoString"
                alt="Header"
                class="w-full h-full object-cover"
              />
              <div v-else class="text-gray-700 text-center">
                <font-awesome-icon icon="images" class="text-2xl" />
                <p>Click to choose an image</p>
              </div>
            </div></file-input
          >
        </f-group>
        <button
          type="submit"
          class="w-full bg-redline my-4 py-2 rounded text-white"
        >
          Add vehicle
        </button>
      </form>
    </main>
  </main>
</template>

<script>
import ContentFormGroup from '~/components/ContentFormGroup'
import FileInput from '~/components/FileInput'
export default {
  middleware: 'auth',
  components: {
    'f-group': ContentFormGroup,
    FileInput,
  },
  data() {
    return {
      steps: {
        total: 1,
        current: 1,
      },
      form: {
        make: '',
        model: '',
        year: '',
        made_in: '',
        photo: '',
      },
      vin: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
    photoString() {
      if (!this.form.photo) return null
      return URL.createObjectURL(this.form.photo)
    },
  },
  methods: {
    async submit() {
      const formData = new FormData()
      Object.keys(this.form).forEach((key) => {
        formData.append(key, this.form[key])
      })

      try {
        await this.$store.dispatch('user/addVehicle', formData)
        return this.$router.push('/')
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
}
</script>
