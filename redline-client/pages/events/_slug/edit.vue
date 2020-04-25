<template>
  <main>
    <back-link text="Go back" />
    <header>
      <h2>Edit event</h2>
    </header>
    <form
      method="post"
      v-if="event"
      @submit.prevent="editEvent"
      enctype="multipart/form-data"
    >
      <form-field label="Title" field="title">
        <text-input v-model="event.title" name="title" />
      </form-field>
      <form-field label="Description" field="description">
        <text-area v-model="event.description" name="desc" :rows="6" />
      </form-field>
      <form-field label="Category" field="category">
        <select-input
          v-model="event.categoryId"
          name="cat"
          :options="categories"
        />
      </form-field>
      <form-field label="Start Time" field="startTime">
        <datetime
          v-model="event.startTime"
          type="datetime"
          input-class="datetime__input"
        />
      </form-field>
      <form-field label="End Time" field="endTime">
        <datetime
          v-model="event.endTime"
          type="datetime"
          input-class="datetime__input"
        />
      </form-field>
      <form-field label="Address" field="address">
        <address-input @processed="setLocation" :has-map="false" />
        <p class="small">{{ event.address }}</p>
        <p class="small">{{ event.longitude }}, {{ event.latitude }}</p>
      </form-field>
      <form-field>
        <file-input name="event_header" @files="setHeader" />
      </form-field>
      <v-button btn-type="submit" class="primary control">Edit event</v-button>
    </form>
  </main>
</template>

<script>
import { Datetime } from 'vue-datetime'
import BackLink from '~/components/ui/BackLink'
import {
  FormField,
  TextInput,
  TextArea,
  SelectInput,
  AddressInput,
  FileInput
} from '~/components/forms'
import Button from '~/components/ui/Button'
export default {
  middleware: ['authenticated', 'canEditEvent'],
  components: {
    BackLink,
    FormField,
    TextInput,
    TextArea,
    SelectInput,
    AddressInput,
    Datetime,
    FileInput,
    'v-button': Button
  },
  data: () => ({
    event: null
  }),
  computed: {
    categories() {
      return this.$store.getters['events/getCategories']
    }
  },
  mounted() {
    const event = this.$store.getters['events/getBySlug'](
      this.$route.params.slug
    )
    this.event = { ...event }
  },
  methods: {
    setLocation(locationData) {
      this.event = {
        ...this.event,
        ...locationData
      }
    },
    async setHeader(fileData) {
      try {
        const formData = new FormData()
        formData.append('header', fileData)
        const { data: event } = await this.$axios.post(
          `/events/${this.event.id}/updateHeader`,
          formData
        )
        await this.$store.commit('events/updateEvent', { id: event.id, event })
      } catch (error) {
        console.log(error.response ? error.response.data : error)
      }
    },
    async editEvent() {
      const {
        __category__,
        organiser,
        slug,
        reviews,
        attending,
        header,
        ...eventObject
      } = this.event
      try {
        const { data: event } = await this.$axios.patch(
          `/events/${eventObject.id}`,
          eventObject
        )
        console.log(event)
        await this.$store.commit('events/updateEvent', { id: event.id, event })
        this.$router.push(`/events/${slug}`)
      } catch (error) {
        console.log(error.response ? error.response.data : error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  margin: 16px 0;
}

main {
  padding-bottom: 72px;
}
</style>
