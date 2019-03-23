import commentsSection from "../vue-components/commentsSection.vue";
import treeView from "../vue-components/treeView.vue";

// registering globally, because it is a recursive component
Vue.component("tree-view", treeView);

var app = new Vue({
  el: "#comments",
  components: {
    commentsSection
  }
});
