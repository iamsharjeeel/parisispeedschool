import Image from 'next/image';
import { coaches, business } from '@/lib/content';

export function CoachProfiles() {
  return (
    <div className="coach-profiles">
      <p className="eyebrow">MEET THE HORSHAM TEAM</p>
      <div className="coach-grid">
        {coaches.map((coach) => (
          <article className="coach-card" key={coach.name}>
            <Image
              src={coach.photo}
              width={800}
              height={1000}
              sizes="(max-width:600px) 100vw, (max-width:1100px) 50vw, 25vw"
              alt={`${coach.name}, ${coach.role} at Parisi Horsham`}
            />
            <div>
              <h3>{coach.name}</h3>
              <p className="eyebrow">{coach.role}</p>
              <p>{coach.bio}</p>
            </div>
          </article>
        ))}
      </div>
      <a
        className="text-link section-page-link"
        href={`${business.website}/our-team`}
        target="_blank"
        rel="noreferrer"
      >
        Read the full coach biographies ↗
      </a>
    </div>
  );
}
