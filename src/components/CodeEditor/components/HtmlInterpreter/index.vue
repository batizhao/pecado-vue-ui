<template>
  <div>
    <div v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: 'html-interpreter',
  props: {
    content: String
  }
}
</script>
