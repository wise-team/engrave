<template lang="pug">
  .tree-view
    .item(@click='toggleChildren' v-if='showRoot')
      slot(name='item' :node='root')
    .children(v-if='showChildren()')
      tree-view(v-for='(node, index) in root.children' :key='index' :root='node')
        template(v-slot:item='props')
          slot(name='item' :node='props.node')
</template>

<script>
export default {
  props: {
    root: {
      required: true
    },
    showRoot: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      childrenExpanded: true
    };
  },
  methods: {
    showChildren() {
      return this.childrenExpanded;
    },

    toggleChildren(event) {
      this.childrenExpanded = !this.childrenExpanded;
      this.$emit("click", event);
    }
  }
};
</script>
