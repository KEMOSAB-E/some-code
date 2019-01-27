<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import {cloneDeep6} from "./public/deep-clone.js"
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  },
  mounted () {
    var b = 1;
var a = {a1: b, a2: b};

a.a1 === a.a2 // true
a.aa=a;
var c = cloneDeep6(a);
//console.log(c.a1 === c.a2 )// true
//console.log(cloneDeep6(a))
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
