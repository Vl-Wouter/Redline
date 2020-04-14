<template>
  <card>
    <header class="review__header">
      <p>{{ review.author | fullName }}</p>
      <unicon
        :name="review.isRecommended ? 'thumbs-up' : 'thumbs-down'"
        height="16"
        :class="review.isRecommended ? 'fill__success' : 'fill_error'"
      />
    </header>
    <main>{{ review.content }}</main>
    <footer v-if="canDelete">
      <v-button class="text-error" @click.native="removeReview"
        ><unicon name="trash" height="16" /> Delete</v-button
      >
    </footer>
  </card>
</template>

<script>
import Button from '../ui/Button'
import Card from './Card'
export default {
  components: {
    Card,
    'v-button': Button
  },
  props: {
    review: {
      type: Object,
      default() {
        return null
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getUser']
    },
    canDelete() {
      if (this.user) {
        return (
          this.user.roles.includes('ADMIN') ||
          this.user.roles.includes('MODERATOR') ||
          this.user.id === this.review.authorId
        )
      }
      return false
    }
  },
  methods: {
    removeReview() {
      try {
        this.$store.dispatch('events/removeReview', this.review)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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

button.btn {
  padding-left: 0;
}
</style>
