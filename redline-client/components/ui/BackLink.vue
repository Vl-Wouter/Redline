<template>
  <a @click.prevent="$router.go(-1)" class="link__icon"
    ><unicon name="arrow-left" /> {{ text }}
  </a>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default() {
        return 'Back'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.link__icon {
  font-weight: 400;
  display: flex;
  align-items: center;

  .unicon {
    height: 24px;
  }
}
</style>
