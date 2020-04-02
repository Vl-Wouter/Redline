<template>
  <div>
    <div v-if="event" class="event">
      <header>
        <img
          :src="`http://localhost:4000/api/events/header/${event.header}`"
          alt="header image"
        />
        <a href="#" @click.prevent="$router.go(-1)" class="backBtn">Back</a>
        <div class="event__detail">
          <h2>{{ event.title }}</h2>
          <span>{{ event.attending.length }} going</span>
        </div>
        <div class="event__detail">
          <span>{{ event['__category__'].name }}</span>
          <span>{{ event.reviews && event.reviews.length }} reviews</span>
        </div>
      </header>
      <main>
        <attend-button
          :event="event"
          :is-attending="isAttending"
          v-if="$store.state.user.current"
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
          <div id="eventMap" class="map"></div>
          <h3>Location</h3>
          <p class="Location">{{ event.address }}</p>
        </section>
        <section class="event__prices">
          <h3>Prices</h3>
          <div v-if="event.prices">
            <div
              class="price"
              v-for="(price, index) in event.prices"
              :key="index"
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
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import DescriptionBlock from '~/components/events/DescriptionBlock'
import AttendButton from '~/components/events/AttendButton'
export default {
  layout: 'no_nav',
  components: {
    DescriptionBlock,
    AttendButton
  },
  data: () => ({
    event: null,
    loading: true,
    error: null,
    map: null
  }),
  computed: {
    cleanDescription() {
      return this.event ? this.$sanitize(this.event.description) : null
    },
    isAttending() {
      if (this.$store.state.user.current) {
        return this.event.attending.find(
          (attendee) => attendee.userId === this.$store.state.user.current.id
        )
      }
      return false
    }
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get(
        `/events/${this.$route.params.slug}`
      )
      this.event = data
      this.$nextTick(function() {
        const { longitude, latitude } = this.event
        mapboxgl.accessToken = process.env.MAPBOX_KEY
        this.map = new mapboxgl.Map({
          container: 'eventMap',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [longitude, latitude],
          zoom: 12,
          interactive: false
        })
        new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(this.map)
      })
    } catch (error) {
      this.error = error.response ? error.response.data : error
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
header {
  height: auto;
  img {
    height: 200px;
    width: 100vw;
    object-fit: cover;
    margin-left: -16px;
    margin-bottom: 8px;
    border-radius: 0 0 4px 4px;
  }

  .backBtn {
    position: absolute;
    top: 16px;
    left: 0px;
  }

  h2 {
    margin: 4px 0;
  }
}

.overlay {
  position: absolute;
  background: app-color('background');
  padding: 16px;
  box-shadow: 0 -5px 10px #00000020;
  width: 100%;
  z-index: 999;
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 16px;
  }

  &[direction='down'] {
    position: absolute;
    bottom: 0;
    padding-bottom: 64px;

    &.out {
      transform: translateY(100%);
      transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }
  }
}

.event {
  min-height: 100vh;
  position: relative;
  padding-bottom: 64px;

  h3 {
    text-align: center;
  }

  &__detail {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
  }

  &__date {
    width: 100vw;
    margin-left: -16px;
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
  }

  &__prices .price {
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

.map {
  width: 100vw;
  height: 200px;
  margin: 40px 0;
  margin-left: -16px;
  position: relative;
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
