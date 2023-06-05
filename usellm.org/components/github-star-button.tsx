"use client";
export function GitHubStarButton() {
  return (
    <div className="h-7">
      <a
        className="github-button"
        href="https://github.com/usellm/usellm"
        // data-color-scheme="no-preference: light; light: light; dark: dark;"
        data-size="large"
        data-show-count="true"
        aria-label="Star usellm/usellm on GitHub"
      >
        Star
      </a>
    </div>
  );
}
