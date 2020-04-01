<template>
  <div>
    <div v-if="event" class="event">
      <header>
        <img
          :src="`http://localhost:4000/events/header/${event.header}`"
          alt="header image"
        />
        <div class="event__detail">
          <h2>{{ event.title }}</h2>
          <span>155 going</span>
        </div>
        <div class="event__detail">
          <span>{{ event.category }}</span>
          <span>Recommended (6)</span>
        </div>
      </header>
      <main>
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
        <!-- <section v-html="cleanDescription"></section>
        <a
          href="#"
          data-target="descriptionOverlay"
          @click.prevent="toggleOverlay($event)"
          >Read more...</a
        > -->
        <section class="event__location">
          <div id="eventMap" class="map" @load="createMap"></div>
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
export default {
  components: {
    DescriptionBlock
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
    }
  },
  async mounted() {
    const { slug } = this.$route.params
    try {
      const { data } = await this.$axios.get(`/events/${slug}`)
      this.event = data
      this.loading = false
      this.map = new mapboxgl.Map({
        container: 'eventMap',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 12
      })
      // mapboxgl.accessToken = process.env.MAPBOX_KEY
    } catch (error) {
      this.error = error.response ? error.response.data : error
    }
  },
  methods: {
    toggleOverlay(event) {
      const { target } = event.target.dataset
      document.querySelector(`#${target}`).classList.toggle('out')
    },
    createMap() {
      console.log('Map creation')
      this.map = new mapboxgl.Map({
        container: 'eventMap',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 12
      })
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
    margin-left: -16px;
    margin-bottom: 8px;
    border-radius: 0 0 4px 4px;
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
  margin-bottom: 64px;

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
  margin-left: -16px;
  height: 200px;
}
</style>
