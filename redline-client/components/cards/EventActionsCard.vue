<template>
  <card>
    <section class="card__header small">
      <span class="category">{{ event.__category__.name }}</span>
      <span>{{ event.startTime | localDateTime }}</span>
    </section>
    <main class="card__main">
      <h3>{{ event.title }}</h3>
      <p class="desc small">{{ event.description }}</p>
    </main>
    <section class="card__footer">
      <v-button
        class="control text-info"
        @click.native="$router.push(`/events/${event.slug}`)"
        ><unicon name="eye" height="16" /> View</v-button
      >
      <v-button
        class="control text-primary"
        @click.native="$router.push(`/events/${event.slug}/edit`)"
        ><unicon name="edit-alt" height="16" /> Edit</v-button
      >
      <v-button
        class="control text-error"
        @click.native="$emit('delete-event', event.id)"
        ><unicon name="trash" height="16" /> Delete</v-button
      >
    </section>
  </card>
</template>

<script>
import Button from '../ui/Button'
import Card from './Card'
export default {
  components: {
    Card,
    'v-button': Button
  },
  props: {
    event: {
      type: Object,
      default() {
        return null
      }
    }
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

  h3 {
    text-transform: uppercase;
  }

  .desc {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
