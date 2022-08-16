import { useParams } from "react-router-dom"
import { NoteIcon24 } from "../components/icons"
import { NoteCard } from "../components/note-card"
import { GlobalStateContext } from "../global-state"
import React from "react"
import { useActor } from "@xstate/react"

export function NotePage() {
  const { id = "" } = useParams()

  const globalState = React.useContext(GlobalStateContext)

  // TODO: Use selectors to avoid unnecessary rerenders
  const [state] = useActor(globalState.service)

  const backlinks = state.context.backlinks[id]

  return (
    <div className="flex max-w-lg flex-col gap-4 p-4">
      <div className="flex gap-2">
        <NoteIcon24 />
        <h1 className="text-lg font-semibold leading-[24px]">Note</h1>
      </div>

      <NoteCard id={id} />

      <h2 className="leading-none">Backlinks</h2>

      {backlinks?.map((id) => (
        <NoteCard key={id} id={id} />
      ))}
    </div>
  )
}
