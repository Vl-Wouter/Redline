<template>
  <div>
    <div v-if="event" class="event">
      <header>
        <img
          :src="`http://localhost:4000/api/events/header/${event.header}`"
          alt="header image"
        />
        <a href="#" class="backBtn" @click.prevent="$router.go(-1)">Back</a>
        <div class="event__detail">
          <section>
            <h2>{{ event.title }}</h2>
            <span>{{ event['__category__'].name }}</span>
          </section>
          <section>
            <v-button class="text-primary" @click.native="openAttendList"
              >{{ event.attending.length }} going</v-button
            >
            <v-button class="text-primary" @click.native="openReviews"
              >{{
                (event.reviews && event.reviews.length) || 0
              }}
              reviews</v-button
            >
          </section>
        </div>
      </header>
      <main>
        <attend-button
          v-if="$store.state.user.current"
          id="attendBtn"
          :event="event"
          :is-attending="isAttending"
          @attend-event="attendEvent"
          @leave-event="leaveEvent"
          @set-error="error = error"
          >{{ isAttending ? 'Leave event' : "I'm Going" }}</attend-button
        >
        <section class="event__date">
          <unicon name="calendar-alt" height="18" />
          <div class="times">
            <h3>{{ event.startTime | localDate }}</h3>
            <p>
              {{ event.startTime | localTime }} —
              {{ event.endTime | localTime }}
            </p>
          </div>
        </section>
        <description-block expandable :content="event.description" />
        <section class="event__location">
          <Map :center="mapCenter" />
          <h3>Location</h3>
          <p class="Location">{{ event.address }}</p>
        </section>
        <section class="event__prices">
          <h3>Prices</h3>
          <div v-if="event.prices">
            <div
              v-for="(price, index) in event.prices"
              :key="index"
              class="price"
            >
              <p class="category">{{ price.category }}</p>
              <p class="price">{{ price.price | toEUR }}</p>
            </div>
          </div>
          <div v-else>
            <div class="price">
              <p class="category">Everyone</p>
              <p class="price">{{ 0 | toEUR }}</p>
            </div>
          </div>
        </section>
      </main>
      <attend-list
        id="attendList"
        ref="attendList"
        :attendees="event.attending"
      />
      <review-list
        id="reviewList"
        ref="reviewList"
        :reviews="event.reviews"
        :event="event"
        @add-review="addReview"
      />
    </div>
  </div>
</template>

<script>
import DescriptionBlock from '~/components/events/DescriptionBlock'
import Button from '~/components/ui/Button'
import AttendButton from '~/components/events/AttendButton'
import Map from '~/components/Map'
import AttendList from '~/components/events/AttendList'
import ReviewList from '~/components/events/ReviewList'
export default {
  layout: 'noNavNoMargin',
  middleware: 'events',
  components: {
    DescriptionBlock,
    AttendButton,
    AttendList,
    ReviewList,
    'v-button': Button,
    Map
  },
  data: () => ({
    loading: true,
    error: null
  }),
  computed: {
    cleanDescription() {
      return this.event ? this.$sanitize(this.event.description) : null
    },
    event() {
      console.log(this.$route)
      const { slug } = this.$route.params
      return this.$store.getters['events/getBySlug'](slug)
    },
    isAttending() {
      if (this.$store.state.user.current) {
        const found = this.event.attending.find(
          (attendee) => attendee.userId === this.$store.state.user.current.id
        )
        if (found) {
          return true
        } else {
          return false
        }
      }
      return false
    },
    isOwnerOrAdmin() {
      const user = this.$store.state.user.current
      if (user) {
        return (
          user.id === this.event.organiser.id ||
          user.roles.includes('ADMIN') ||
          user.roles.includes('MODERATOR')
        )
      } else {
        return false
      }
    },
    mapCenter() {
      if (!this.event) return [4.35142, 50.849068]
      return [this.event.longitude, this.event.latitude]
    }
  },
  async mounted() {
    // const { slug } = this.$route.params
    // const event = this.$store.getters['events/getBySlug'](slug) // Try to get cached event first
    // if (!event) {
    //   try {
    //     const { data: event } = await this.$axios.get(`/events/${slug}`) // Get from server is cache is not found
    //     this.event = event
    //   } catch (error) {
    //     this.error = error.response ? error.response.data : error
    //   }
    // } else {
    //   this.event = event
    // }
  },
  methods: {
    attendEvent(data) {
      this.$store.commit('events/updateEvent', { id: this.event.id, data })
    },

    leaveEvent(data) {
      this.$store.commit('events/updateEvent', { id: this.event.id, data })
    },
    addReview(review) {
      this.$store.dispatch('events/addReview', review)
    },
    openAttendList() {
      this.$refs.attendList.toggle()
    },
    openReviews() {
      this.$refs.reviewList.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  height: auto;
  img {
    height: 200px;
    width: 100vw;
    object-fit: cover;
    margin-bottom: 8px;
    border-radius: 0 0 4px 4px;
  }

  .backBtn {
    position: absolute;
    top: 16px;
    left: 16px;
  }

  h2 {
    margin: 4px 0;
  }
}

.event {
  min-height: 100vh;
  position: relative;
  padding-bottom: 64px;
  overflow-x: hidden;

  h3 {
    text-align: center;
  }

  &__detail {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
    padding: 0 16px;

    button {
      display: block;
      text-align: right;
      padding: 0;
      margin: 8px 0;
    }
  }

  &__date {
    width: 100vw;
    padding: 32px 16px;
    background: app-color-level('background', -0.5);
    display: flex;
    align-items: baseline;
    margin-bottom: 32px;

    .unicon {
      display: inline;
      height: 16px;
      display: flex;
      align-items: center;
      fill: app-color('primary');
      margin-right: 16px;
    }

    p {
      color: app-color-level('foreground', 3);
    }
  }

  &__location {
    text-align: center;
    margin-bottom: 32px;
    padding: 0 16px;

    .map {
      margin-left: -16px;
    }
  }

  &__prices {
    padding: 0 16px;
    .price {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin: 16px 0;
      border-bottom: 1px solid app-color-level('background', -1);

      &:last-child {
        border: none;
      }

      .category {
        font-weight: 700;
        color: app-color();
      }
    }
  }
}

.map {
  width: 100vw;
  height: 200px;
  margin: 40px 0;
  position: relative;
}

@media screen and (min-width: 1024px) {
  .event {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: 100vh auto;
    gap: 32px;

    header {
      grid-row: 1 / auto;
      grid-column: 1 / 2;
      width: 100%;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      .event__detail {
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }

    main {
      grid-column: 2;
      display: grid;
      grid-template-rows: repeat(2, 50%);
      padding: 16px 0;

      .description {
        grid-row: 1 / 2;
        grid-column: 1;
      }
    }
  }
}
</style>

<style lang="scss">
a {
  text-decoration: none;
}
div.mapboxgl-marker {
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
}
.mapboxgl-ctrl-attrib-inner {
  position: absolute;
  bottom: 0;
  left: 16px;
  a {
    color: app-color-level('foreground', 4);
    font-size: 0.8rem;
    text-align: left;
    font-weight: 400;
  }
}
</style>
