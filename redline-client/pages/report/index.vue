<template>
  <main class="container mx-auto px-2">
    <nuxt-link :to="returnURL.fullPath" class="font-bold text-redline"
      ><font-awesome-icon icon="arrow-left" /> Go Back</nuxt-link
    >
    <h1 class="my-4 font-bold text-xl">Report {{ form.type }}</h1>
    <form @submit.prevent="submit" method="post">
      <f-group label="URL to report" field="url">
        <input v-model="form.url" type="url" name="url" id="url" disabled />
      </f-group>
      <f-group label="Reason" field="reason">
        <input
          v-model="form.reason"
          type="text"
          name="reason"
          id="reason"
          required
        />
      </f-group>
      <button type="submit" class="bg-redline text-white w-full rounded py-2">
        Report
      </button>
    </form>
  </main>
</template>

<script>
import ContentFormGroup from '~/components/ContentFormGroup'
export default {
  middleware: ['auth', 'token'],
  components: {
    'f-group': ContentFormGroup,
  },
  asyncData({ query, from }) {
    return {
      form: {
        url: query.url,
        type: query.type,
      },
      returnURL: from,
    }
  },
  data() {
    return {
      form: {
        url: null,
        type: null,
        reason: null,
      },
    }
  },
  methods: {
    async submit() {
      try {
        const { data: report } = await this.$axios.post(
          `/api/reports`,
          this.form
        )
        this.$toast.success(
          `This ${this.form.type} has been reported: ID ${report.id}`
        )
        this.$router.push(this.returnURL.fullPath)
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
}
</script>
