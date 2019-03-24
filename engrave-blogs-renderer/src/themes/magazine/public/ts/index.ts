import Vue from 'vue';
import VueMoment from 'vue-moment';
import CommentsSection from '../components/CommentsSection.vue';

Vue.use(VueMoment);

const v = new Vue({
  el: '#comments',
  components: {
    CommentsSection,
  },
});
