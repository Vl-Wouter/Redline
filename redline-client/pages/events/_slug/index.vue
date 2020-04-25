<template>
  <div class="eventPage">
    <div v-if="event" class="event">
      <header>
        <img
          :src="`http://localhost:4000/api/events/header/${event.header}`"
          alt="header image"
        />
        <back-link class="backBtn" />
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
      <modal v-if="modal.isOpen">
        <h2>Attend event</h2>
        <form-field
          label="Are you coming with a car?"
          field="vehicleId"
          helper="You can also leave this field as is to attend without a car"
        >
          <select-input
            name="Vehicle"
            :options="userVehicles"
            v-model="modal.form.vehicleId"
          />
        </form-field>
        <v-button class="control primary" @click.native="setAttending"
          >Attend event</v-button
        >
      </modal>
    </div>
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
</template>

<script>
import DescriptionBlock from '~/components/events/DescriptionBlock'
import Button from '~/components/ui/Button'
import AttendButton from '~/components/events/AttendButton'
import Map from '~/components/Map'
import AttendList from '~/components/events/AttendList'
import ReviewList from '~/components/events/ReviewList'
import BackLink from '~/components/ui/BackLink'
import Modal from '~/components/ui/Modal'
import { FormField, SelectInput } from '~/components/forms'
export default {
  layout: 'noNavNoMargin',
  middleware: 'events',
  components: {
    DescriptionBlock,
    AttendButton,
    AttendList,
    ReviewList,
    'v-button': Button,
    Map,
    BackLink,
    Modal,
    FormField,
    SelectInput
  },
  data: () => ({
    modal: {
      isOpen: false,
      form: {
        vehicleId: null
      }
    },
    loading: true,
    error: null
  }),
  computed: {
    userVehicles() {
      const vehicles = this.$store.getters['user/getVehicles']
      const options = [
        {
          id: null,
          name: 'No vehicle'
        }
      ]
      vehicles.forEach((item) => {
        options.push({
          id: item.id,
          name: `${item.brand} ${item.model}`
        })
      })
      return options
    },
    cleanDescription() {
      return this.event ? this.$sanitize(this.event.description) : null
    },
    event() {
      const { slug } = this.$route.params
      const event = this.$store.getters['events/getBySlug'](slug)
      if (!event)
        this.$nuxt.error({
          message: `Cannot find the event: ${slug}`,
          statusCode: 404
        })
      return event
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
  methods: {
    attendEvent(data) {
      this.modal.isOpen = true
    },
    async setAttending() {
      try {
        const { data } = await this.$axios.post(
          `/events/${this.event.id}/attend`,
          this.modal.form
        )
        this.$store.commit('events/updateEvent', { id: this.event.id, data })
        this.modal.isOpen = false
      } catch (error) {
        console.log(error)
      }
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
    color: app-color('background');
    background: app-color();
    border-radius: 8px;
    padding: 0 8px;
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
  .eventPage {
    width: 70%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 3fr 1fr;
    min-height: 100vh;
    box-shadow: 0 0 10px #00000020;
  }

  .event {
    grid-row: 0;
    grid-column: 1 / 2;
  }

  #attendList {
    grid-row: 0;
    grid-column: 2 / 3;
    width: 100%;
  }

  #attendBtn {
    position: relative;
    width: 100%;
  }

  #reviewList {
    grid-row: 2;
    grid-column: 1 / 3;
    width: 100%;
    position: relative;
    transform: translateX(0);
    box-shadow: none;

    &.out {
      transform: translateX(0);
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
