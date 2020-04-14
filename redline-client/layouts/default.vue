<template>
  <main class="main">
    <nuxt />
    <v-nav />
  </main>
</template>

<script>
import Nav from '@/components/Nav'
export default {
  components: {
    'v-nav': Nav
  }
}
</script>
<style lang="scss">
@import url('https://use.typekit.net/rlk3sai.css');
html {
  /* font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif; */
  font-family: $base-font-family;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.main {
  padding: 0 16px;
  padding-top: 32px;
  min-height: 100vh;
  background: #fcfcfc;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

@for $size from 1 through 6 {
  h#{$size} {
    font-family: $header-font-family;
  }
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
