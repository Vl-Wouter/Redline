<template>
  <main class="container mx-auto lg:w-1/2 px-2 my-4">
    <header class="w-full flex space-x-4 items-center">
      <nuxt-link :to="`/events/${$route.params.slug}`" class="text-redline"
        ><font-awesome-icon icon="arrow-left"
      /></nuxt-link>
      <h1 class="text-xl font-bold">Edit event</h1>
    </header>
    <main class="w-full">
      <form class="w-full" method="post" @submit.prevent="submit">
        <f-group label="Event title" field="title">
          <input id="title" v-model="form.title" type="text" name="title" />
        </f-group>
        <f-group label="Description" field="desc">
          <textarea
            id="desc"
            v-model="form.description"
            name="desc"
            cols="30"
            rows="5"
          ></textarea>
          <span class="text-xs">{{ descLength }} / 500</span>
        </f-group>
        <f-group label="Category" field="category">
          <select id="category" v-model="form.categoryId" name="category">
            <option :value="null" disabled>Select one</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              >{{ category.name }}</option
            >
          </select>
        </f-group>
        <f-group label="Start Time" field="startTime">
          <vue-ctk-date-time-picker
            v-model="form.startTime"
            format="YYYY-MM-DDTHH:mm:ss.sssZ"
            name="startTime"
          />
        </f-group>
        <f-group label="End Time" field="endTime">
          <vue-ctk-date-time-picker
            v-model="form.endTime"
            format="YYYY-MM-DDTHH:mm:ss.sssZ"
            name="endTime"
          />
        </f-group>
        <f-group label="Address">
          <input
            id="address"
            type="text"
            name="address"
            :value="form.address"
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
        <f-group label="Header image" field="header">
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
            </div>
          </file-input>
        </f-group>
        <button
          type="submit"
          class="w-full bg-redline my-4 py-2 rounded text-white"
        >
          Edit event
        </button>
      </form>
    </main>
  </main>
</template>

<script>
import axios from 'axios'
import ContentFormGroup from '~/components/ContentFormGroup'
import FileInput from '~/components/FileInput'
export default {
  middleware: ['auth', 'ownsEvent'],
  components: {
    'f-group': ContentFormGroup,
    FileInput,
  },
  asyncData({ params }) {
    return axios
      .all([
        axios.get(`/api/events/${params.slug}`),
        axios.get('/api/categories'),
      ])
      .then(
        axios.spread((...res) => {
          return {
            form: res[0].data,
            categories: res[1].data,
          }
        })
      )
  },
  data() {
    return {
      categories: null,
      form: null,
    }
  },
  computed: {
    descLength() {
      return this.form.description.length
    },
    headerImg() {
      if (typeof this.form.header === 'string') {
        return `/api/img/${this.form.header}`
      }
      return URL.createObjectURL(this.form.header)
    },
  },
  methods: {
    async lookUpPlace(value) {
      if (value.length < 3) return
      try {
        const { data } = await this.$axios.post('/api/location', {
          address: value,
        })
        this.form = {
          ...this.form,
          address: data.address,
          latitude: data.lat,
          longitude: data.lng,
        }
      } catch (err) {
        this.$toast.error(err.message)
      }
    },
    clearAddress() {
      this.form = {
        ...this.form,
        address: null,
        latitude: null,
        longitude: null,
      }
    },
    async submit() {
      const {
        header,
        __category__,
        attending,
        organiser,
        reviews,
        createdAt,
        updatedAt,
        ...form
      } = this.form
      try {
        const { data } = await this.$axios.patch(
          `/api/events/${this.form.slug}`,
          form
        )
        if (typeof header === 'object') {
          const formData = new FormData()
          formData.append('header', header)
          await this.$axios.post(`/api/events/${this.form.id}/header`, formData)
        }
        return this.$router.push(`/events/${data.slug}`)
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
}
</script>
