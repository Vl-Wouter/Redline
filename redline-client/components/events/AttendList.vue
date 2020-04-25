<template>
  <aside class="overlay" :class="{ out: !open }">
    <header>
      <h3>{{ attendees.length }} going</h3>
      <v-button @click.native="toggle"><unicon name="times"/></v-button>
    </header>
    <div v-for="person in attendees" :key="person.id" class="person">
      <div class="image">
        <img v-if="person.vehicle" src="" alt="Vehicle image" />
        <img
          v-else-if="person.user && person.user.profileImg"
          :src="`${apiURL}/img/${person.user.profileImg}`"
          alt="User image"
        />
      </div>
      <div>
        <p>{{ person.user.firstName }} {{ person.user.lastName }}</p>
        <p>
          {{
            person.vehicle
              ? person.vehicle.brand + ' ' + person.vehicle.model
              : 'No Vehicle'
          }}
        </p>
      </div>
    </div>
  </aside>
</template>

<script>
import Button from '~/components/ui/Button'
export default {
  components: {
    'v-button': Button
  },
  props: {
    attendees: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data: () => ({
    open: false,
    apiURL: process.env.API_URL
  }),
  methods: {
    toggle() {
      if (this.open) this.open = false
      else this.open = true
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  height: 100%;
  background: app-color('background');
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  padding: 16px;
  transform: translateX(0);
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  &.out {
    transform: translateX(100vw);
    transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  }
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  button.btn {
    padding: 0;
    background: none;
    height: 24px;
    color: app-color();
    .unicon {
      height: 24px;
    }
  }
}

.person {
  width: 100%;
  display: grid;
  height: 56px;
  grid-template-columns: 56px 1fr;
  grid-template-rows: 1fr;
  column-gap: 16px;
  margin: 16px 0;
  align-items: center;

  .image {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    overflow: hidden;
    background: lightblue;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

@media screen and (min-width: 1024px) {
  .overlay {
    position: relative;

    &.out {
      transform: translateX(0);
    }
  }
}
</style>
