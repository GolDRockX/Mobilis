export default function ExperienceCard({ item }) {
  return (
    <div className="exp-card">
      <div className="exp-img">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="exp-body">
        <h3>{item.name}</h3>
        <p>{item.text}</p>

        <a href="#" className="exp-btn">
          View Details
          <span className="experience-arrow">→</span>
        </a>
      </div>
    </div>
  );
}
