import "./BlogStoriesSection.css";
import blogstoriesicon from "../../../assets/images/blogstoriesicon.png";
import blogstoriessearchicon from "../../../assets/images/blogstoriessearchicon.png";

import blogstoriesimg1 from "../../../assets/images/blogstoriesimg1.jpg";
import blogstoriesimg2 from "../../../assets/images/blogstoriesimg2.jpg";
import blogstoriesimg3 from "../../../assets/images/blogstoriesimg3.jpg";
import blogstoriesimg4 from "../../../assets/images/blogstoriesimg4.jpg";
import blogstoriesimg5 from "../../../assets/images/blogstoriesimg5.jpg";


const featuredPosts = [
  {
    img: blogstoriesimg1,
    title: "Decision Making: Tracking Project Progress Like a Pro",
    desc: "Use analytics and reporting tools to measure success and optimize performance.",
  },
  {
    img: blogstoriesimg2,
    title: "How to Keep Remote Teams Aligned & Productive",
    desc: "Discover the best collaboration tools and strategies to manage remote teams effectively.",
  }
];

const gridPosts = [
  {
    img: blogstoriesimg3,
    title: "How to Keep Remote Teams Aligned & Productive",
    desc: "Discover the best collaboration tools and strategies to manage remote teams effectively.",
  },
  {
    img: blogstoriesimg4,
    title: "The Power of Automation: How to Eliminate Repetitive Tasks",
    desc: "Learn how to prioritize tasks, stay organized, and boost productivity with these essential techniques.",
  },
  {
    img: blogstoriesimg5,
    title: "The Power of Automation: How to Eliminate Repetitive Tasks",
    desc: "Learn how to prioritize tasks, stay organized, and boost productivity with these essential techniques.",
  }
];


function BlogCard({ post, large }) {
  return (
    <article className={`blogCard ${large ? "large" : "small"}`}>
      <div className="blogImage">
        <img src={post.img} alt={post.title} />
      </div>

      <div className="blogMeta">
        <span className="badge">Strategy</span>
        <span className="readTime">1 min read</span>
      </div>

      <h3>{post.title}</h3>
      <p>{post.desc}</p>
    </article>
  );
}


function BlogStoriesSection() {
  return (
    <section className="blogStories">

      {/* HEADER */}
      <div className="blogHeader">
        <div className="blogTitle">
          <div className="blogBadge">
            <img src={blogstoriesicon} alt="" />
            <span>Blogs</span>
          </div>

          <h2>LATEST STORIES</h2>
        </div>

        <div className="blogSearch">
          <input type="text" placeholder="search here" />
          <img src={blogstoriessearchicon} alt="" />
        </div>
      </div>

      {/* FEATURED */}
      <div className="combinedGrid">
        {[...featuredPosts, ...gridPosts].map((post, i) => (
          <BlogCard
            key={i}
            post={post}
            large={i < featuredPosts.length}
          />
        ))}
      </div>

    </section>
  );
}

export default BlogStoriesSection;
