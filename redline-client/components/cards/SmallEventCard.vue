<template>
  <card>
    <section class="card__header">
      <span class="small category">{{ event.category }}</span>
      <span class="small">{{ event.startTime | localDateTime }}</span>
    </section>
    <section class="card__main">
      <h2>{{ event.title }}</h2>
    </section>
    <section class="card__footer">
      <span class="small primary">{{
        event.price ? event.price : 'FREE'
      }}</span>
      <span class="small">{{ event.address.split(',')[0] }}</span>
    </section>
  </card>
</template>

<script>
import Card from './Card'
export default {
  components: {
    Card
  },
  props: {
    event: Object
  }
}
</script>

<style lang="scss" scoped>
.card__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  .category {
    background: app-color('primary');
    padding: 4px 8px;
    text-transform: capitalize;
    border-radius: 4px;
    color: app-color('background');
  }
}

.card__main {
  margin: 16px 0;
  padding: 0;
  text-transform: uppercase;
}

.card__footer {
  display: flex;
  justify-content: space-between;
}

.small {
  font-size: 0.9rem;
  color: app-color-level('background', -4);

  @each $name, $color in $app-colors {
    &.#{$name} {
      color: app-color($name);
    }
  }
}
</style>
