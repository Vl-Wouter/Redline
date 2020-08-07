<template>
  <main class="container mx-auto px-2 mt-2 lg:w-1/2">
    <nuxt-link
      class="font-bold text-redline"
      :to="`/user/${user.username}/settings`"
      ><font-awesome-icon icon="arrow-left" /> Go Back</nuxt-link
    >
    <h1 class="mb-4 font-bold text-xl">Reports</h1>
    <section v-if="isLoading">
      <p>Loading...</p>
    </section>
    <section class="w-full" v-else>
      <div v-if="reports">
        <section
          v-for="(report, key) in reports"
          :key="key"
          class="w-full rounded border py-2 px-4 my-4 bg-white"
        >
          <p class="text-gray-700">
            <nuxt-link :to="key" class="text-redline font-bold text-lg">{{
              key
            }}</nuxt-link>
            - {{ report.length }}
          </p>
          <div class="w-full divide-y divide-gray-400">
            <div
              v-for="reported in report"
              :key="reported.id"
              class="py-2 flex flex-row justify-between"
            >
              <p>{{ reported.reason }}</p>
              <p class="text-gray-700">
                Reported by:
                <nuxt-link
                  :to="`/user/${reported.reportedBy.username}`"
                  class="text-rl-blue"
                  >{{ reported.reportedBy.username }}</nuxt-link
                >
              </p>
            </div>
          </div>
        </section>
      </div>
      <div
        v-else
        class="w-full my-4 border border-dashed flex justify-center items-center py-2"
      >
        <p>There are no reports here.</p>
      </div>
    </section>
  </main>
</template>

<script>
// import axios from 'axios'
export default {
  middleware: ['auth', 'isAdmin'],
  // asyncData() {
  //   return axios
  //     .get(`/api/reports`)
  //     .then((res) => {
  //       return {
  //         reports: res.data,
  //       }
  //     })
  // },
  data() {
    return {
      reports: null,
      isLoading: true,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
  },
  async mounted() {
    try {
      const { data: reports } = await this.$axios.get('/api/reports')
      this.reports = reports
      this.isLoading = false
    } catch (err) {
      this.$toast.error(err.response.data.message)
    }
  },
}
</script>
