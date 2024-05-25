const env = require("../env")
const models = require("../models")

exports.fetchLatestBlogs = () => {
    fetch(env.blogJsonEndPoint)
        .then((res) => res.json())
        .then(async (res) => {
            const blogs = res?.map((blog) => {
                return {
                    title: blog.title.rendered,
                    description:
                        blog.excerpt.rendered
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .replace(/\[(\/*)?vc_(.*?)\]/g, "")
                            .replace(/\n|\r/g, "") || "Read more about this on our blog",
                    url: blog.link,
                    date: blog.date,
                }
            })
            try {
                if (blogs?.length > 0) {
                    await models.blogs.deleteMany()
                    await models.blogs.insertMany(blogs)
                }
            } catch (error) {}
        })
        .catch((err) => {})
}
