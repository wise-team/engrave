<template lang="pug">
  tree-view.comments-tree(:root='root' :show-root='false')
    template(v-slot:item='{ node, expanded }')
      .comment-tree
        img.comment-avatar(:src="`//steemitimages.com/u/${node.author}/avatar`")
        .comment-content
          h4 {{ node.author }}
          small.text-muted
            span(class="oi oi-clock" :title='node.data.created | moment("DD MMMM YYYY, h:mm:ss")' aria-hidden="true")
            = "{{ node.data.created | moment('from') }}"
          p {{ node.body }}
          small.text-muted
            ul
              li.next-item
                span(class="oi oi-thumb-up" title="like icon" aria-hidden="true") {{ node.data.net_votes }}
              li.next-item
                span(class="oi") ${{ node.payout }}
              li.next-item
                span.comment-reply-link Reply
              span(v-if="node.data.children")
                li.next-item(v-if="expanded")
                  span(class="oi oi-caret-top" aria-hidden="true")
                  = "Collapse"
                li.next-item(v-else)
                  span(class="oi oi-caret-bottom" aria-hidden="true")
                  = "Expand"

</template>

<script lang="ts">
import TreeView from "./TreeView.vue";
import Comment from "../ts/comment";

import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    TreeView
  }
})
export default class CommentsSection extends Vue {
  url =
    "my-talk-about-steem-and-its-ecosystem-during-meetup-at-crypto-cracow-poland-with-over-200-attendees-or-pl-moja-prelekcja-na";
  root = new Comment("noisy", this.url, "", {});

  beforeMount() {
    this.root.loadChildren();
  }
}
</script>
