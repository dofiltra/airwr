import { TaskStatus } from 'dprx-types'

export function getStatusText(status: number) {
  switch (status) {
    case TaskStatus.InProgress:
      return 'InProgress'

    case TaskStatus.Completed:
      return 'Completed'
  }

  return 'NotStarted'
}

export function getBackgroundColorByStatus(status: number) {
  switch (status) {
    case TaskStatus.InProgress:
      return 'alert-info'
    case TaskStatus.Completed:
      return 'alert-success'
  }

  return ''
}
