<template>
  <div>
    <back-link text="Settings" />
    <main>
      <event-actions-card
        v-for="event in events"
        :key="event.id"
        :event="event"
        @delete-event="confirmDelete"
      />
    </main>
    <modal v-if="deleteModal.isOpen">
      <h2>Confirm deletion</h2>
      <p>Are you sure you want to delete this event?</p>
      <section class="btn__container">
        <v-button class="error"
          ><unicon name="trash" height="16" /> Delete</v-button
        >
        <v-button
          class="text-primary"
          @click.native="deleteModal.isOpen = false"
          >Cancel</v-button
        >
      </section>
    </modal>
  </div>
</template>

<script>
import EventActionsCard from '~/components/cards/EventActionsCard'
import Modal from '~/components/ui/Modal'
import Button from '~/components/ui/Button'
import BackLink from '~/components/ui/BackLink'
export default {
  middleware: ['authenticated', 'isSelf', 'userData', 'isAdmin'],
  components: {
    EventActionsCard,
    Modal,
    'v-button': Button,
    BackLink
  },
  data: () => ({
    deleteModal: {
      isOpen: false,
      event: null
    }
  }),
  computed: {
    events() {
      return this.$store.getters['events/getAll']
    }
  },
  methods: {
    confirmDelete(event) {
      this.deleteModal.isOpen = true
      this.deleteModal.event = event
    }
  }
}
</script>

<style lang="scss" scoped>
.btn__container {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}
</style>
