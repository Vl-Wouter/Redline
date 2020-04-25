<template>
  <nav>
    <nuxt-link to="/"
      ><unicon name="home-alt" /><span class="link__text">Home</span></nuxt-link
    >
    <!-- <nuxt-link v-if="user" to="/feed"
      ><unicon name="rss" /><span class="link__text">Feed</span></nuxt-link
    > -->
    <nuxt-link v-if="user" to="/new"
      ><unicon name="plus-circle" /><span class="link__text"
        >Add Content</span
      ></nuxt-link
    >
    <nuxt-link v-if="user" :to="`/users/${user.username}`"
      ><div class="userImg">
        <img
          :src="`/api/auth/${user.username}/avatar`"
          alt="Profile Image"
        /></div
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

    .link__text {
      display: none;
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

@media (min-width: 900px) {
  nav {
    position: absolute;
    top: 0;
    height: 48px;
    box-shadow: 0 5px 10px #00000020;
    background: app-color();
    color: app-color('background');
    z-index: 1;

    a {
      display: flex;
      align-items: center;

      .unicon {
        margin-right: 4px;
      }
      .link__text {
        display: inline-block;
      }

      &.nuxt-link-exact-active {
        color: app-color('background');

        .unicon {
          fill: app-color('background');
        }

        .userImg img {
          border: 2px solid app-color();
        }

        &:after {
          content: '';
          width: 100%;
          height: 8px;
          background: app-color('background');
          position: absolute;
          left: 0;
          bottom: 0;
          border-radius: 4px 4px 0 0;
        }
      }
    }
  }
}
</style>
