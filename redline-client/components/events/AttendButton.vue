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
    toggleAttendance() {
      if (this.isAttending) {
        this.$axios.post(`/events/${this.event.id}/leave`)
      } else {
        this.$axios.post(`/events/${this.event.id}/attend`)
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
