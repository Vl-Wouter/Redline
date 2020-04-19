<template>
  <div v-if="user" class="userPage">
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
          <img :src="`${apiURL}/img/${user.profileImg}`" alt="profile image" />
        </div>
        <div class="profile__info">
          <h3>{{ user.firstName }} {{ user.lastName }}</h3>
          <p>
            {{ user.username }} {{ user.igHandle ? `| @${user.igHandle}` : '' }}
          </p>
        </div>
      </div>
    </header>
    <section class="vehicles">
      <nuxt-link to="/new/vehicle" v-if="isSelf" class="vehicle__card">
        <card>
          <section class="card__content">
            <h3>Add a new vehicle</h3>
          </section>
        </card>
      </nuxt-link>
      <section
        v-for="vehicle in user.vehicles"
        :key="vehicle.id"
        class="vehicle__card"
      >
        <card>
          <img
            v-if="vehicle.photo"
            :src="`${apiURL}/img/${vehicle.photo}`"
            alt="Vehicle Image"
          />
          <section class="card__content">
            <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>
          </section>
        </card>
      </section>
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
import Card from '~/components/cards/Card'
export default {
  layout: 'noMargin',
  components: {
    'v-button': Button,
    SmallEventCard,
    Card
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
.userPage {
  overflow-x: hidden;
  padding-bottom: 64px;
}
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
  margin: 32px 0;
  margin-top: -16px;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  padding: 0 16px;
  overflow: auto;

  .vehicle__card {
    flex: 0 0 40%;
    margin: 0 1%;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .card {
    width: 100%;
    position: relative;
    padding-bottom: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      object-fit: cover;
      position: absolute;
    }

    img + .card__content {
      background: #00000080;
      color: app-color('background');
    }

    &__content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      padding: 8px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-end;
    }
  }

  // .vehicle__card {
  //   flex: 0 0 30%;
  //   margin: 0 1%;
  //   width: 100%;
  //   padding-bottom: 100%;
  //   position: relative;
  //   background: blue;

  //   .card {
  //     position: absolute;
  //     top: 0;
  //     left: 0;
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
