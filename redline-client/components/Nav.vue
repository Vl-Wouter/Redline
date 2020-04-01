<template>
  <nav>
    <nuxt-link to="/">Home</nuxt-link>
    <nuxt-link v-if="!user" to="/login"><unicon name="sign-in-alt"/></nuxt-link>
    <nuxt-link v-if="user" to="/events/new"
      ><unicon name="plus-circle"
    /></nuxt-link>
  </nav>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user.current
    }
  }
}
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 16px;
  line-height: 64px;
  height: 64px;
  box-shadow: 0 -5px 10px #00000020;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: app-color('background');

  a {
    color: app-color-level('primary', 3);
    position: relative;
    height: 100%;

    .unicon {
      display: flex;
      align-items: center;
      height: 100%;
      fill: app-color-level('primary', 3);
    }

    &.nuxt-link-exact-active {
      color: app-color('primary');

      .unicon {
        fill: app-color('primary');
      }

      &:after {
        content: '';
        width: 100%;
        height: 8px;
        background: app-color('primary');
        position: absolute;
        left: 0;
        bottom: 0;
        border-radius: 4px 4px 0 0;
      }
    }
  }
}
</style>
