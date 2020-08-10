<template>
  <main class="container mx-auto lg:w-1/2 space-y-4">
    <h1 class="text-center font-bold text-xl text-redline mb-2">About us</h1>
    <p>
      Redline is a project built as a bachelor thesis at Artevelde University of
      Applied Sciences. It was built by Wouter Vlaeyen to prove the skills
      learned during the three year New Media Development program.
    </p>
    <p>
      Redline is built for petrolheads. And built by one. Putting together a
      passion with studies is a great way to enjoy building a project.
    </p>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <img src="ARTEVELDE.png" alt="Artevelde logo" />
    </div>
    <h2 class="font-bold">More information</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <icon-card-link dest="terms" icon="info" title="Terms of Service" />
      <icon-card-link dest="privacy" icon="user" title="Privacy Policy" />
    </div>
  </main>
</template>

<script>
import IconCardLink from '~/components/IconCardLink'
export default {
  layout: 'app',
  components: {
    IconCardLink,
  },
}
</script>
