<template>
  <v-button
    class="bottom primary"
    btn-type="button"
    control
    btnColor="primary"
    @click.native="toggleAttendance"
  >
    <slot />
  </v-button>
</template>

<script>
import Button from '../ui/Button'
export default {
  components: {
    'v-button': Button
  },
  props: {
    event: Object,
    isAttending: Boolean
  },
  methods: {
    async toggleAttendance() {
      try {
        if (this.isAttending) {
          await this.$axios.post(`/events/${this.event.id}/leave`)
          this.$emit('leave-event')
        } else {
          const { data } = await this.$axios.post(
            `/events/${this.event.id}/attend`
          )
          this.$emit('attend-event', data)
        }
      } catch (error) {
        this.$emit('set-error', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 64px;
  z-index: 999;
}
</style>
