<template>
  <main class="w-full lg:flex lg:flex-row">
    <section class="w-1/2 hidden lg:block h-screen bg-redline">
      <img
        src="https://images.unsplash.com/photo-1537740547516-098bdb470e11?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
        alt="sportscar"
        class="w-full h-full object-cover"
      />
    </section>
    <section
      class="h-screen w-full lg:w-1/2 flex flex-col items-center justify-center"
    >
      <h1 class="font-bold text-xl mb-2">Log in.</h1>
      <p class="text-sm text-gray-800">
        Gain access to all features Redline has to offer.
      </p>
      <nuxt-link to="/signup" class="text-sm text-redline-light mb-4"
        >No account? Sign up here.</nuxt-link
      >
      <form method="post" class="w-full px-8 lg:px-16 mt-4 space-y-4">
        <section
          class="w-full border rounded flex flex-row form-group overflow-hidden"
        >
          <label
            for="email"
            class="w-12 bg-gray-200 py-2 text-center text-redline"
            ><font-awesome-icon icon="envelope"
          /></label>
          <input
            id="email"
            type="email"
            name="email"
            class="px-4 w-full"
            placeholder="jeff.gordon@gmail.com"
          />
        </section>
        <section
          class="w-full border rounded flex flex-row form-group overflow-hidden"
        >
          <label
            for="password"
            class="w-12 bg-gray-200 py-2 text-center text-redline"
            ><font-awesome-icon icon="lock"
          /></label>
          <input
            id="password"
            type="password"
            name="password"
            class="px-4 w-full"
          />
        </section>
        <section class="w-full">
          <button
            type="submit"
            class="w-full bg-redline text-white py-2 rounded"
          >
            Log in
          </button>
        </section>
      </form>
      <nuxt-link to="/" class="text-center text-redline-light my-4"
        >Go back</nuxt-link
      >
    </section>
  </main>
</template>

<script>
export default {
  middleware({ store, redirect, from }) {
    if (store.state.user.current) {
      redirect(from)
    }
  },
}
</script>

<style lang="scss" scoped>
.form-group:focus-within {
  @apply border-redline-light border border-solid;
  input {
    outline: none;
  }
}
</style>
