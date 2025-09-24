import { CommandToken } from '../../CommandToken'
import { StatusBadge } from './StatusBadge'
import { ToolCallContentProps } from './types'
import { getApprovalStatusColor } from './utils/formatters'

interface GrepToolInput {
  pattern: string
  path?: string
  output_mode?: 'content' | 'files_with_matches' | 'count'
  glob?: string
  type?: string
  '-A'?: number
  '-B'?: number
  '-C'?: number
  '-i'?: boolean
  '-n'?: boolean
  head_limit?: number
  multiline?: boolean
}

export function GrepToolCallContent({
  toolInput,
  approvalStatus,
  toolResultContent,
  isFocused,
  isGroupItem,
}: ToolCallContentProps<GrepToolInput>) {
  const formatGrepResult = (content: string) => {
    const lines = content.split('\n').filter(l => l.trim())
    if (lines.length === 0) {
      return 'No matches found'
    }

    const outputMode = toolInput.output_mode || 'files_with_matches'

    if (outputMode === 'count') {
      // For count mode, show first few counts
      const firstLine = lines[0]
      if (lines.length === 1) {
        return firstLine
      }
      return `${firstLine} ... (${lines.length} files with counts)`
    }

    if (outputMode === 'files_with_matches') {
      // Show file count
      return `Found matches in ${lines.length} file${lines.length === 1 ? '' : 's'}`
    }

    // For content mode, show line count
    return `${lines.length} matching line${lines.length === 1 ? '' : 's'}`
  }

  const formattedResult = toolResultContent ? formatGrepResult(toolResultContent) : null

  const approvalStatusColor = getApprovalStatusColor(approvalStatus)
  let statusColor =
    isGroupItem && !approvalStatusColor ? 'text-[var(--terminal-accent)]' : approvalStatusColor

  // Build a description of the search parameters
  const searchDescription = []
  if (toolInput.path) searchDescription.push(`in ${toolInput.path}`)
  if (toolInput.glob) searchDescription.push(`(glob: ${toolInput.glob})`)
  if (toolInput.type) searchDescription.push(`(type: ${toolInput.type})`)
  if (toolInput['-i']) searchDescription.push('case-insensitive')
  if (toolInput.multiline) searchDescription.push('multiline')

  const contextDescription = []
  if (toolInput['-A']) contextDescription.push(`${toolInput['-A']} lines after`)
  if (toolInput['-B']) contextDescription.push(`${toolInput['-B']} lines before`)
  if (toolInput['-C']) contextDescription.push(`${toolInput['-C']} lines context`)

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`font-semibold ${statusColor || ''}`}>Grep</span>
            <span className="text-sm text-muted-foreground">
              <CommandToken>{toolInput.pattern}</CommandToken>
            </span>
          </div>
          {contextDescription.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              Context: {contextDescription.join(', ')}
            </div>
          )}
        </div>
        <div className="ml-4">
          <StatusBadge status={approvalStatus} />
        </div>
      </div>

      {formattedResult && (
        <div className="text-sm text-muted-foreground font-mono flex items-start gap-1">
          <span className="text-muted-foreground/50">⎿</span>
          <span>
            {formattedResult}
            {isFocused && toolResultContent && toolResultContent.split('\n').length > 1 && (
              <span className="text-xs text-muted-foreground/50 ml-2">
                <kbd className="px-1 py-0.5 text-xs bg-muted/50 rounded">i</kbd> expand
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  )
}
