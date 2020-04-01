<template>
  <div class="container">
    <section>
      <h1>Add a new event</h1>
    </section>
    <form
      method="POST"
      enctype="multipart/form-data"
      @submit.prevent="submitForm"
    >
      <section v-show="step === 0" class="form__step">
        <form-field
          label="Event Title"
          field="title"
          helper="Give the event a descriptive title"
        >
          <input
            id="title"
            v-model="form.title"
            type="text"
            name="title"
            autofocus
          />
        </form-field>
        <form-field
          label="Event Description"
          field="description"
          helper="Let the people know what's happening"
        >
          <ckeditor
            v-model="form.description"
            :editor="editor"
            class="editor"
          />
        </form-field>
        <form-field
          label="Category"
          field="category"
          helper="What kind of event is it?"
        >
          <input
            id="category"
            v-model="form.category"
            type="text"
            name="category"
          />
        </form-field>
        <form-field
          label="Header image"
          helper="Every event needs a great looking header"
        >
          <input
            id="header"
            type="file"
            name="header"
            class="file__input"
            @change="
              {
                handleFile($event)
              }
            "
          />
          <label id="fileInput" for="header" class="file__input--label"
            ><span><unicon name="upload" height="12px"/></span
            >{{ form.header.name || 'Choose a file' }}</label
          >
          <img id="preview-header" src="#" alt="" class="header__preview" />
        </form-field>
        <form-field label="Start Time" field="startTime">
          <datetime
            v-model="form.startTime"
            type="datetime"
            class="datetime__input"
          />
        </form-field>
        <form-field label="End Time" field="endTime">
          <datetime
            v-model="form.endTime"
            type="datetime"
            class="datetime__input"
          />
        </form-field>
      </section>
      <section v-show="step === 1" class="form__step">
        <form-field
          label="Address"
          field="address"
          helper="Where is everybody going?"
        >
          <input
            id="address"
            type="text"
            name="address"
            @blur="processAddress($event)"
          />
        </form-field>
        <div id="addressMap" class="map"></div>
      </section>
      <section v-show="step === 2" class="form__step">
        <form-field
          label="Prices"
          field="addPrice"
          helper="Want people to pay for entry? Or can everyone just come by for free? You decide!"
        >
          <input
            id="priceCat"
            v-model="priceInput.category"
            type="text"
            name="priceCat"
            placeholder="Category"
          />
          <input
            id="priceAmount"
            v-model="priceInput.price"
            type="number"
            name="priceAmount"
            placeholder="0,00"
          />
          <button @click.prevent="addPrice">Add price</button>
        </form-field>
        <div class="price__explanation">
          <p>Current prices</p>
          <p v-if="form.prices.length > 0" class="small">
            Double tap a price to remove it
          </p>
        </div>
        <div v-if="form.prices.length === 0" class="prices">
          <div class="price__view">
            <p>Everyone</p>
            <p>{{ 0 | toEUR }}</p>
          </div>
        </div>
        <div v-else class="prices">
          <div
            v-for="(price, index) in form.prices"
            :key="index"
            class="price__view"
            @dblclick="removePrice(index)"
          >
            <p>{{ price.category }}</p>
            <p>{{ price.price | toEUR }}</p>
          </div>
        </div>
      </section>
      <div class="button__container">
        <a v-if="step === 0" @click.prevent="$router.go(-1)">Cancel</a>
        <button v-else type="button" @click="step--">Back</button>
        <button v-if="step !== totalSteps" type="button" @click="step++">
          Next
        </button>
        <button v-else type="submit">Submit</button>
      </div>
    </form>
    <div class="progress">
      <div
        class="progress__content"
        :style="{ width: (step / totalSteps) * 100 + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Datetime } from 'vue-datetime'
import mapboxgl from 'mapbox-gl'
import FormField from '~/components/forms/FormField'
// // You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'
export default {
  layout: 'no_nav',
  components: {
    FormField,
    Datetime
  },
  data: () => ({
    editor: ClassicEditor,
    error: null,
    totalSteps: 0,
    step: 0,
    mapbox_token: null,
    map: {},
    marker: null,
    fileName: 'Choose a file',
    priceInput: {
      category: '',
      price: ''
    },
    form: {
      title: '',
      description: '',
      header: '',
      category: '',
      startTime: '',
      endTime: '',
      address: '',
      lat: '',
      lng: '',
      prices: []
    }
  }),
  mounted() {
    const totalSteps = document.querySelectorAll('.form__step').length - 1
    this.totalSteps = totalSteps
    mapboxgl.accessToken = process.env.MAPBOX_KEY
    this.map = new mapboxgl.Map({
      container: 'addressMap',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [4.35142, 50.849068],
      zoom: 12
    })
  },
  methods: {
    handleFile(event) {
      // console.log(event.target.files)
      this.form.header = event.target.files[0]
      this.fileName = event.target.files[0].name
      document.querySelector('#preview-header').src = URL.createObjectURL(
        event.target.files[0]
      )
    },
    async processAddress(event) {
      const searchTerm = event.target.value
      if (this.marker) {
        this.marker.remove()
        this.marker = null
      }
      try {
        const { data } = await this.$axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?access_token=${process.env.MAPBOX_KEY}`
        )
        const feature = data.features[0]

        this.form.lng = feature.center[0]
        this.form.lat = feature.center[1]
        this.form.address = feature.place_name

        this.map.flyTo({
          center: feature.center,
          speed: 0.8,
          zoom: 12,
          essential: true
        })
        this.marker = new mapboxgl.Marker()
          .setLngLat(feature.center)
          .addTo(this.map)
      } catch (error) {
        console.log(error)
      }
    },
    addPrice() {
      this.form.prices.push({ ...this.priceInput })
      this.priceInput.category = ''
      this.priceInput.price = ''
    },
    removePrice(index) {
      this.form.prices.splice(index, 1)
    },
    async submitForm() {
      console.log(this.form)
      const formData = new FormData()
      for (const key in this.form) {
        formData.append(key, this.form[key])
      }
      const { token } = this.$store.state.user.current
      try {
        const { data } = await this.$axios.post('/events', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log(data)
        // this.$router.push(`/events/${data.slug}`)
      } catch (error) {
        console.table(error)
        this.error = error
      }
    }
  }
}
</script>

<style lang="scss">
.datetime__input > input {
  border: none;
  width: 100%;
  padding: 8px 0;
  border-bottom: 1px solid app-color-level('background', -2);
  background: none;
  font-family: $base-font-family;
  font-size: 0.9rem;
}

.map {
  position: relative;
  overflow: hidden;

  div.mapboxgl-marker {
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
  }

  a {
    font-weight: 400;
    font-size: 0.6rem;
    color: app-color('foreground');
  }
}
</style>

<style lang="scss" scoped>
.editor {
  max-height: 400px;
}

.form__step {
  overflow: hidden;
}

.header__preview {
  width: 100%;
  height: auto;
}

.prices {
  font-size: 0.9rem;
  margin-bottom: 24px;
}

.price__view {
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  padding: 8px 8px;

  &:nth-child(odd) {
    background-color: app-color-level('primary', 8);
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}

.price__explanation {
  margin-bottom: 16px;
}

.file__input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  left: 0;
  z-index: -1;

  &:focus + .file__input--label {
    background: app-color-level('primary', 2);
    color: app-color('background');
  }

  &--label {
    width: 100%;
    padding: 8px 16px;
    margin: 8px 0;
    background: app-color();
    color: app-color('background');
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    display: block;

    .unicon {
      fill: app-color('background');
    }
  }
}

.button__container {
  display: flex;
  justify-content: space-between;
}

.progress {
  height: 16px;
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 0;

  &__content {
    height: 100%;
    width: 0;
    background: app-color-level();
    transition: all 0.3s cubic-bezier(0.85, 0, 0.15, 1);
  }
}

.small {
  font-size: 0.8rem;
  color: app-color-level('foreground', 2);
}
</style>
