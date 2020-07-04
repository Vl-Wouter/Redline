<template>
  <main class="container mx-auto">
    <header class="w-full h-40 lg:h-64 overflow-hidden">
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
      <section class="w-full bg-gray-200 flex flex-row rounded px-4 py-4 my-4">
        <font-awesome-icon
          icon="calendar"
          class="text-2xl text-redline-light"
        />
        <div class="pl-2">
          {{ event.startTime }}
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
      <sections class="text-center">
        <h3 class="text-lg font-bold">Albums</h3>
      </sections>
    </main>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'app',
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
    }
  },
}
</script>
