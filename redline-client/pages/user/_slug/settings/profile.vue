<template>
  <main class="container px-2 mx-auto my-4 lg:w-1/2">
    <header class="flex flex-row space-x-4">
      <button
        class="text-redline"
        @click="$router.push(`/user/${user.username}/settings`)"
      >
        <font-awesome-icon icon="arrow-left" />
      </button>
      <h2 class="font-bold text-lg">Change profile settings</h2>
    </header>
    <main>
      <form @submit.prevent="submit" method="post">
        <f-group label="First Name" field="firstName">
          <input
            v-model="form.firstName"
            type="text"
            name="firstName"
            id="firstName"
          />
        </f-group>
        <f-group label="Last Name" field="lastName">
          <input
            v-model="form.lastName"
            type="text"
            name="lastName"
            id="lastName"
          />
        </f-group>
        <f-group
          label="Change your role"
          helper="This will not influence your own experience in the app"
        >
          <section class="grid grid-cols-1 gap-4">
            <toggle-wrapper
              v-model="form.roles"
              type="radio"
              name="photographer"
              val="PHOTOGRAPHER"
            >
              <icon-card
                icon="camera"
                title="Photographer"
                subtitle="You like taking and sharing photos"
                :class="
                  form.roles === 'PHOTOGRAPHER' ? 'selected' : 'cursor-pointer'
                "
              />
            </toggle-wrapper>
            <toggle-wrapper
              v-model="form.roles"
              type="radio"
              name="owner"
              val="OWNER"
            >
              <icon-card
                icon="car"
                title="Owner"
                subtitle="You want to show off your car at events"
                :class="form.roles === 'OWNER' ? 'selected' : 'cursor-pointer'"
              />
            </toggle-wrapper>
            <toggle-wrapper
              v-model="form.roles"
              type="radio"
              name="organiser"
              val="ORGANISER"
            >
              <icon-card
                icon="calendar-plus"
                title="Organiser"
                subtitle="You want to share your events"
                :class="
                  form.roles === 'ORGANISER' ? 'selected' : 'cursor-pointer'
                "
              />
            </toggle-wrapper>
          </section>
        </f-group>
        <f-group label="Change your profile picture" field="profileImg">
          <file-input
            name="profileImg"
            labelElement
            @files="(fileData) => (form.profileImg = fileData)"
          >
            <section
              class="w-40 h-40 rounded-full bg-gray-400 flex justify-center items-center overflow-hidden cursor-pointer"
            >
              <img
                v-if="form.profileImg"
                :src="photoURL"
                alt="Profile Image"
                class="w-full h-full object-cover"
              />
              <div v-else class="text-gray-700 text-center">
                Click to choose an image
              </div>
            </section>
          </file-input>
        </f-group>
        <button class="w-full text-white bg-redline py-2 rounded" type="submit">
          Update profile
        </button>
      </form>
    </main>
  </main>
</template>

<script>
import axios from 'axios'
import ContentFormGroup from '~/components/ContentFormGroup'
import ToggleWrapper from '~/components/ToggleWrapper'
import IconCard from '~/components/IconCard'
export default {
  middleware: 'auth',
  components: {
    'f-group': ContentFormGroup,
    ToggleWrapper,
    IconCard,
  },
  asyncData({ params }) {
    return axios.get(`/api/users/${params.slug}`).then((res) => {
      return {
        user: res.data,
        form: {
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          profileImg: res.data.profileImg,
          roles: res.data.roles[0],
        },
      }
    })
  },
  data() {
    return {
      user: null,
      form: {
        firstName: null,
        lastName: null,
        profileImg: null,
        roles: null,
      },
    }
  },
  computed: {
    photoURL() {
      if (typeof this.form.profileImg === 'string') {
        return `/api/img/` + this.form.profileImg
      } else {
        return URL.createObjectURL(this.form.profileImg)
      }
    },
  },
  methods: {
    async submit() {
      try {
        const { profileImg: image, ...values } = this.form
        if (image && typeof image !== 'string') {
          console.log('Upload new image')
        }
        console.log(values)
        const { data } = await this.$axios.patch(
          `/api/users/${this.user.id}`,
          values
        )
        this.user = data
      } catch (err) {
        this.$toast.error(
          err.response ? err.response.data.message : err.message
        )
      }
    },
  },
}
</script>
