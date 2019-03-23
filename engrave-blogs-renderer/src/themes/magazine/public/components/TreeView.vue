<template lang="pug">
  .tree-view
    .item(@click='toggleChildren' v-if='showRoot')
      slot(name='item' :node='root')
    .children(v-if='showChildren()')
      tree-view(v-for='(node, index) in root.children' :key='index' :root='node')
        template(v-slot:item='props')
          slot(name='item' :node='props.node')
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TreeView extends Vue {
  @Prop()
  root!: string;

  @Prop({ default: true, required: false })
  showRoot!: boolean;

  childrenExpanded = true;

  showChildren() {
    return this.childrenExpanded;
  }

  toggleChildren(event: any) {
    this.childrenExpanded = !this.childrenExpanded;
    this.$emit("click", event);
  }
}
</script>
