<template>
  <aside
    class="overlay"
    :class="{
      out: !isOpen,
      fill: isFill,
      left: position === 'left',
      right: position === 'right'
    }"
  >
    <header class="overlay__header">
      <h3>{{ title }}</h3>
      <v-button class="text-primary" @click.native="toggleOverlay"
        ><unicon name="times" height="24"
      /></v-button>
    </header>
    <slot />
  </aside>
</template>

<script>
import Button from '../ui/Button'
export default {
  components: {
    'v-button': Button
  },
  props: {
    title: {
      type: String,
      default() {
        return 'Overlay'
      }
    },
    isFill: {
      type: Boolean
    },
    position: {
      type: String,
      default() {
        return 'left'
      }
    }
  },
  data: () => ({
    isOpen: false
  }),
  methods: {
    toggleOverlay() {
      if (this.isOpen) this.isOpen = false
      else this.isOpen = true
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  height: 100%;
  background: app-color('background');
  width: auto;
  position: fixed; //Fixed position prevents overflow
  top: 0;
  padding: 16px;
  transform: translateX(0);
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  box-shadow: 0 0 10px #00000020;
  z-index: 9;

  &.right {
    right: 0;
  }

  &.left {
    left: 0;
  }

  &.fill {
    width: 100vw;
  }

  &.out {
    transform: translateX(100%);
    transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    button.btn {
      padding: 0;
      margin: 0;
      height: 24px;
      display: flex;
      background: none;

      .unicon {
        height: 24px;
      }
    }
  }
}

@media (min-width: 900px) {
  .overlay {
    &.fill {
      width: auto;
    }
  }
}
</style>
