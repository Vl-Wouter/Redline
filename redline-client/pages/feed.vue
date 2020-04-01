<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    if (!this.$store.state.user.current) {
      this.$router.push('/login')
    }
  }
}
</script>
