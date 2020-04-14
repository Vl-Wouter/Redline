<template>
  <v-button
    class="bottom primary"
    btn-type="button"
    control
    btn-color="primary"
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
    event: {
      type: Object,
      default() {
        return {}
      }
    },
    isAttending: Boolean
  },
  data: () => ({
    loading: false
  }),
  methods: {
    async toggleAttendance() {
      this.loading = true
      try {
        if (this.isAttending) {
          const { data } = await this.$axios.post(
            `/events/${this.event.id}/leave`
          )
          this.$emit('leave-event', data)
        } else {
          const { data } = await this.$axios.post(
            `/events/${this.event.id}/attend`
          )
          this.$emit('attend-event', data)
        }
      } catch (error) {
        this.$emit('set-error', error)
      } finally {
        this.loading = false
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
  margin-bottom: 0;
  border-radius: 0;
}
</style>
