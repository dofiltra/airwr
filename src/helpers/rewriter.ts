import { TaskStatus } from 'dprx-types'

export function getRewriterStatusText(status: number) {
  switch (status) {
    case TaskStatus.InProgress:
      return 'InProgress'

    case TaskStatus.Completed:
      return 'Completed'
  }

  return 'NotStarted'
}
