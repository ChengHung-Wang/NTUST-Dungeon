let app = new Vue({
    el: "#root",
    data() {
        return {
            loading: true
        }
    },
    created() {
        setTimeout(() => {
            this.loading = false;
        }, 2000);
    }
})