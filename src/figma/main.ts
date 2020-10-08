import io from "figmaio/code"

import { APP_START } from "../constants/events"
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../constants/ui"
import { DOCUMENT_NAME, DOCUMENT_PAINT_STYLES, DB_VERSION } from "../constants/storage"
import { exportStylesListener } from "./listeners/exportStylesListener"
import { deleteStylesListener } from "./listeners/deleteStylesListener"
import { linterListener } from "./listeners/linterListener"
import { settingsListener } from "./listeners/settingsListener"
import { openedStateListener } from "./listeners/openedStateListener"
import { getSettings } from "./getSettings"
import { getOpenState } from "./getOpenState"
import { getDBVersion } from "./getDBVersion"

const main = async () => {
  const latestDBVersion = '2'

  figma.showUI(__html__, {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT
  })

  let name = (await figma.clientStorage.getAsync(DOCUMENT_NAME)) as string | undefined
  let styles = (await figma.clientStorage.getAsync(DOCUMENT_PAINT_STYLES)) as
    | Plugin.ExportedStyle[]
    | undefined
  const settings = await getSettings()
  const openedState = await getOpenState()
  const currentDBVersion = await getDBVersion()

  if (parseInt(currentDBVersion) < parseInt(latestDBVersion)) {
    name = undefined
    styles = []
    await figma.clientStorage.setAsync(DB_VERSION, latestDBVersion)
  } else {
    console.log('[Linter] Database up to date')
  }

  await exportStylesListener()
  await deleteStylesListener()
  await linterListener()
  await settingsListener()
  await openedStateListener()

  const launchProps: Plugin.LaunchProps = {
    documentName: name || "",
    documentPaintStyles: styles || [],
    settings: settings,
    isSynced: name !== undefined,
    openedState: openedState
  }

  /* When launching the plugin, figma sets a command
   * if it standard launch, the command is empty
   * if it is launched from the edit button, it says "edit"
   */
  switch (figma.command) {
    /* so far, we don't differentiate */
    default:
      /* Finally, sending the actual data over to the client */
      io.send(APP_START, launchProps)
      break
  }
}

main()
