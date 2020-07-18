<template>
  <main class="min-h-screen bg-gray-100">
    <header
      class="sticky top-0 z-10 w-full shadow-sm py-2 px-4 flex flex-row justify-between lg:justify-center lg:space-x-48 items-center bg-white"
    >
      <button class="text-redline" @click="goBack">
        {{ steps.current > 1 ? 'Back' : 'Cancel' }}
      </button>
      <p class="text-gray-700">Step {{ steps.current }} of {{ steps.total }}</p>
      <button
        class="py-1 px-2 bg-redline text-white rounded"
        :class="steps.current === steps.total ? 'invisible' : ''"
        @click="steps.current++"
      >
        Next
      </button>
    </header>
    <main class="container mx-auto">
      <form method="post" class="lg:w-1/2 lg:mx-auto" @submit.prevent="submit">
        <section v-show="steps.current === 1" class="step w-full px-4">
          <p class="mt-2 text-center text-sm text-gray-700">
            Please fill in the correct information about your event.
          </p>
          <f-group
            label="Title"
            field="title"
            helper="Give your event a recognisable title"
          >
            <input id="title" v-model="form.title" type="text" name="title" />
          </f-group>
          <f-group
            label="Description"
            field="desc"
            helper="Let the people know what to expect."
          >
            <textarea
              id="desc"
              v-model="form.description"
              name="desc"
              cols="30"
              rows="6"
            ></textarea>
            <span class="text-xs">{{ descLength }} / 500</span>
          </f-group>
          <f-group label="Category" field="category">
            <select id="category" v-model="form.categoryId" name="category">
              <option :value="null" selected disabled>Select one</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
                >{{ category.name }}</option
              >
            </select>
          </f-group>
        </section>
        <section v-show="steps.current === 2" class="step w-full px-4">
          <p class="mt-2 text-center text-sm text-gray-700">
            Every event needs a time and place. Lets add that now.
          </p>
          <f-group
            label="Start"
            field="startTime"
            helper="When does your event start?"
          >
            <vue-ctk-date-time-picker
              v-model="form.startTime"
              format="YYYY-MM-DDTHH:mm:ss.sssZ"
              name="startTime"
            />
          </f-group>
          <f-group
            label="End"
            field="endTime"
            helper="When does your event end?"
          >
            <vue-ctk-date-time-picker
              v-model="form.endTime"
              format="YYYY-MM-DDTHH:mm:ss.sssZ"
              name="endTime"
            />
          </f-group>
          <f-group
            label="Address"
            field="address"
            helper="Where if the event taking place? (Limited to Belgium only at this point)"
          >
            <input
              id="address"
              type="text"
              name="address"
              @change="lookUpPlace($event.target.value)"
            />
            <span class="text-xs text-gray-700">
              <button
                v-if="form.address"
                class="text-red-500"
                @click.prevent="clearAddress"
              >
                <font-awesome-icon icon="times" />
              </button>
              {{ form.address }}
            </span>
          </f-group>
        </section>
        <section v-show="steps.current === 3" class="step w-full px-4">
          <f-group
            label="Header image"
            field="header"
            helper="Add a beautiful header image to your event."
          >
            <file-input
              name="header"
              label-element
              @files="
                (fileData) => {
                  form.header = fileData
                }
              "
            >
              <div
                class="w-full h-40 rounded bg-gray-400 flex justify-center items-center overflow-hidden cursor-pointer"
              >
                <img
                  v-if="headerImg"
                  :src="headerImg"
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
            Create Event
          </button>
        </section>
      </form>
    </main>
  </main>
</template>

<script>
import axios from 'axios'
import ContentFormGroup from '~/components/ContentFormGroup'
import FileInput from '~/components/FileInput'
export default {
  middleware: 'auth',
  components: {
    'f-group': ContentFormGroup,
    FileInput,
  },
  asyncData(context) {
    return axios.get('/api/categories').then((res) => {
      return {
        categories: res.data,
      }
    })
  },
  data() {
    return {
      categories: null,
      steps: {
        current: 1,
        total: null,
      },
      form: {
        title: null,
        description: '',
        categoryId: null,
        startTime: null,
        endTime: null,
        address: null,
        longitude: null,
        latitude: null,
        header: null,
      },
    }
  },
  computed: {
    descLength() {
      return this.form.description.length
    },
    headerImg() {
      if (this.form.header) {
        return URL.createObjectURL(this.form.header)
      } else {
        return null
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.steps.total = document.querySelectorAll('.step').length
    })
  },
  methods: {
    goBack() {
      if (this.steps.current === 1) {
        this.$router.push('/new')
      }
      this.steps.current--
    },
    async lookUpPlace(value) {
      if (value.length < 3) {
        return
      }
      try {
        const res = await this.$axios.post('/api/location', {
          address: value,
        })
        this.form.address = res.data.address
        this.form.latitude = res.data.coords.lat
        this.form.longitude = res.data.coords.lng
      } catch (err) {
        this.$toast.error(err.message)
      }
    },
    clearAddress() {
      this.form.address = null
      this.form.latitude = null
      this.form.longitude = null
    },
    async submit() {
      const formData = new FormData()
      for (const key in this.form) {
        formData.append(key, this.form[key])
      }
      try {
        const { data } = await this.$axios.post('/api/events', formData, {
          headers: {
            Authorization: `Bearer ${this.$store.state.user.token}`,
          },
        })
        this.$router.push(`/events/${data.slug}`)
      } catch (err) {
        this.$toast.error(err.message)
      }
    },
  },
  head() {
    return {
      title: 'Add an event | Redline',
    }
  },
}
</script>

<style lang="scss" scoped></style>
