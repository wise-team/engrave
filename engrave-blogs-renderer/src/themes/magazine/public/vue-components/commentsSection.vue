<template>
  <tree-view :root="tree" :show-root="false" class="comments-tree">
    <template v-slot:item="{ node }">
      {{ node.body }}
    </template>
  </tree-view>
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

<style>
</style>
