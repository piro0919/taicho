import { NextSeo, NextSeoProps } from "next-seo";

export type SeoProps = Pick<NextSeoProps, "noindex" | "title">;

function Seo({ noindex, title }: SeoProps): JSX.Element {
  return (
    <NextSeo
      noindex={noindex}
      title={title ? `${title} - たいちょ` : "たいちょ"}
    />
  );
}

export default Seo;
