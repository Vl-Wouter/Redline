<template>
  <div v-if="user">
    <header class="header">
      <nuxt-link v-if="isSelf" to="settings" append
        ><a class="profile__settings"><unicon name="cog"/></a
      ></nuxt-link>
      <img
        src="https://images.unsplash.com/photo-1526834311229-9640c1dd5e82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
        alt="header image"
        class="header__image"
      />
      <div class="header__profile">
        <div class="profile__img">
          <img
            :src="`${apiURL}/auth/${user.username}/avatar`"
            alt="profile image"
          />
        </div>
        <div class="profile__info">
          <h3>{{ user.firstName }} {{ user.lastName }}</h3>
          <p>
            {{ user.username }} {{ user.igHandle ? `— @${user.igHandle}` : '' }}
          </p>
        </div>
      </div>
    </header>
    <section class="vehicles">
      <span v-if="isSelf && user.vehicles.length === 0">Add a new vehicle</span>
    </section>
    <main class="tab">
      <section class="tab__header">
        <v-button
          :class="{ primary: currentTab === 0 }"
          @click.native="setTab(0)"
          >Events</v-button
        >
        <v-button
          :class="{ primary: currentTab === 1 }"
          @click.native="setTab(1)"
          >Albums</v-button
        >
        <v-button
          :class="{ primary: currentTab === 2 }"
          @click.native="setTab(2)"
          >Articles</v-button
        >
      </section>
      <main class="tab__content">
        <section v-if="currentTab === 0">
          <small-event-card
            v-for="attendEvent in user.attendingEvents"
            :key="attendEvent.id"
            :event="attendEvent.event"
          />
        </section>
        <section v-if="currentTab === 1">
          <p>This user doesn't have any albums</p>
        </section>
      </main>
    </main>
  </div>
</template>

<script>
import Button from '~/components/ui/Button'
import SmallEventCard from '~/components/cards/SmallEventCard'
export default {
  layout: 'noMargin',
  components: {
    'v-button': Button,
    SmallEventCard
  },
  data: () => ({
    currentTab: 0,
    user: null,
    loading: true,
    apiURL: process.env.API_URL
  }),
  computed: {
    isSelf() {
      return (
        this.$store.state.user.current &&
        this.user.id === this.$store.state.user.current.id
      )
    }
  },
  async mounted() {
    try {
      const { username } = this.$route.params
      const { data: user } = await this.$axios.get(`/auth/${username}`)
      this.user = user
    } catch (error) {
      const errObj = error.response
        ? {
            message: error.response.data.message,
            statusCode: error.response.data.statusCode
          }
        : { message: error.message, statusCode: error.status }
      this.$nuxt.error(errObj)
    }
  },
  methods: {
    setTab(tab) {
      this.currentTab = tab
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;

  &__image {
    max-height: 200px;
    width: 100%;
    object-fit: cover;
  }

  &__profile {
    display: flex;
    justify-content: space-between;
    height: auto;
    position: relative;
    align-items: flex-end;
    transform: translateY(-50%);
    height: 100px;
    padding: 0 32px;
    margin-bottom: 16px;
  }
}

.profile {
  &__img {
    flex: 0 0 45%;

    img {
      width: 100%;
      border-radius: 50%;
      border: 8px solid app-color('background');
    }
  }

  &__info {
    text-align: right;
  }

  &__settings {
    position: absolute;
    top: 16px;
    right: 16px;
    background: app-color();
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;

    .unicon {
      height: 24px;
      margin: 0;
      fill: app-color('background');
    }
  }
}

.vehicles {
  margin: 32px 16px;
}

.tab {
  padding: 0 16px;

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .btn {
      width: 100%;
      background: app-color-level('background', -0.8);
      border-radius: 0;

      &.primary {
        background: app-color();
      }

      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }
}
</style>
