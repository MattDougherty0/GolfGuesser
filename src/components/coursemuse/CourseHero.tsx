import type { Course } from "@/lib/types";
import AerialFrame from "./AerialFrame";

interface CourseHeroProps {
  course: Course;
  identityLine: string;
  /** Omit yardage from hero when true (lab dataset vs setup-specific) */
  hideYardage?: boolean;
}

export default function CourseHero({ course, identityLine, hideYardage = true }: CourseHeroProps) {
  const { location, details, images, reveal } = course;

  return (
    <div className="space-y-4">
      <AerialFrame src={images.aerialMedium} alt={`Aerial view of ${course.name}`} />
      <div className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight text-cream sm:text-4xl">{course.name}</h1>
        <p className="text-sm text-cream/55">
          {location.city}, {location.state}
        </p>
        <p className="text-base text-cream/85 leading-snug">{identityLine}</p>
      </div>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-cream/45">Architect</dt>
          <dd className="text-cream/90">{details.architect}</dd>
        </div>
        <div>
          <dt className="text-cream/45">Opened</dt>
          <dd className="text-cream/90">{details.yearOpened}</dd>
        </div>
        <div>
          <dt className="text-cream/45">Access</dt>
          <dd className="capitalize text-cream/90">{details.type}</dd>
        </div>
        {!hideYardage ? (
          <div>
            <dt className="text-cream/45">Yardage (game dataset)</dt>
            <dd className="text-cream/90">{details.yardage.toLocaleString()}</dd>
          </div>
        ) : null}
        {reveal.notableTournaments.length > 0 ? (
          <div className="sm:col-span-2">
            <dt className="text-cream/45">Host events (high level)</dt>
            <dd className="text-cream/80">{reveal.notableTournaments.join(" · ")}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
