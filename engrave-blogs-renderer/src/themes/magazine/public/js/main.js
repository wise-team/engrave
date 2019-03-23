Vue.component("tree-view", {
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
  template: `
    <div class="tree-view">
        <div class="item" @click="toggleChildren" v-if="showRoot">
            <slot name="item" :node="root" />
        </div>
        <div class="children" v-if="showChildren()">
            <tree-view
                v-for="(node, index) in root.children"
                :key="index"
                :root="node"
            >
                <template v-slot:item="props">
                    <slot name="item" :node="props.node" />
                </template>
            </tree-view>
        </div>
    </div>
    `,
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
      console.log(
        "body=",
        this.root.body,
        "toggleChildren: childrenExpanded=",
        this.childrenExpanded,
        "showRoot=",
        this.showRoot,
        "showChildren()=",
        this.showChildren()
      );
      this.$emit("click", event);
    }
  }
});

Vue.component("comments", {
  template: `
        <tree-view :root="tree" :show-root="false" class="comments-tree">
            <template v-slot:item="{ node }">
                {{ node.body }}
            </template>
        </tree-view>
    `,
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
  }
});

import reksio from "./reksio.vue";

var comments = new Vue({
  el: "#comments",
  data: {
    name: "lenka"
  },
  components: {
    reksio
  }
});
