<template>
  <side-overlay
    ref="overlay"
    :title="`${(reviews && reviews.length) || 0} reviews`"
    is-fill
    position="right"
  >
    <card v-if="user">
      <form method="POST" @submit.prevent="addReview">
        <h3>Post a review</h3>
        <p class="small">
          Posting as <b>{{ user.fullName }}</b>
        </p>
        <section class="review__options">
          <toggle-input
            name="isRecommended"
            type="radio"
            v-model="reviewForm.isRecommended"
            :val="true"
            toggle-label="I recommend this event"
          />
          <toggle-input
            name="notRecommended"
            type="radio"
            v-model="reviewForm.isRecommended"
            :val="false"
            toggle-label="I do not recommend this event"
          />
        </section>
        <section>
          <text-area
            v-model="reviewForm.content"
            name="reviewContent"
            :rows="3"
            placeholder="Write a review"
          />
        </section>
        <v-button type="submit" class="control primary">Send review</v-button>
      </form>
    </card>
    <review-card v-for="review in reviews" :review="review" :key="review.id" />
  </side-overlay>
</template>

<script>
import Button from '../ui/Button'
import { TextArea, ToggleInput } from '../forms'
import Card from '../cards/Card'
import ReviewCard from '../cards/ReviewCard'
import SideOverlay from './SideOverlay'
export default {
  components: {
    SideOverlay,
    'v-button': Button,
    TextArea,
    ToggleInput,
    Card,
    ReviewCard
  },
  props: {
    reviews: {
      type: Array,
      default() {
        return []
      }
    },
    event: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    reviewForm: {
      isRecommended: true,
      content: ''
    }
  }),
  computed: {
    user() {
      return this.$store.state.user.current
    }
  },
  methods: {
    toggle() {
      this.$refs.overlay.toggleOverlay()
    },
    addReview() {
      const reviewObject = {
        ...this.reviewForm,
        eventId: this.event.id
      }
      try {
        // const { data: review } = this.$axios.post('/reviews', reviewObject)
        this.$emit('add-review', reviewObject)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.small {
  font-size: 0.9rem;
  color: app-color-level('foreground', 3);
}
</style>
