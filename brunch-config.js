module.exports = {
    files: {
        javascripts: { joinTo: "main.js" }
    },
    plugins: {
        babel: {
            presets: ["es2016"]
        }
    }
}