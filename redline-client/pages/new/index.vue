<template>
  <main class="container mx-auto mt-2">
    <h1 class="text-center font-bold text-xl">Add new content</h1>
    <section
      class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:w-1/2 lg:mx-auto lg:px-0 px-2 py-2"
    >
      <icon-card-link
        icon="calendar"
        title="Event"
        subtitle="Add a new event to the calendar"
        dest="event"
      />
      <icon-card-link
        icon="images"
        title="Photos"
        subtitle="Show off your creations"
        dest="album"
      />
      <!-- <icon-card-link
        icon="newspaper"
        title="Article"
        subtitle="Share your thoughts"
        dest="article"
      /> -->
    </section>
  </main>
</template>

<script>
import IconCardLink from '~/components/IconCardLink'
export default {
  layout: 'app',
  middleware: 'auth',
  components: {
    IconCardLink,
  },
  head() {
    return {
      title: 'Add content | Redline',
    }
  },
}
</script>

<style lang="scss" scoped></style>
