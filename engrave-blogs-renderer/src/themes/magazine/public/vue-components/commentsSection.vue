<template lang="pug">
  tree-view.comments-tree(:root='tree' :show-root='false')
    template(v-slot:item='{ node }')
      .comment-tree
        img.comment-avatar(src="//steemitimages.com/u/jblew/avatar")
        .comment-content
          h4= "jblew"
          small.text-muted
            span(class="oi oi-clock" title="icon clock" aria-hidden="true")
            //- =moment(date).format('DD MMMM YYYY, h:mm:ss')
          p {{ node.body }}
          small.text-muted
            ul
              li.next-item
                span(class="oi oi-thumb-up" title="icon like" aria-hidden="true")
                ="5"
              li.next-item
                span(class="oi")
                ="$" + "0.10"
              li.next-item
                span.comment-reply-link Reply
              li.next-item
                span(class="oi oi-caret-bottom" title="icon collapse" aria-hidden="true")
                ="Collapse"
</template>

<script>
import treeView from "./treeView.vue";

export default {
  data() {
    return {
      url:
        "my-talk-about-steem-and-its-ecosystem-during-meetup-at-crypto-cracow-poland-with-over-200-attendees-or-pl-moja-prelekcja-na",
      tree: {
        path: "/",
        body: "root",
        children: [
          {
            path: "/bardzo-fajny-post",
            body: "Bardzo fajny post!",
            children: [
              {
                path: "/bardzo-fajny-post/czy-to-jest/",
                body: "Czy to jest szczery komentarz?",
                children: [
                  {
                    path: "/bardzo-fajny-post/czy-to-jest/",
                    body: "ryba",
                    children: []
                  },
                  {
                    path: "/bardzo-fajny-post/o-to-chyba-jest/",
                    body: "koń",
                    children: []
                  }
                ]
              },
              {
                path: "/bardzo-fajny-post/o-to-chyba-jest/",
                body: "O, to chyba jest bot!",
                children: []
              }
            ]
          }
        ]
      }
    };
  },
  components: {
    treeView
  }
};
</script>
