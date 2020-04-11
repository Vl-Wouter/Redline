<template>
  <div v-if="user">
    <back-link text="Profile" />
    <card class="user__details">
      <section>
        <img
          src="~/static/images/user.png"
          alt="user image"
          class="user__img"
        />
      </section>
      <section>
        <h3>{{ user.firstName }} {{ user.lastName }}</h3>
        <p>{{ user.email }}</p>
        <p class="user__roles">{{ user.roles[0] }} | No social handle</p>
      </section>
    </card>
    <section>
      <h2>Profile</h2>
      <nuxt-link to="#">
        <section class="setting__link">
          <h4>Edit profile</h4>
          <p>Edit your name, profile picture and banner</p>
        </section>
      </nuxt-link>
      <nuxt-link to="#">
        <section class="setting__link">
          <h4>Account settings</h4>
          <p>E-mail, password</p>
        </section>
      </nuxt-link>
      <h2>Events</h2>
      <nuxt-link :to="`/users/${user.username}/settings/my-events`">
        <section class="setting__link">
          <h4>My events</h4>
          <p>View, edit or remove your events</p>
        </section>
      </nuxt-link>
      <h2>Application</h2>
      <nuxt-link :to="`/users/${user.username}/settings/my-events`">
        <section class="setting__link">
          <h4>About</h4>
          <p>About this app</p>
        </section>
      </nuxt-link>
      <nuxt-link :to="`/users/${user.username}/settings/my-events`">
        <section class="setting__link">
          <h4>Privacy Policy</h4>
          <p>We do care about privacy.</p>
        </section>
      </nuxt-link>
      <v-button class="primary control" @click.native="signOut"
        >Log out</v-button
      >
    </section>
  </div>
</template>

<script>
import Card from '~/components/cards/Card'
import Button from '~/components/ui/Button'
import BackLink from '~/components/ui/BackLink'
export default {
  layout: 'no_nav',
  middleware: ['authenticated', 'isSelf', 'userData'],
  components: {
    Card,
    'v-button': Button,
    BackLink
  },
  computed: {
    user() {
      return this.$store.getters['user/getSettingsData']
    }
  },
  methods: {
    signOut() {
      this.$store.commit('user/signOut')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  &__img {
    height: 56px;
    width: 56px;
    border-radius: 50%;
    border: 2px solid app-color('background');
    box-shadow: 0 5px 10px #00000020;
    margin-right: 16px;
  }

  &__details {
    display: flex;
    align-items: center;
    padding: 16px;
  }
}

h2 {
  margin-top: 16px;
}

.setting__link {
  padding: 16px 0;
  border-bottom: 1px solid app-color-level('background', -1);

  h4 {
    color: app-color('foreground');
  }

  p {
    font-weight: 400;
    font-size: 0.9rem;
    color: app-color-level('foreground', 4);
  }

  &:hover {
    h4 {
      color: app-color-level('primary');
    }
  }
}
</style>
