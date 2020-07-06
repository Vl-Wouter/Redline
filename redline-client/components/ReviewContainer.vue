<template>
  <main
    class="w-full fixed top-0 bg-gray-100 left-0 py-4 px-2 lg:relative bg-white lg:bg-opacity-0 z-top h-screen lg:h-auto invisible lg:visible"
  >
    <header class="w-full flex justify-between items-baseline">
      <h2 class="font-bold text-redline">
        {{ reviews.length }} review{{ reviews.length !== 1 ? 's' : '' }}
      </h2>
      <button class="px-4 lg:hidden" @click="$emit('close', $el)">
        <font-awesome-icon icon="times" class="text-lg" />
      </button>
    </header>
    <main class="w-full">
      <section
        v-for="review in reviews"
        :key="review.id"
        class="my-4 px-4 py-2 rounded border bg-white"
      >
        <header class="flex justify-between items-center">
          <div class="flex items-center">
            <img
              :src="`/api/img/${review.author.profileImg}`"
              :alt="review.author.id"
              class="w-8 h-8 rounded-full"
            />
            <p class="inline pl-4 font-bold">
              {{ review.author.firstName }} {{ review.author.lastName }}
            </p>
          </div>
          <div v-if="user && user.id === review.author.id">
            <button class="text-redline" @click="removeReview(review)">
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </header>
        <p class="my-2">{{ review.content }}</p>
        <p v-if="review.isRecommended" class="text-xs italic text-gray-700">
          Recommends this event
        </p>
        <p v-else class="text-xs italic text-gray-700">
          Does not recommend this event
        </p>
      </section>
    </main>
    <footer
      v-if="user && !hasReviewed"
      class="w-full fixed bg-white border lg:relative px-2 py-2 lg:rounded rounded-t bottom-0 left-0 shadow-md"
    >
      <form class="w-full" @submit.prevent="submit">
        <f-group label="Write a review">
          <div class="grid grid-cols-2">
            <div class="flex items-center space-x-4">
              <toggle-wrapper
                v-model="form.isRecommended"
                type="radio"
                name="recommended"
                :val="true"
              >
                <div
                  class="w-4 h-4 px-2 py-2 border flex items-center rounded justify-center text-gray-500"
                  :class="
                    form.isRecommended && 'text-green-500 border-green-500'
                  "
                >
                  <font-awesome-icon icon="check" />
                </div>
              </toggle-wrapper>
              <span class="text-sm">Recommended</span>
            </div>
            <div class="flex items-center space-x-4">
              <toggle-wrapper
                v-model="form.isRecommended"
                type="radio"
                name="not-recommended"
                :val="false"
              >
                <div
                  class="w-4 h-4 px-2 py-2 border flex items-center rounded justify-center text-gray-500"
                  :class="!form.isRecommended && 'text-red-500 border-red-500'"
                >
                  <font-awesome-icon icon="times" />
                </div>
              </toggle-wrapper>
              <span class="text-sm">Not Recommended</span>
            </div>
          </div>
          <textarea
            id="content"
            v-model="form.content"
            name="content"
            class="w-full mt-2"
            cols="30"
            rows="2"
          ></textarea>
        </f-group>
        <button type="submit" class="w-full bg-redline py-2 text-white rounded">
          Submit
        </button>
      </form>
    </footer>
  </main>
</template>

<script>
import ToggleWrapper from './ToggleWrapper'
import ContentFormGroup from './ContentFormGroup'
export default {
  components: {
    ToggleWrapper,
    'f-group': ContentFormGroup,
  },
  props: {
    reviews: {
      type: Array,
      default() {
        return []
      },
    },
    event: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      form: {
        isRecommended: true,
        content: '',
      },
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getCurrent']
    },
    hasReviewed() {
      return (
        this.reviews.filter((review) => {
          return (
            review.author.id === this.user.id ||
            review.authorId === this.user.id
          )
        }).length > 0
      )
    },
  },
  methods: {
    async submit() {
      if (!this.form.content) {
        this.$toast.error('Please write a review before submitting')
        return
      }
      try {
        const { data } = await this.$axios.post('/api/reviews', {
          ...this.form,
          eventId: this.event,
        })
        this.reviews.push(data)
        this.form = {
          isRecommended: true,
          content: '',
        }
      } catch (err) {
        this.$toast.error(err.message)
      }
    },
    async removeReview(review) {
      try {
        await this.$axios.delete(`/api/reviews/${review.id}`)
        this.reviews = this.reviews.filter((item) => {
          return item.id !== review.id
        })
      } catch (err) {
        this.$toast.error(err.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.z-top {
  z-index: 9999;
}
input,
textarea,
select {
  @apply border rounded w-full py-2 px-2 bg-white;

  &:focus {
    @apply border-redline outline-none;
  }
}
</style>
