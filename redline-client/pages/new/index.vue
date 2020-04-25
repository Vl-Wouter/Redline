<template>
  <div>
    <header>
      <back-link text="Back" />
    </header>
    <main class="content__container">
      <nuxt-link to="/new/event">
        <card class="content__type">
          <h1>Event</h1>
          <p>Want to get more people to find your local meet? Post it here!</p>
        </card>
      </nuxt-link>
    </main>
  </div>
</template>

<script>
import BackLink from '~/components/ui/BackLink'
import Card from '~/components/cards/Card'
export default {
  layout: 'no_nav',
  middleware: 'authenticated',
  components: {
    BackLink,
    Card
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  button.btn {
    .unicon {
      fill: app-color();
      display: inline-block;
      height: 24px;
    }
    line-height: 24px;
    display: flex;
    align-items: center;
    padding: 0;
  }
}

.content__container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  gap: 16px;
}

.content__type {
  text-align: center;
  padding: 8px;

  h1 {
    color: app-color();
  }

  p {
    color: app-color-level('foreground', 4);
    font-size: 0.9rem;
  }
}
</style>
