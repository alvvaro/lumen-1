import { atom, useAtom, useAtomValue } from "jotai"
import { loadable } from "jotai/utils"
import React from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { Button } from "../components/button"
import { Card } from "../components/card"
import { CommandMenu } from "../components/command-menu"
import { LoadingIcon16, SettingsIcon24 } from "../components/icons"
import { Input } from "../components/input"
import { Panel } from "../components/panel"
import { githubRepoAtom, githubTokenAtom } from "../global-atoms"
import { useFetchNotes } from "../utils/github-sync"

export function SettingsPage() {
  const [githubToken] = useAtom(githubTokenAtom)
  const [githubRepo, setGitHubRepo] = useAtom(githubRepoAtom)
  const { fetchNotes } = useFetchNotes()
  const navigate = useNavigate()
  return (
    <>
      <CommandMenu />
      <Panel icon={<SettingsIcon24 />} title="Settings">
        <div className="p-4">
          <Card className="grid gap-5 p-4">
            <div className="grid gap-2">
              <h3 className="text-lg font-semibold !leading-none">GitHub</h3>
              <p>Store your notes as Markdown files in a GitHub repository of your choice.</p>
            </div>
            <GitHubAuth />
            {githubToken ? (
              <div className="grid gap-5">
                <form
                  id="github-form"
                  className="flex flex-col gap-4"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const formData = new FormData(event.currentTarget)
                    // const token = String(formData.get("token"))
                    const repoOwner = String(formData.get("repo-owner"))
                    const repoName = String(formData.get("repo-name"))

                    // setGitHubToken(token)
                    setGitHubRepo({ owner: repoOwner, name: repoName })

                    fetchNotes()
                    navigate("/")
                  }}
                >
                  {/* <div className="grid gap-2">
                <label htmlFor="auth-token" className="leading-4">
                  Personal access token
                </label>
                <Input id="token" name="token" spellCheck={false} defaultValue={githubToken} />
                <p className="markdown text-text-secondary">
                  Generate a{" "}
                  <a
                    href="https://github.com/settings/tokens/new"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    personal access token
                  </a>{" "}
                  with <code>repo</code> access, then paste it here.
                </p>
              </div> */}
                  <div className="grid gap-2">
                    <label htmlFor="repo-owner" className="leading-4">
                      Repository owner
                    </label>
                    <Input
                      id="repo-owner"
                      name="repo-owner"
                      spellCheck={false}
                      defaultValue={githubRepo?.owner}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="repo-name" className="leading-4">
                      Repository name
                    </label>
                    <Input
                      id="repo-name"
                      name="repo-name"
                      spellCheck={false}
                      defaultValue={githubRepo?.name}
                    />
                  </div>
                </form>
                <Button form="github-form" type="submit" variant="primary" className="mt-2">
                  Save
                </Button>
              </div>
            ) : null}
          </Card>
        </div>
      </Panel>
    </>
  )
}

const githubUserSchema = z.object({
  login: z.string(),
  avatar_url: z.string(),
})

const githubUserAtom = atom<Promise<z.infer<typeof githubUserSchema> | null>>(async (get) => {
  const token = get(githubTokenAtom)
  if (!token) return null

  // Fetch authenticated user
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
    },
  })

  if (!response.ok) return null

  const user = githubUserSchema.parse(await response.json())

  return user
})

function GitHubAuth() {
  const [githubToken, setGitHubToken] = useAtom(githubTokenAtom)
  const githubUser = useAtomValue(React.useMemo(() => loadable(githubUserAtom), []))

  if (!githubToken) {
    return (
      <Button variant="primary" onClick={() => setGitHubToken(import.meta.env.VITE_GITHUB_TOKEN)}>
        Sign in with GitHub
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-sm bg-bg-secondary p-4">
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="inline-block h-8 w-8 rounded-full bg-bg-secondary bg-cover ring-1 ring-inset ring-border-secondary coarse:h-10 coarse:w-10"
          style={{
            backgroundImage:
              githubUser.state === "hasData" ? `url(${githubUser.data?.avatar_url})` : undefined,
          }}
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm leading-3 coarse:leading-4">Signed in as</span>
          <span className="font-semibold leading-4 coarse:leading-5">
            {githubUser.state === "hasData" ? githubUser.data?.login : <>&nbsp;</>}
          </span>
        </div>
      </div>
      <Button onClick={() => setGitHubToken("")}>Sign out</Button>
    </div>
  )
}
