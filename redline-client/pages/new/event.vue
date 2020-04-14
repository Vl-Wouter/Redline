<template>
  <main>
    <header class="step__header">
      <p>Step {{ step }} of {{ totalSteps }}</p>
      <h2>Add a new event</h2>
    </header>
    <form
      method="post"
      enctype="multipart/form-data"
      @submit.prevent="addEvent"
    >
      <section v-show="step === 1" class="form__step">
        <p class="step__description">
          To get started, we will need some basic information about the event.
        </p>
        <form-field
          label="Title"
          field="title"
          helper="Every event needs an eye-catching title"
        >
          <text-input v-model="event.title" input-type="text" name="title" />
        </form-field>
        <form-field
          label="Description"
          field="desc"
          helper="Let everybody know what's going to happen!"
        >
          <text-area v-model="event.description" name="desc" :rows="6" />
          <span
            class="small"
            :class="{ 'color-error': descriptionLength > 500 }"
            >{{ descriptionLength }} / 500</span
          >
        </form-field>
        <form-field
          label="Category"
          field="cat"
          helper="What kind of event is it?"
        >
          <select-input
            v-model="event.categoryId"
            name="cat"
            :options="categories"
          />
        </form-field>
        <form-field
          label="Start Time"
          field="startTime"
          helper="When can people start arriving?"
        >
          <datetime
            v-model="event.startTime"
            type="datetime"
            input-class="datetime__input"
          />
        </form-field>
        <form-field
          label="End Time"
          field="endTime"
          helper="When do people have to leave?"
        >
          <datetime
            v-model="event.endTime"
            type="datetime"
            input-class="datetime__input"
          />
        </form-field>
      </section>
      <section v-show="step === 2" class="form__step">
        <form-field
          label="Address"
          field="address"
          helper="Where is everybody meeting up?"
        >
          <address-input @processed="setLocation" />
        </form-field>
      </section>
      <section v-show="step === 3" class="form__step">
        <p class="step__description">
          Now we have the basic info, it's time to make it stand out a little
          with a proper header image!
        </p>
        <form-field>
          <file-input name="event_header" @files="setHeader" />
        </form-field>
      </section>
      <section class="form__actions">
        <v-button
          v-if="step === 1"
          btn-type="button"
          class="text-error"
          @click.native="$router.go(-1)"
          >Cancel</v-button
        >
        <v-button
          v-else
          btn-type="button"
          class="text-error"
          @click.native="step--"
          >Back</v-button
        >
        <v-button v-if="step === totalSteps" btn-type="submit" class="primary"
          >Submit Event</v-button
        >
        <v-button
          v-else
          btn-type="button"
          class="primary"
          @click.native.prevent="step++"
          >Next</v-button
        >
      </section>
    </form>
  </main>
</template>

<script>
import { Datetime } from 'vue-datetime'
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
  layout: 'no_nav',
  middleware: ['authenticated', 'events'],
  components: {
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
    step: 1,
    totalSteps: 1,
    event: {
      title: '',
      description: '',
      categoryId: null,
      startTime: '',
      endTime: '',
      address: '',
      longitude: 0,
      latitude: 0,
      header: null
    }
  }),
  computed: {
    categories() {
      return this.$store.getters['events/getCategories']
    },
    descriptionLength() {
      return this.event.description.length
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.totalSteps = document.querySelectorAll('.form__step').length
    })
  },
  methods: {
    setLocation(locationData) {
      this.event = {
        ...this.event,
        ...locationData
      }
    },
    setHeader(fileData) {
      this.event.header = fileData
    },
    async addEvent() {
      const formData = new FormData()
      for (const key in this.event) {
        formData.append(key, this.event[key])
      }
      try {
        const { data: event } = await this.$axios.post('/events', formData)
        console.log(event)
        this.$store.commit('events/addEvent', event)
        this.$router.push(`/events/${event.slug}`)
      } catch (error) {
        console.log(error.response ? error.response.data : error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step__header {
  width: 100%;
  text-align: center;

  h2 {
    margin: 8px 0;
  }
}

.step__description {
  color: app-color-level('foreground', 2);
}

.form__field .small.color-error {
  color: app-color('error');
}

.form__actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  align-items: center;

  button {
    margin: 0;
  }
}
</style>
