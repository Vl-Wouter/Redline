<template>
  <main
    class="container mx-auto lg:grid lg:grid-cols-2 lg:min-h-screen lg:gap-4"
  >
    <modal id="attend-modal" class="hidden" v-if="user">
      <form @submit.prevent="toggleAttendance" method="post">
        <f-group>
          <select v-model="form.vehicle" name="vehicle" id="vehicle">
            <option :value="null"
              >I don't bring a vehicle / don't want to show it</option
            >
            <option
              v-for="vehicle in user.vehicles"
              :key="vehicle.id"
              :value="vehicle.id"
              >{{ vehicle.make + ' ' + vehicle.model }}</option
            >
          </select>
        </f-group>
        <button class="w-full py-2 rounded bg-redline text-white">
          Confirm attendance
        </button>
      </form>
    </modal>
    <header class="w-full h-40 lg:h-full overflow-hidden">
      <img
        :src="`/api/img/${event.header}`"
        alt="Header Image"
        class="w-full h-full object-cover"
      />
    </header>
    <main class="px-2 mt-4">
      <section class="flex flex-row justify-between items-center">
        <div>
          <h1 class="font-bold text-xl">{{ event.title }}</h1>
          <p class="text-sm text-redline-light">
            {{ event.__category__.name }}
          </p>
        </div>
        <p class="text-gray-700 text-sm text-right">
          Organised by: <br />
          <nuxt-link
            :to="`/user/${event.organiser.username}`"
            class="font-bold text-redline"
            >{{
              event.organiser.firstName + ' ' + event.organiser.lastName
            }}</nuxt-link
          >
        </p>
      </section>
      <section class="w-full flex flex-row justify-between items-center my-4">
        <div v-if="user">
          <button
            v-if="isAttending"
            class="py-1 px-4 rounded text-white bg-redline"
            @click="toggleAttendance"
          >
            Leave
          </button>
          <button
            v-else
            class="py-1 px-4 rounded text-white bg-redline-light"
            @click="showModal('attend-modal')"
          >
            Go to event
          </button>
        </div>
        <button
          class="text-redline font-bold lg:pointer-events-none"
          @click="showModal('reviewCont')"
        >
          {{ reviewLabel }}
        </button>
        <button
          class="text-redline font-bold lg:pointer-events-none"
          @click="showModal('attendCont')"
        >
          {{ attendLabel }}
        </button>
      </section>
      <section
        class="w-full bg-gray-200 flex flex-row rounded items-center px-4 py-4 my-4"
      >
        <font-awesome-icon
          icon="calendar"
          class="text-2xl text-redline-light"
        />
        <div class="pl-4">
          <p class="font-bold">
            {{ event.startTime | eventDate }}
          </p>
          <p>
            {{ event.startTime | localeTime }} -
            {{ event.endTime | localeTime }}
          </p>
        </div>
      </section>
      <section class="w-full my-4 text-gray-700">
        {{ event.description }}
      </section>
      <section class="text-center my-4">
        <div class="w-full h-48 rounded overflow-hidden pointer-events-none">
          <l-map
            :zoom="11"
            :center="[event.latitude, event.longitude]"
            class="pointer-events-none"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <l-marker :lat-lng="[event.latitude, event.longitude]" />
          </l-map>
        </div>
        <h3 class="font-bold mt-2">Location</h3>
        <a
          class="text-redline"
          :href="`https://www.waze.com/ul?ll=${event.latitude}%2C${event.longitude}&navigate=yes`"
          target="_blank"
          rel="noopener"
          >{{ event.address }}</a
        >
      </section>
      <section class="text-center">
        <h3 class="text-lg font-bold">Albums</h3>
      </section>
    </main>
    <review-container
      id="reviewCont"
      :reviews="event.reviews"
      :event="event.id"
      class="lg:row-start-2 lg:col-start-1"
      @close="closeModal"
    />
    <attending-container
      id="attendCont"
      :attending="event.attending"
      @close="closeModal"
    />
  </main>
</template>

<script>
import axios from 'axios'
import ReviewContainer from '~/components/ReviewContainer'
import AttendingContainer from '~/components/AttendingContainer'
import Modal from '~/components/Modal'
import ContentFormGroup from '~/components/ContentFormGroup'
export default {
  layout: 'app',
  components: {
    ReviewContainer,
    AttendingContainer,
    Modal,
    'f-group': ContentFormGroup,
  },
  asyncData({ params }) {
    return axios.get(`/api/events/${params.slug}`).then((res) => {
      return {
        event: res.data,
      }
    })
  },
  data() {
    return {
      event: null,
      form: {
        vehicle: null,
      },
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
    isOwn() {
      return this.event.organiser.id === this.user.id
    },
    reviewLabel() {
      const count = this.event.reviews.length
      return `${count} review${count !== 1 ? 's' : ''}`
    },
    attendLabel() {
      const count = this.event.attending.length
      return `${count} going`
    },
    isAttending() {
      return (
        this.event.attending.filter((item) => {
          return item.userId === this.user.id
        }).length > 0
      )
    },
  },
  methods: {
    closeModal(target) {
      target.classList.add('invisible')
    },
    showModal(id) {
      const el = document.querySelector(`#${id}`)
      if (el.classList.contains('invisible')) {
        el.classList.remove('invisible')
      }
      if (el.classList.contains('hidden')) {
        el.classList.remove('hidden')
      }
    },
    async toggleAttendance() {
      let updated = this.event
      try {
        if (!this.isAttending) {
          const { data } = await this.$axios.post(
            `/api/events/${this.event.id}/attend`,
            {
              vehicle: this.form.vehicle,
            }
          )
          updated = data
          this.form.vehicle = null
          document.querySelector('#attend-modal').classList.add('hidden')
        } else {
          const { data } = await this.$axios.post(
            `/api/events/${this.event.id}/leave`
          )
          updated = data
        }
        this.event = updated
      } catch (err) {
        this.$toast.error(err.message)
      }
    },
  },
}
</script>
