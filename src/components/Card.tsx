import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"] | CollectionEntry<"cars">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  // check if diecasts object, if yes, append /diecasts
  const link = frontmatter.scale ? `/diecasts${href}` : `${href}`;

  return (
    <li className="my-6">
      <a
        href={link}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      {
        pubDatetime && (
          <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
        )
      }
      <p>{description}</p>
    </li>
  );
}
