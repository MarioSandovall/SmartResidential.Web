<template>
  <v-card>
    <v-card-title>
      <label class="title">{{ title }}</label>
    </v-card-title>
    <v-card-text>
      <v-container>
        <h3>{{ content }}</h3>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')">{{ $t('button.close') }}</v-btn>
      <v-btn :color="btnColor" @click="$emit('save')">
        {{ $t('button.continue') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    title: { type: String, required: true },
    content: { type: String, required: true },
    btnColor: { type: String, required: true }
  },
  name: 'ConfirmationDialog'
}
</script>
