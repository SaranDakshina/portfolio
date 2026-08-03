import styles from "./careerTimeline.module.scss";

export type TimelineStarState = "future" | "completed" | "active";

interface TimelineStarProps {
  state: TimelineStarState;
}

const STAR_PATH = "M12 1 15 9 23 12 15 15 12 23 9 15 1 12 9 9Z";

export default function TimelineStar({ state }: TimelineStarProps) {
  return (
    <svg
      className={`${styles.star} ${styles[`star--${state}`]}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={STAR_PATH} fill="currentColor" />
    </svg>
  );
}
