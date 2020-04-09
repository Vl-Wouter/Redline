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
          <radio-input
            v-model="reviewForm.isRecommended"
            name="recommended"
            radio-label="I recommend this event"
          />
          <radio-input
            v-model="reviewForm.isRecommended"
            name="notRecommended"
            radio-label="I do not recommend this event"
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
    <card v-for="review in reviews" :key="review.id">
      <header class="review__header">
        <p>{{ review.author.firstName }} {{ review.author.lastName }}</p>
        <unicon
          :name="review.isRecommended ? 'thumbs-up' : 'thumbs-down'"
          height="16"
          :class="review.isRecommended ? 'fill__success' : 'fill__error'"
        />
      </header>
      <main>{{ review.content }}</main>
    </card>
    <!-- <section v-for="review in reviews" :key="review.id" class="review">
      <header class="review__header">
        <p>{{ review.author.firstName }} {{ review.author.lastName }}</p>
        <p>
          {{
            review.isRecommended
              ? 'Recommends this event'
              : 'Does not recommend this event'
          }}
        </p>
      </header>
      <main class="review__main">
        {{ review.content }}
      </main> -->
    <!-- </section> -->
  </side-overlay>
</template>

<script>
import Button from '../ui/Button'
import { TextArea, RadioInput } from '../forms'
import Card from '../cards/Card'
import SideOverlay from './SideOverlay'
export default {
  components: {
    SideOverlay,
    'v-button': Button,
    TextArea,
    RadioInput,
    Card
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
        const { data: review } = this.$axios.post('/reviews', reviewObject)
        this.$emit('add-review', review)
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

.review__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 8px;

  .unicon {
    height: 16px;
  }

  .fill {
    &__success {
      fill: green;
    }
    &__error {
      fill: red;
    }
  }
}
</style>
