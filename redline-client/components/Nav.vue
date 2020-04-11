<template>
  <nav>
    <nuxt-link to="/"><unicon name="home-alt"/></nuxt-link>
    <nuxt-link v-if="user" to="/feed"><unicon name="rss"/></nuxt-link>
    <nuxt-link v-if="user" to="/new"><unicon name="plus-circle"/></nuxt-link>
    <nuxt-link v-if="user" :to="`/users/${user.username}`"
      ><div class="userImg">
        <img
          v-if="user.profileImg"
          :src="user.profileImg"
          alt="Profile Image"
        /><img v-else src="~/static/images/user.png" alt="Profile image" /></div
    ></nuxt-link>
    <nuxt-link v-if="!user" to="/login"><unicon name="sign-in-alt"/></nuxt-link>
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
  padding: 0 32px;
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

    .userImg {
      display: flex;
      align-items: center;
      height: 100%;

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid app-color-level('primary', 3);
      }
    }

    &.nuxt-link-exact-active {
      color: app-color('primary');

      .unicon {
        fill: app-color('primary');
      }

      .userImg img {
        border: 2px solid app-color();
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
