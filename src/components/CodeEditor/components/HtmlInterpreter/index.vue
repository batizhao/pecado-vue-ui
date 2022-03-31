<template>
  <div>
    <div v-html="content"></div>
  </div>
</template>

<script>
export default {
  props: {
    content: String
  }
}
</script>
