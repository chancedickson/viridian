Vue.component("character-table", {
    template: "#character-table-template",
    replace: true,
    props: {
        data: Array,
        columns: Object
    },
    data: function() {
        return {
            sortKey: '',
            sortOrders: Object.keys(this.columns).reduce(function(acc, v) {
                acc[v] = 1
                return acc
            }, {})
        }
    },
    computed: {
        sortedData: function() {
            const sortKey = this.sortKey
            let data = this.data.slice()
            if (sortKey) {
                const sortOrder = this.sortOrders[sortKey]
                data = data.sort((a, b) => {
                    a = a[sortKey]
                    b = b[sortKey]
                    let order = 0
                    if (a > b) {
                        order = 1
                    } else if (a < b) {
                        order = -1
                    }
                    return order * sortOrder
                })
            }
            return data
        }
    },
    methods: {
        sortBy: function(key) {
            if (this.sortKey === key) {
                this.sortOrders[key] = this.sortOrders[key] * -1
            } else {
                this.sortKey = key
            }
        }
    }
})

fetch("/characters").then((response) => response.json()).then((data) => {
    new Vue({
        el: "#container",
        template: "#viridian",
        data: {
            data,
            columns: {
                player: "Player",
                name: "Name",
                realm: "Realm",
                class: "Class",
                role: "Role",
                ilvl: "iLvl",
                gear: "Gear"
            },
            avg: Math.floor(data.reduce((a, { ilvl: b }) => a + b, 0) / data.length)
        }
    })
})