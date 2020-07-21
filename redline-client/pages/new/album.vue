<template>
  <main class="min-h-screen bg-gray-100">
    <!-- TODO: Refactor form headers -->
    <header
      class="sticky top-0 z-10 w-full shadow-sm py-2 px-4 flex flex-row justify-between lg:justify-center lg:space-x-48 items-center bg-white"
    >
      <button class="text-redline" @click="goBack">
        {{ steps.current > 1 ? 'Back' : 'Cancel' }}
      </button>
      <p class="text-gray-700">{{ steps.current }} of {{ steps.total }}</p>
      <button
        class="py-1 px-2 bg-redline text-white rounded"
        :class="steps.current === steps.total && 'invisible'"
        @click="steps.current++"
      >
        Next
      </button>
    </header>
    <main class="container mx-auto">
      <h2 class="text-lg font-bold px-4 my-2">Add an album</h2>
      <form @submit.prevent="submit" class="lg:w-1/2 lg:mx-auto" method="post">
        <section v-show="steps.current === 1" class="step w-full px-4">
          <p class="text-gray-700">Let's start with some information first</p>
          <f-group
            label="Title"
            field="title"
            helper="A descriptive title for the album"
          >
            <input v-model="form.title" type="text" name="title" id="title" />
          </f-group>
          <f-group label="Description" field="description">
            <textarea
              v-model="form.description"
              name="description"
              id="description"
              cols="30"
              rows="5"
            ></textarea>
          </f-group>
          <f-group
            label="Event"
            field="event"
            helper="Is this album related to an event? Event-related albums will be shown on event pages"
          >
            <select v-model="form.eventId" name="event" id="event">
              <option :value="null">Not related to an event</option>
              <option
                v-for="event in events"
                :key="event.id"
                :value="event.id"
                >{{ event.title }}</option
              >
            </select>
          </f-group>
        </section>
        <section v-show="steps.current === 2" class="w-full step px-4">
          <p class="text-gray-700">Now lets add some images to the album</p>
          <f-group label="Add Images" field="photos">
            <file-input
              name="photos"
              labelText
              allowMultiple
              @files="
                (fileData) => {
                  form.photos = fileData
                }
              "
            />
          </f-group>
          <section class="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              class="w-full h-full rounded overflow-hidden"
              v-for="(photo, i) in form.photos"
              :key="i"
            >
              <img
                :src="getURL(photo)"
                :alt="`Photo ${i}`"
                class="w-full h-full object-cover"
              />
            </div>
          </section>
          <button
            type="submit"
            class="w-full py-2 my-4 text-white rounded"
            :class="
              formValidates ? 'bg-redline' : 'bg-gray-400 pointer-events-none'
            "
          >
            Add album
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
    return axios.get('/api/events?withPast=true').then((res) => {
      return {
        events: res.data,
      }
    })
  },
  data() {
    return {
      events: null,
      steps: {
        current: 1,
        total: null,
      },
      form: {
        title: '',
        description: '',
        eventId: null,
        photos: [],
      },
    }
  },
  computed: {
    descLength() {
      return this.form.description.length
    },
    formValidates() {
      return (
        this.form.title && this.form.description && this.form.photos.length > 1
      )
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
    getURL(photo) {
      return URL.createObjectURL(photo)
    },
    async submit() {
      try {
        const { photos, ...form } = this.form
        const formData = this.$toFormData(form)
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i]
          if (!file.type.match('image.*')) continue
          formData.append('photos', file)
        }
        const { data } = await this.$axios.post('/api/albums', formData)
        console.log(data)
        this.$toast.success('Created a new album')
        this.$router.push('/')
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
}
</script>
