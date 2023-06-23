interface GetGitHubUserOptions {
  name?: string;
  description?: string;
  gitHubApiToken?: string;
}

export function makeGetGitHubUser({
  name = "getGitHubUser",
  description = "Get the details of a GitHub user",
  gitHubApiToken = process.env.GITHUB_API_TOKEN || "",
}: GetGitHubUserOptions = {}) {
  return {
    call: (options: { username: string }) => {
      return fetch(`https://api.github.com/users/${options.username}`, {
        headers: gitHubApiToken
          ? {
              Authorization: `token ${gitHubApiToken}`,
            }
          : undefined,
      })
        .then((res) => res.json())
        .then((json) => {
          return {
            name: json.name,
            bio: json.bio,
            avatar: json.avatar_url,
            url: json.html_url,
            followers: json.followers,
            following: json.following,
            repos: json.public_repos,
            location: json.location,
            company: json.company,
          };
        });
    },
    schema: {
      name,
      description,
      parameters: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "The GitHub username",
          },
        },
        required: ["username"],
      },
    },
  };
}
