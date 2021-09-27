import io from "figmaio/code"

import { APP_LINT, ERRORS_UPDATE, LINT_STOP } from '@events'
import { processNode } from '@utils/processNode'
import { get_linted_node, set_linted_node } from '@storage/lintedNode'
import { CanvasErrorManager } from '@utils/canvasErrorManager'
import { get_paint_styles } from '@storage/paintStyles'
import { get_text_styles } from '@storage/textStyles'

io.on(APP_LINT, async ({ settings, newLint } : { settings: Plugin.Settings, newLint: boolean}) => {
  // console.log('[Plugin] Initiating linting')

  const paintStyles = await get_paint_styles()
  const textStyles = await get_text_styles()
  const errorManager = new CanvasErrorManager({
    paintStyles,
    textStyles,
    settings
  })

  const selection = figma.currentPage.selection as SceneNode[]
  let name = undefined

  if (newLint) {
    
    if (selection.length === 0) {
      await set_linted_node(undefined)
      io.send(LINT_STOP)
      figma.notify("You need to select something for the linter to work")
    } else if (selection.length > 1) {
      await set_linted_node(undefined)
      io.send(LINT_STOP)
      figma.notify("For best performance, select only one object to lint")
    } else {
        const selection = figma.currentPage.selection[0] as SceneNode
        name = selection.name
        
        await set_linted_node(selection.id)
        // TODO: SHould make it async probably?
        processNode(selection, errorManager)
        // await asyncForEach(selection, (node: SceneNode) => processNode(node, errorManager)) 
    }
  } else {
    const nodeId = await get_linted_node() || ''
    const node = figma.getNodeById(nodeId) as SceneNode
    name = node.name

    if (nodeId && node) {
      processNode(node, errorManager)
    }
  }

  // console.log('Delete hidden:', errorManager.select('deleteHidden'))
  // console.log('Ungroup Single Group:', errorManager.select('ungroupSingleGroup'))
  // console.log('Pixel Perfect:', errorManager.select('pixelPerfect'))
  // console.log('Require fill style:', errorManager.select('requireFillStyles'))
  // console.log('Require text style:', errorManager.select('requireTextStyles'))
  // console.log('Require stroke style:', errorManager.select('requireStrokeStyles'))
  // console.log('Require effect style:', errorManager.select('requireEffectStyles'))
  
  // console.log(errorManager.errors)

  io.send(ERRORS_UPDATE, {
    name: name ? name : '',
    errors: errorManager.errors
  })

  return null
})